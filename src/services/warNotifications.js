const cron = require('node-cron');
const { escapeHtml, parseApiDate } = require('../utils/helpers');
const clan = require('../callbacks/clan');

class WarNotificationService {
    constructor(clashOfClansClient, bot, chatId) {
        this.clashOfClansClient = clashOfClansClient;
        this.bot = bot;
        this.chatId = chatId; // Bildirimlerin gönderileceği grup/kanal ID'si
        this.notificationState = {
            lastWarState: null,
            notificationsSent: {
                warFound: false,
                oneHourStart: false,
                thirtyMinutesStart: false,
                fiveMinutesStart: false,
                warStarted: false,
                oneHourEnd: false,
                thirtyMinutesEnd: false,
                fiveMinutesEnd: false
            },
            lastWarEndTime: null
        };
        this.isRunning = false;
    }

    // Bildirim sistemi başlat
    start() {
        if (this.isRunning) {
            return;
        }
        
        // Her 5 dakikada bir kontrol et
        this.cronJob = cron.schedule('*/5 * * * *', async () => {
            await this.checkWarStatus();
        }, {
            scheduled: false
        });

        this.cronJob.start();
        this.isRunning = true;
    }

    // Bildirim sistemi durdur
    stop() {
        if (this.cronJob) {
            this.cronJob.stop();
            this.isRunning = false;
        }
    }

    // Savaş durumunu kontrol et
    async checkWarStatus() {
        try {
            const response = await this.clashOfClansClient.clanCurrentWarByTag('#9CPU2CQR');
            const clanName = await clan.getClanName(this.clashOfClansClient);
            
            // Savaş durumu değişti mi kontrol et
            if (response.state !== this.notificationState.lastWarState) {
                await this.handleStateChange(response, clanName);
            }

            // Savaşta ise zaman kontrolü yap
            if (response.state === 'preparation' || response.state === 'inWar') {
                await this.handleWarTimeChecks(response, clanName);
            }

            // Savaş bittiyse bildirim durumlarını sıfırla
            if (response.state === 'warEnded' && this.notificationState.lastWarState !== 'warEnded') {
                this.resetNotificationState();
            }

            this.notificationState.lastWarState = response.state;

        } catch (error) {
            console.error('❌ Savaş durumu kontrolünde hata:', error.message);
        }
    }

    // Durum değişikliği işle
    async handleStateChange(response, clanName) {
        const safeOpponentName = escapeHtml(response.opponent?.name || 'Bilinmeyen Rakip');
        
        switch (response.state) {
            case 'preparation':
                if (!this.notificationState.notificationsSent.warFound) {
                    const message = this.createWarFoundMessage(response, clanName, safeOpponentName);
                    await this.sendNotification(message);
                    this.notificationState.notificationsSent.warFound = true;
                }
                break;
                
            case 'inWar':
                if (!this.notificationState.notificationsSent.warStarted) {
                    const message = this.createWarStartedMessage(response, clanName, safeOpponentName);
                    await this.sendNotification(message);
                    this.notificationState.notificationsSent.warStarted = true;
                }
                break;
                
            case 'warEnded':
                const message = this.createWarEndedMessage(response, clanName, safeOpponentName);
                await this.sendNotification(message);
                break;
        }
    }

    // Zaman kontrollerini işle
    async handleWarTimeChecks(response, clanName) {
        const safeOpponentName = escapeHtml(response.opponent?.name || 'Bilinmeyen Rakip');
        
        // Savaş başlangıç zamanı kontrolü (preparation aşamasında)
        if (response.state === 'preparation' && response.startTime) {
            await this.checkTimeWarnings(
                response, 
                clanName, 
                safeOpponentName, 
                response.startTime, 
                'start',
                ['oneHourStart', 'thirtyMinutesStart', 'fiveMinutesStart']
            );
        }
        
        // Savaş bitiş zamanı kontrolü (inWar aşamasında)
        if (response.state === 'inWar' && response.endTime) {
            await this.checkTimeWarnings(
                response, 
                clanName, 
                safeOpponentName, 
                response.endTime, 
                'end',
                ['oneHourEnd', 'thirtyMinutesEnd', 'fiveMinutesEnd']
            );
        }
    }

