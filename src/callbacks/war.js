const clashOfClansReplies = require('../replies/clash_of_clans');
const { escapeHtml, parseApiDate, getWarTimeStatus } = require('../utils/helpers');

// Mevcut savaş bilgilerini getir
const getCurrentWar = async (ctx, clashOfClansClient) => {
	let message = '';
	try {
		console.log('🔍 Savaş bilgisi isteniyor...');
		const response = await clashOfClansClient.clanCurrentWarByTag('#9CPU2CQR');
		
		if (response.state === 'notInWar') {
			message = '🕊️ Klan şu anda savaşta değil.';
		} else {
			console.log('⚔️ Savaş bilgisi bulundu, formatlanıyor...');
			
			// Güvenli isim formatı
			const safeClanName = escapeHtml(response.clan.name || 'Bilinmeyen Klan');
			const safeOpponentName = escapeHtml(response.opponent.name || 'Bilinmeyen Rakip');
			
			// Kısaltılmış mesaj formatı
			message = `⚔️ <b>${safeClanName} vs ${safeOpponentName}</b>\n\n`;
			
			// Temel bilgiler
			message += `📊 <b>DURUM</b>\n`;
			message += `📅 ${getWarState(response.state)}\n`;
			message += `👥 ${response.teamSize}v${response.teamSize}\n`;
			message += `🎯 ${response.attacksPerMember} saldırı/üye\n\n`;
			
			// Skor
			message += `🏆 <b>SKOR</b>\n`;
			message += `⭐ ${response.clan.stars || 0} - ${response.opponent.stars || 0}\n`;
			message += `💥 %${(response.clan.destructionPercentage || 0).toFixed(1)} - %${(response.opponent.destructionPercentage || 0).toFixed(1)}\n`;
			message += `🎯 ${response.clan.attacks || 0}/${response.teamSize * response.attacksPerMember} - ${response.opponent.attacks || 0}/${response.teamSize * response.attacksPerMember}\n\n`;
			
			// Basit durum değerlendirmesi
			if (response.clan.stars > response.opponent.stars) {
				message += '🎉 <b>Önde gidiyoruz!</b>\n';
			} else if (response.clan.stars < response.opponent.stars) {
				message += '😤 <b>Gerideyiz, saldırın!</b>\n';
			} else {
				message += '🤝 <b>Eşitlik!</b>\n';
			}
			
			// Kalan saldırı bilgisi
			if (response.clan.members && response.clan.members.length > 0) {
				const totalAttacks = response.teamSize * response.attacksPerMember;
				const usedAttacks = response.clan.attacks || 0;
				const remainingAttacks = totalAttacks - usedAttacks;
				
				message += `\n🎯 <b>SALDIRI</b>\n`;
				message += `✅ Kullanılan: ${usedAttacks}/${totalAttacks}\n`;
				message += `⏳ Kalan: ${remainingAttacks}\n`;
				
				// Sadece eksik saldırı sayısı
				const incompleteAttackers = response.clan.members.filter(member => {
					const memberAttacks = member.attacks ? member.attacks.length : 0;
					return memberAttacks < response.attacksPerMember;
				});
				
				if (incompleteAttackers.length > 0) {
					message += `⚠️ Eksik saldırı: ${incompleteAttackers.length} üye\n`;
				}
			}
			
			message += `\n📝 Detaylı analiz için: /savas_analiz`;
		}
		
		console.log('✅ Savaş mesajı hazırlandı, gönderiliyor...');
		
		// Mesaj uzunluğu kontrolü (Telegram limit: 4096 karakter)
		if (message.length > 4000) {
			message = message.substring(0, 3950) + '\n\n... (Mesaj çok uzun, detaylar kısaltıldı)';
		}
		
	} catch (e) {
		console.error('❌ Savaş bilgisi hatası:', e);
		message = `❌ Savaş bilgisi alınamadı: ${e.message}\n\n🔧 Lütfen birkaç saniye sonra tekrar deneyin.`;
	}
	
	try {
		await ctx.replyWithHTML(message);
		console.log('✅ Savaş mesajı başarıyla gönderildi');
	} catch (replyError) {
		console.error('❌ Mesaj gönderme hatası:', replyError);
		// Fallback: HTML olmadan gönder
		try {
			await ctx.reply(message.replace(/<[^>]*>/g, ''));
		} catch (fallbackError) {
			console.error('❌ Fallback mesaj da gönderilemedi:', fallbackError);
			await ctx.reply('❌ Savaş bilgisi gösterilirken teknik bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
		}
	}
};

// Saldırı yapmayanları listele
const getNonAttackers = async (ctx, clashOfClansClient) => {
	let message = '';
	try {
		console.log('🔍 Eksik saldırı listesi isteniyor...');
		const response = await clashOfClansClient.clanCurrentWarByTag('#9CPU2CQR');
		
		if (response.state === 'notInWar') {
			message = '🕊️ Klan şu anda savaşta değil.';
		} else {
			const safeClanName = escapeHtml(response.clan.name || 'Bilinmeyen Klan');
			
			message = `⚠️ <b>EKSİK SALDIRI LİSTESİ</b>\n\n`;
			message += `🏛️ Klan: ${safeClanName}\n`;
			message += `🎯 ${response.attacksPerMember} saldırı/üye\n\n`;
			
			if (response.clan.members && response.clan.members.length > 0) {
				// Hiç saldırmayanlar
				const nonAttackers = response.clan.members.filter(member => 
					!member.attacks || member.attacks.length === 0
				);
				
				// Eksik saldırı yapanlar
				const partialAttackers = response.clan.members.filter(member => {
					const memberAttacks = member.attacks ? member.attacks.length : 0;
					return memberAttacks > 0 && memberAttacks < response.attacksPerMember;
				});
				
				// Tam saldırı yapanlar
				const fullAttackers = response.clan.members.filter(member => {
					const memberAttacks = member.attacks ? member.attacks.length : 0;
					return memberAttacks === response.attacksPerMember;
				});
				
				// Hiç saldırmayanlar (maksimum 20 kişi göster)
				if (nonAttackers.length > 0) {
					message += `❌ <b>HİÇ SALDIRMAYAN (${nonAttackers.length})</b>\n`;
					const displayNonAttackers = nonAttackers.slice(0, 20);
					displayNonAttackers
						.sort((a, b) => b.townhallLevel - a.townhallLevel)
						.forEach((member, index) => {
							const safeName = escapeHtml(member.name || 'Bilinmeyen');
							message += `${index + 1}. ${safeName} (TH${member.townhallLevel})\n`;
						});
					if (nonAttackers.length > 20) {
						message += `... ve ${nonAttackers.length - 20} kişi daha\n`;
					}
					message += '\n';
				}
				
				// Eksik saldırı yapanlar (maksimum 15 kişi göster)
				if (partialAttackers.length > 0) {
					message += `⚠️ <b>EKSİK SALDIRI (${partialAttackers.length})</b>\n`;
					const displayPartialAttackers = partialAttackers.slice(0, 15);
					displayPartialAttackers
						.sort((a, b) => b.townhallLevel - a.townhallLevel)
						.forEach((member, index) => {
							const safeName = escapeHtml(member.name || 'Bilinmeyen');
							const memberAttacks = member.attacks ? member.attacks.length : 0;
							message += `${index + 1}. ${safeName} (TH${member.townhallLevel}) - ${memberAttacks}/${response.attacksPerMember}\n`;
						});
					if (partialAttackers.length > 15) {
						message += `... ve ${partialAttackers.length - 15} kişi daha\n`;
					}
					message += '\n';
				}
				
				// Özet
				message += `📊 <b>ÖZET</b>\n`;
				message += `✅ Tam saldırı: ${fullAttackers.length}\n`;
				message += `⚠️ Eksik saldırı: ${partialAttackers.length}\n`;
				message += `❌ Hiç saldırmayan: ${nonAttackers.length}\n`;
				
				if (nonAttackers.length === 0 && partialAttackers.length === 0) {
					message += `\n🎉 <b>Harika! Tüm üyeler saldırılarını tamamlamış!</b>`;
				}
			}
		}
		
		console.log('✅ Eksik saldırı listesi hazırlandı');
		
		// Mesaj uzunluğu kontrolü
		if (message.length > 4000) {
			message = message.substring(0, 3950) + '\n\n... (Liste çok uzun, kısaltıldı)';
		}
		
	} catch (e) {
		console.error('❌ Eksik saldırı listesi hatası:', e);
		message = `❌ Eksik saldırı listesi alınamadı: ${e.message}\n\n🔧 Lütfen birkaç saniye sonra tekrar deneyin.`;
	}
	
	try {
		await ctx.replyWithHTML(message);
		console.log('✅ Eksik saldırı listesi başarıyla gönderildi');
	} catch (replyError) {
		console.error('❌ Mesaj gönderme hatası:', replyError);
		// Fallback: HTML olmadan gönder
		try {
			await ctx.reply(message.replace(/<[^>]*>/g, ''));
		} catch (fallbackError) {
			console.error('❌ Fallback mesaj da gönderilemedi:', fallbackError);
			await ctx.reply('❌ Eksik saldırı listesi gösterilirken teknik bir hata oluştu.');
		}
	}
};

// Detaylı savaş analizi
const getWarAnalysis = async (ctx, clashOfClansClient) => {
	let message = '';
	try {
		const response = await clashOfClansClient.clanCurrentWarByTag('#9CPU2CQR');
		if (response.state === 'notInWar') {
			message = '🕊️ Klan şu anda savaşta değil.';
		} else {
			const safeClanName = escapeHtml(response.clan.name);
			const safeOpponentName = escapeHtml(response.opponent.name);
			
			message += `***** 📊 SAVAŞ ANALİZİ *****\n\n`;
			message += `⚔️ ${safeClanName} vs ${safeOpponentName}\n\n`;
			
			// Townhall analizi
			const ourTHs = {};
			const enemyTHs = {};
			
			response.clan.members.forEach(member => {
				const th = member.townhallLevel;
				ourTHs[th] = (ourTHs[th] || 0) + 1;
			});
			
			response.opponent.members.forEach(member => {
				const th = member.townhallLevel;
				enemyTHs[th] = (enemyTHs[th] || 0) + 1;
			});
			
			message += `🏠 **TOWNHALL DAĞILIMI**\n`;
			const allTHs = new Set([...Object.keys(ourTHs), ...Object.keys(enemyTHs)]);
			const sortedTHs = Array.from(allTHs).sort((a, b) => b - a);
			
			sortedTHs.forEach(th => {
				const our = ourTHs[th] || 0;
				const enemy = enemyTHs[th] || 0;
				message += `TH${th}: ${our} - ${enemy}\n`;
			});
			
			// Saldırı verimliliği
			message += `\n⚔️ **SALDIRI VERİMLİLİĞİ**\n`;
			
			let our3Stars = 0, our2Stars = 0, our1Stars = 0, our0Stars = 0;
			let enemy3Stars = 0, enemy2Stars = 0, enemy1Stars = 0, enemy0Stars = 0;
			
			// Bizim saldırılarımız
			response.clan.members.forEach(member => {
				if (member.attacks) {
					member.attacks.forEach(attack => {
						if (attack.stars === 3) our3Stars++;
						else if (attack.stars === 2) our2Stars++;
						else if (attack.stars === 1) our1Stars++;
						else our0Stars++;
					});
				}
			});
			
			// Rakip saldırıları
			response.opponent.members.forEach(member => {
				if (member.attacks) {
					member.attacks.forEach(attack => {
						if (attack.stars === 3) enemy3Stars++;
						else if (attack.stars === 2) enemy2Stars++;
						else if (attack.stars === 1) enemy1Stars++;
						else enemy0Stars++;
					});
				}
			});
			
			message += `🌟 3 Yıldız: ${our3Stars} - ${enemy3Stars}\n`;
			message += `⭐ 2 Yıldız: ${our2Stars} - ${enemy2Stars}\n`;
			message += `⭐ 1 Yıldız: ${our1Stars} - ${enemy1Stars}\n`;
			message += `❌ 0 Yıldız: ${our0Stars} - ${enemy0Stars}\n`;
			
			// Ortalama hasar
			const ourTotalDamage = response.clan.destructionPercentage * response.clan.attacks / 100;
			const enemyTotalDamage = response.opponent.destructionPercentage * response.opponent.attacks / 100;
			
			if (response.clan.attacks > 0 && response.opponent.attacks > 0) {
				const ourAvgDamage = (ourTotalDamage / response.clan.attacks) * 100;
				const enemyAvgDamage = (enemyTotalDamage / response.opponent.attacks) * 100;
				
				message += `\n💥 **ORTALAMA HASAR**\n`;
				message += `Bizim: %${ourAvgDamage.toFixed(1)}\n`;
				message += `Rakip: %${enemyAvgDamage.toFixed(1)}\n`;
			}
		}
	} catch (e) {
		message = clashOfClansReplies.getErrorMessage(e);
	}
	ctx.replyWithHTML(message);
};

// Savaş geçmişi
const getWarLog = async (ctx, clashOfClansClient) => {
	let message = '';
	try {
		const response = await clashOfClansClient.clanWarlogByTag('#9CPU2CQR');
		const { items } = response;
		
		message += '*****📋 Savaş Geçmişi*****\n\n';
		
		for (let i = 0; i < Math.min(items.length, 5); i++) {
			const war = items[i];
			const safeClanName = escapeHtml(war.clan.name);
			const safeOpponentName = escapeHtml(war.opponent.name);
			
			message += `${i+1}. ${safeClanName} vs ${safeOpponentName}\n`;
			message += `   ${getWarResult(war.result)} - ⭐${war.clan.stars} vs ⭐${war.opponent.stars}\n`;
			message += `   💥 %${war.clan.destructionPercentage} vs %${war.opponent.destructionPercentage}\n`;
			message += `   👥 ${war.teamSize}v${war.teamSize}\n`;
			
			if (war.endTime) {
				const endDate = parseApiDate(war.endTime);
				if (endDate && !isNaN(endDate.getTime())) {
					message += `   📅 ${endDate.toLocaleDateString('tr-TR')}\n`;
				}
			}
			message += '\n';
		}
		
		if (items.length > 5) {
			message += `... ve ${items.length - 5} savaş daha\n`;
		}
		
		// İstatistikler
		const wins = items.filter(war => war.result === 'win').length;
		const losses = items.filter(war => war.result === 'lose').length;
		const ties = items.filter(war => war.result === 'tie').length;
		
		message += `\n📊 **SON ${items.length} SAVAŞ İSTATİSTİKLERİ**\n`;
		message += `🎉 Galibiyet: ${wins}\n`;
		message += `😞 Mağlubiyet: ${losses}\n`;
		message += `🤝 Beraberlik: ${ties}\n`;
		
		if (items.length > 0) {
			const winRate = Math.round((wins / items.length) * 100);
			message += `📈 Kazanma Oranı: %${winRate}\n`;
		}
		
	} catch (e) {
		message = clashOfClansReplies.getErrorMessage(e);
	}
	ctx.replyWithHTML(message);
};

// Klan Savaş Ligi
const getWarLeague = async (ctx, clashOfClansClient) => {
	let message = '';
	try {
		const response = await clashOfClansClient.clanLeague('#9CPU2CQR');
		
		message += `***** 🏆 Klan Savaş Ligi *****\n\n`;
		message += `🎯 Durum: ${response.state}\n`;
		message += `🏆 Sezon: ${response.season}\n`;
		
		if (response.clans && response.clans.length > 0) {
			message += `\n👥 **KATILAN KLANLAR (${response.clans.length})**\n`;
			response.clans.forEach((clan, index) => {
				const safeName = escapeHtml(clan.name);
				message += `${index + 1}. ${safeName} - <code>${clan.tag}</code>\n`;
			});
		}
		
	} catch (e) {
		if (e.statusCode === 404) {
			message = '🏆 Klan şu anda Klan Savaş Ligi\'nde değil.';
		} else {
			message = clashOfClansReplies.getErrorMessage(e);
		}
	}
	ctx.replyWithHTML(message);
};

// Yardımcı fonksiyonlar
function getWarState(state) {
	switch (state) {
		case 'preparation': return 'Hazırlık 🛠️';
		case 'inWar': return 'Savaşta ⚔️';
		case 'warEnded': return 'Bitti 🏁';
		default: return state;
	}
}

function getBattleModifier(modifier) {
	switch (modifier) {
		case 'none': return 'Normal';
		case 'friendly': return 'Dostane';
		default: return modifier;
	}
}

function getWarResult(result) {
	switch (result) {
		case 'win': return '🎉 Kazandık';
		case 'lose': return '😞 Kaybettik';
		case 'tie': return '🤝 Berabere';
		default: return result;
	}
}

module.exports = {
	getCurrentWar,
	getNonAttackers,
	getWarAnalysis,
	getWarLog,
	getWarLeague,
};