    // Zaman uyarılarını kontrol et
    async checkTimeWarnings(response, clanName, opponentName, targetTimeString, timeType, notificationKeys) {
        const targetTime = parseApiDate(targetTimeString);
        if (!targetTime || isNaN(targetTime.getTime())) return;

        const now = new Date();
        const timeDiff = targetTime.getTime() - now.getTime();
        const minutesLeft = Math.floor(timeDiff / (1000 * 60));
        const hoursLeft = Math.floor(minutesLeft / 60);

        // 1 saat kaldı
        if (hoursLeft <= 1 && minutesLeft > 30 && !this.notificationState.notificationsSent[notificationKeys[0]]) {
            const message = this.createTimeWarningMessage(response, clanName, opponentName, minutesLeft, timeType);
            await this.sendNotification(message);
            this.notificationState.notificationsSent[notificationKeys[0]] = true;
        }

        // 30 dakika kaldı
        if (minutesLeft <= 30 && minutesLeft > 5 && !this.notificationState.notificationsSent[notificationKeys[1]]) {
            const message = this.createTimeWarningMessage(response, clanName, opponentName, minutesLeft, timeType);
            await this.sendNotification(message);
            this.notificationState.notificationsSent[notificationKeys[1]] = true;
        }

        // 5 dakika kaldı
        if (minutesLeft <= 5 && minutesLeft > 0 && !this.notificationState.notificationsSent[notificationKeys[2]]) {
            const message = this.createTimeWarningMessage(response, clanName, opponentName, minutesLeft, timeType);
            await this.sendNotification(message);
            this.notificationState.notificationsSent[notificationKeys[2]] = true;
        }
    }

    // Kalan süreyi formatla
    formatTimeLeft(minutes) {
        if (minutes <= 0) return 'Süre doldu';
        
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (hours > 0) {
            if (remainingMinutes > 0) {
                return `${hours} saat ${remainingMinutes} dakika`;
            } else {
                return `${hours} saat`;
            }
        } else {
            return `${remainingMinutes} dakika`;
        }
    }

    // Savaş bulundu mesajı
    createWarFoundMessage(response, clanName, opponentName) {
        const startDate = parseApiDate(response.startTime);
        const startTime = startDate ? startDate.toLocaleString('tr-TR') : 'Bilinmiyor';
        
        let timeLeftMessage = '';
        if (startDate) {
            const now = new Date();
            const timeDiff = startDate.getTime() - now.getTime();
            const minutesLeft = Math.floor(timeDiff / (1000 * 60));
            if (minutesLeft > 0) {
                timeLeftMessage = `⏰ Kalan Süre: ${this.formatTimeLeft(minutesLeft)}\n`;
            }
        }
        
        return `🔥 **SAVAŞ BULUNDU!** 🔥

⚔️ ${clanName} vs ${opponentName}
👥 Takım Boyutu: ${response.teamSize}v${response.teamSize}
🛠️ Durum: Hazırlık Aşaması
🚀 Başlangıç: ${startTime}
${timeLeftMessage}
📝 **Hazırlanın!**
• Savaş düzenlerinizi kontrol edin
• Taktiklerinizi planlayın
• Asker bağışlarınızı hazırlayın

🔔 Savaş başlamadan ve bitmeden önce ek bildirimler alacaksınız!`;
    }

    // Savaş başladı mesajı
    createWarStartedMessage(response, clanName, opponentName) {
        const endDate = parseApiDate(response.endTime);
        const endTime = endDate ? endDate.toLocaleString('tr-TR') : 'Bilinmiyor';
        
        let timeLeftMessage = '';
        if (endDate) {
            const now = new Date();
            const timeDiff = endDate.getTime() - now.getTime();
            const minutesLeft = Math.floor(timeDiff / (1000 * 60));
            if (minutesLeft > 0) {
                timeLeftMessage = `⏰ Kalan Süre: ${this.formatTimeLeft(minutesLeft)}\n`;
            }
        }
        
        return `🚨 **SAVAŞ BAŞLADI!** 🚨

⚔️ ${clanName} vs ${opponentName}
👥 ${response.teamSize}v${response.teamSize}
🏁 Bitiş: ${endTime}
${timeLeftMessage}
🎯 **Saldırın!**
• ${response.attacksPerMember} saldırı hakkınız var
• Strateji ile saldırın
• Yıldızları toplayın!

🏆 Zafer bizim olsun! 💪`;
    }

    // Zaman uyarısı mesajı
    createTimeWarningMessage(response, clanName, opponentName, minutesLeft, timeType) {
        const action = timeType === 'start' ? 'başlamasına' : 'bitmesine';
        const icon = timeType === 'start' ? '🚀' : '⏰';
        const status = response.state === 'preparation' ? 'Hazırlık' : 'Savaş Devam Ediyor';
        const timeLeftFormatted = this.formatTimeLeft(minutesLeft);
        
        // Urgency level based on time left
        let urgencyMessage = '';
        if (minutesLeft <= 5) {
            urgencyMessage = timeType === 'start' ? 
                '🔥 **SON DAKİKA!** Hazır olun, savaş başlıyor!' : 
                '🚨 **ACELE EDİN!** Saldırılarınızı tamamlayın!';
        } else if (minutesLeft <= 30) {
            urgencyMessage = timeType === 'start' ? 
                '⚡ **SON 30 DAKİKA!** Final hazırlıklarını yapın!' : 
                '⚡ **SON 30 DAKİKA!** Kalan saldırılarınızı yapın!';
        } else {
            urgencyMessage = timeType === 'start' ? 
                '🛡️ Son hazırlıklarınızı yapın!' : 
                '⚔️ Hala vakit var, stratejinizi planlayın!';
        }
        
        return `${icon} **${timeLeftFormatted.toUpperCase()} KALDI!** ${icon}

⚔️ ${clanName} vs ${opponentName}
📊 Durum: ${status}
⏱️ Savaş ${action} **${timeLeftFormatted}** kaldı!

${urgencyMessage}

${timeType === 'start' ? 
'📋 **Son Kontroller:**\n• Savaş düzeninizi kontrol edin\n• Askerleri hazırlayın\n• Büyüleri kontrol edin' : 
'🎯 **Unutmayın:**\n• Kalan saldırılarınızı yapın\n• Yıldızları kaçırmayın\n• Takım arkadaşlarınıza yardım edin'
}`;
    }

    // Savaş bitti mesajı
    createWarEndedMessage(response, clanName, opponentName) {
        const result = this.getWarResult(response);
        const resultIcon = response.clan.stars > response.opponent.stars ? '🎉' : 
                          response.clan.stars < response.opponent.stars ? '😢' : '🤝';
        
        return `${resultIcon} **SAVAŞ BİTTİ!** ${resultIcon}

⚔️ ${clanName} vs ${opponentName}
🏆 Sonuç: ${result}

📊 **FINAL SKORU:**
⭐ Yıldızlar: ${response.clan.stars} - ${response.opponent.stars}
💥 Hasar: %${response.clan.destructionPercentage.toFixed(1)} - %${response.opponent.destructionPercentage.toFixed(1)}
🎯 Saldırılar: ${response.clan.attacks}/${response.teamSize * response.attacksPerMember} - ${response.opponent.attacks}/${response.teamSize * response.attacksPerMember}

${response.clan.stars > response.opponent.stars ? 
'🎊 Tebrikler! Zafer bizim! 🏆\n🌟 Harika bir performans sergiledik!' : 
response.clan.stars < response.opponent.stars ?
'😤 Bir sonraki savaşta daha iyisini yapacağız! 💪\n📈 Öğrendiklerimizle güçleneceğiz!' :
'🤝 İyi mücadele! Berabere bittik! ⚖️\n💯 Her iki taraf da elinden geleni yaptı!'
}`;
    }

    // Savaş sonucunu belirle
    getWarResult(response) {
        if (response.clan.stars > response.opponent.stars) return 'KAZANDIK! 🎉';
        if (response.clan.stars < response.opponent.stars) return 'Kaybettik 😢';
        if (response.clan.destructionPercentage > response.opponent.destructionPercentage) return 'Hasarda Kazandık! 🎯';
        if (response.clan.destructionPercentage < response.opponent.destructionPercentage) return 'Hasarda Kaybettik 😤';
        return 'Berabere! 🤝';
    }

    // Bildirim gönder
    async sendNotification(message) {
        try {
            await this.bot.telegram.sendMessage(this.chatId, message, { parse_mode: 'Markdown' });
        } catch (error) {
            console.error('❌ Bildirim gönderilirken hata:', error.message);
        }
    }

    // Bildirim durumlarını sıfırla
    resetNotificationState() {
        this.notificationState.notificationsSent = {
            warFound: false,
            oneHourStart: false,
            thirtyMinutesStart: false,
            fiveMinutesStart: false,
            warStarted: false,
            oneHourEnd: false,
            thirtyMinutesEnd: false,
            fiveMinutesEnd: false
        };
    }

    // Durumu göster
    getStatus() {
        return {
            isRunning: this.isRunning,
            lastWarState: this.notificationState.lastWarState,
            notificationsSent: this.notificationState.notificationsSent
        };
    }
}

module.exports = WarNotificationService; 