require('dotenv').config();
const clashApi = require('clash-of-clans-api');
const { Telegraf } = require('telegraf');

// Environment variables debug
console.log('🔍 Environment Variables Debug:');
console.log('BOT_TOKEN:', process.env.BOT_TOKEN ? `SET (${process.env.BOT_TOKEN.substring(0, 10)}...)` : 'NOT SET');
console.log('NOTIFICATION_CHAT_ID:', process.env.NOTIFICATION_CHAT_ID || 'NOT SET');
console.log('ADMIN_USER_IDS:', process.env.ADMIN_USER_IDS || 'NOT SET');
console.log('COC_API_TOKEN:', process.env.COC_API_TOKEN ? `SET (${process.env.COC_API_TOKEN.substring(0, 10)}...)` : 'NOT SET');

// Bot token kontrolü
if (!process.env.BOT_TOKEN) {
	console.error('❌ HATA: BOT_TOKEN environment variable tanımlanmamış!');
	console.error('🔧 Çözüm: Replit Secrets bölümüne BOT_TOKEN ekleyin');
	process.exit(1);
}

// CoC API token kontrolü
if (!process.env.COC_API_TOKEN) {
	console.error('❌ HATA: COC_API_TOKEN environment variable tanımlanmamış!');
	console.error('🔧 Çözüm: Clash of Clans Developer Portal\'dan token alın ve COC_API_TOKEN olarak ekleyin');
	process.exit(1);
}

const clan = require('./src/callbacks/clan');
const player = require('./src/callbacks/player');
const war = require('./src/callbacks/war');
const leagues = require('./src/callbacks/leagues');
const help = require('./src/callbacks/help');
const telegramReplies = require('./src/replies/telegram');
const WarNotificationService = require('./src/services/warNotifications');
const { isAdmin, logUnauthorizedAccess, logAdminAccess } = require('./src/utils/helpers');

// Telegram init with detailed error handling
console.log('🤖 Telegram bot başlatılıyor...');
const bot = new Telegraf(process.env.BOT_TOKEN);

// Daha detaylı hata yakalama
bot.catch((err, ctx) => {
	console.error(`❌ Bot Hatası [${ctx.updateType}]:`, err);
	console.error('Hata detayları:', {
		message: err.message,
		code: err.code,
		response: err.response ? err.response.data : 'No response data'
	});
	
	// Kullanıcıya dostça hata mesajı gönder
	if (ctx && ctx.reply) {
		ctx.reply('⚠️ Geçici bir hata oluştu. Lütfen birkaç saniye sonra tekrar deneyin.').catch(() => {});
	}
});

// Clash of Clans API init with error handling
console.log('⚔️ Clash of Clans API başlatılıyor...');
let clashOfClansClient;
try {
	clashOfClansClient = clashApi({
		token: process.env.COC_API_TOKEN
	});
	console.log('✅ Clash of Clans API başarıyla başlatıldı');
} catch (error) {
	console.error('❌ Clash of Clans API hatası:', error.message);
	process.exit(1);
}

// Savaş bildirim servisi
let warNotificationService = null;

if (process.env.NOTIFICATION_CHAT_ID) {
	warNotificationService = new WarNotificationService(
		clashOfClansClient, 
		bot, 
		process.env.NOTIFICATION_CHAT_ID
	);
	warNotificationService.start();
} else {
	console.log('⚠️ NOTIFICATION_CHAT_ID tanımlanmadı, savaş bildirimleri devre dışı');
}

// Telegram commands
bot.start(async (ctx) => {
	try {
		const startMessage = await telegramReplies.getStarted(clashOfClansClient);
		ctx.replyWithHTML(startMessage);
	} catch (error) {
		console.error('❌ Start komut hatası:', error.message);
		ctx.reply('❌ Bot başlatılırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
	}
});

bot.help(async (ctx) => {
	try {
		const startMessage = await telegramReplies.getStarted(clashOfClansClient);
		ctx.replyWithHTML(startMessage);
	} catch (error) {
		console.error('❌ Help komut hatası:', error.message);
		ctx.reply('❌ Yardım menüsü yüklenirken hata oluştu.');
	}
});

// Bot launch with error handling
console.log('🚀 Bot başlatılıyor...');

// Önce webhook'u temizleyelim (Replit'te polling kullanmak için)
bot.telegram.deleteWebhook().then(() => {
	console.log('🧹 Webhook temizlendi, polling moduna geçiliyor...');
	return bot.launch();
}).then(() => {
	console.log('✅ Bot başarıyla başlatıldı ve çalışıyor!');
	console.log('🔄 Polling modu aktif - bot mesajları dinliyor');
}).catch((error) => {
	console.error('❌ Bot başlatma hatası:', error);
	console.error('Hata detayları:', {
		message: error.message,
		code: error.code,
		stack: error.stack?.split('\n')[0] // İlk satır stack trace
	});
	
	// Yaygın hataları kontrol et ve çözüm öner
	if (error.message.includes('401') || error.message.includes('Unauthorized')) {
		console.error('🔑 BOT TOKEN HATASI: Token geçersiz, eksik veya yanlış!');
		console.error('🔧 Çözümler:');
		console.error('   1. @BotFather\'dan yeni token alın');
		console.error('   2. Replit Secrets\'e BOT_TOKEN olarak ekleyin');
		console.error('   3. Token\'da ekstra boşluk olmadığından emin olun');
	} else if (error.message.includes('400') || error.message.includes('Bad Request')) {
		console.error('🔗 ISTEK HATASI: Telegram API isteği geçersiz');
		console.error('🔧 Çözümler:');
		console.error('   1. Bot\'u yeniden başlatın');
		console.error('   2. Token format kontrolü yapın');
		console.error('   3. Webhook ayarlarını kontrol edin');
	} else if (error.message.includes('429')) {
		console.error('⏰ RATE LIMIT: Çok fazla istek gönderildi');
		console.error('🔧 Çözüm: Birkaç dakika bekleyip tekrar deneyin');
	} else if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
		console.error('🌐 NETWORK HATASI: İnternet bağlantısı problemi');
		console.error('🔧 Çözüm: İnternet bağlantısını kontrol edin');
	}
	
	console.error('📞 Destek: Hata devam ederse README\'deki troubleshooting bölümüne bakın');
	process.exit(1);
});

// Klan komutları
bot.command('klan', async (ctx) => await clan.getClan(ctx, clashOfClansClient));
bot.command('uyeler', async (ctx) => await clan.getClanMembers(ctx, clashOfClansClient));

// Test komutu - hata debug için
bot.command('test', (ctx) => {
	try {
		console.log('📝 Test komutu çalıştırıldı:', {
			userId: ctx.from.id,
			username: ctx.from.username,
			firstName: ctx.from.first_name
		});
		ctx.reply('✅ Bot çalışıyor! Test başarılı.');
	} catch (error) {
		console.error('❌ Test komut hatası:', error);
		ctx.reply('❌ Test hatası: ' + error.message);
	}
});

// Bot bilgisi komutu
bot.command('botinfo', async (ctx) => {
	try {
		const botInfo = await bot.telegram.getMe();
		const message = `🤖 **Bot Bilgileri**

👤 Bot Adı: ${botInfo.first_name}
🆔 Bot ID: ${botInfo.id}
📝 Username: @${botInfo.username}
⚡ Durum: Aktif
🌐 Platform: Replit
📡 Node.js: ${process.version}`;
		
		ctx.replyWithMarkdown(message);
	} catch (error) {
		console.error('❌ Bot info hatası:', error);
		ctx.reply('❌ Bot bilgisi alınamadı: ' + error.message);
	}
});

// Oyuncu komutu
bot.command('oyuncu', async (ctx) => await player.getPlayer(ctx, clashOfClansClient));

// Savaş komutları
bot.command('savas', async (ctx) => await war.getCurrentWar(ctx, clashOfClansClient));
bot.command('savas_analiz', async (ctx) => await war.getWarAnalysis(ctx, clashOfClansClient));
bot.command('savas_saldirmayanlar', async (ctx) => await war.getNonAttackers(ctx, clashOfClansClient));
bot.command('savas_gecmis', async (ctx) => await war.getWarLog(ctx, clashOfClansClient));
bot.command('savas_lig', async (ctx) => await war.getWarLeague(ctx, clashOfClansClient));

// Sıralama komutları
bot.command('ligler', async (ctx) => await leagues.getWarLeagues(ctx, clashOfClansClient));
bot.command('klan_siralamasi', async (ctx) => await leagues.getClanRankings(ctx, clashOfClansClient));
bot.command('oyuncu_siralamasi', async (ctx) => await leagues.getPlayerRankings(ctx, clashOfClansClient));

// Admin paneli
bot.command('admin', async (ctx) => {
	const userId = ctx.from.id;
	
	if (!isAdmin(userId)) {
		logUnauthorizedAccess(ctx, '/admin');
		ctx.reply('❌ Bu komut sadece adminler içindir.');
		return;
	}
	
	logAdminAccess(ctx, 'Admin Paneli Erişimi');
	
	const clanName = await clan.getClanName(clashOfClansClient);
	const message = `🔧 **${clanName} - Admin Paneli**

👋 Merhaba Admin! Bu panelden bot yönetim işlemlerini yapabilirsin.

🔔 **Bildirim Sistemi Yönetimi:**
/bildirim_durum - Sistem durumunu görüntüle
/bildirim_baslat - Bildirim sistemini başlat
/bildirim_durdur - Bildirim sistemini durdur
/bildirim_test - Test bildirimi gönder

⚙️ **Sistem Bilgileri:**
• Bot Durumu: ✅ Aktif
• Bildirim Sistemi: ${warNotificationService ? '✅ Yapılandırılmış' : '❌ Yapılandırılmamış'}
• Admin ID: \`${userId}\`

💡 **İpucu:** Komutları hem alt çizgili hem de alt çizgisiz yazabilirsin!
⚠️ **Uyarı:** Bu komutlar sadece adminler tarafından kullanılabilir.`;
	
	ctx.replyWithMarkdown(message);
});

// Admin bildirim komutları
bot.command('bildirim_durum', (ctx) => {
	const userId = ctx.from.id;
	
	if (!isAdmin(userId)) {
		logUnauthorizedAccess(ctx, '/bildirim_durum');
		ctx.reply('❌ Bu komut sadece adminler içindir.');
		return;
	}
	
	if (!warNotificationService) {
		ctx.reply('❌ Savaş bildirim sistemi aktif değil.');
		return;
	}
	
	logAdminAccess(ctx, 'Bildirim Durumu Kontrolü');
	
	const status = warNotificationService.getStatus();
	const message = `📊 **Savaş Bildirim Sistemi Durumu**

🔄 Durum: ${status.isRunning ? '✅ Aktif' : '❌ Pasif'}
📝 Son Savaş Durumu: ${status.lastWarState || 'Bilinmiyor'}

🔔 **Gönderilen Bildirimler:**

🚀 **Savaş Başlangıcı:**
• Savaş Bulundu: ${status.notificationsSent.warFound ? '✅' : '❌'}
• 1 Saat Kaldı: ${status.notificationsSent.oneHourStart ? '✅' : '❌'}
• 30 Dakika Kaldı: ${status.notificationsSent.thirtyMinutesStart ? '✅' : '❌'}
• 5 Dakika Kaldı: ${status.notificationsSent.fiveMinutesStart ? '✅' : '❌'}
• Savaş Başladı: ${status.notificationsSent.warStarted ? '✅' : '❌'}

⏰ **Savaş Bitişi:**
• 1 Saat Kaldı: ${status.notificationsSent.oneHourEnd ? '✅' : '❌'}
• 30 Dakika Kaldı: ${status.notificationsSent.thirtyMinutesEnd ? '✅' : '❌'}
• 5 Dakika Kaldı: ${status.notificationsSent.fiveMinutesEnd ? '✅' : '❌'}

⏱️ Kontrol Sıklığı: Her 5 dakika
🔔 Toplam Bildirim Türü: 8 farklı bildirim`;
	
	ctx.replyWithMarkdown(message);
});

// Alt çizgisiz versiyon
bot.command('bildirimdurum', (ctx) => {
	const userId = ctx.from.id;
	
	if (!isAdmin(userId)) {
		logUnauthorizedAccess(ctx, '/bildirimdurum');
		ctx.reply('❌ Bu komut sadece adminler içindir.');
		return;
	}
	
	if (!warNotificationService) {
		ctx.reply('❌ Savaş bildirim sistemi aktif değil.');
		return;
	}
	
	logAdminAccess(ctx, 'Bildirim Durumu Kontrolü');
	
	const status = warNotificationService.getStatus();
	const message = `📊 **Savaş Bildirim Sistemi Durumu**

🔄 Durum: ${status.isRunning ? '✅ Aktif' : '❌ Pasif'}
📝 Son Savaş Durumu: ${status.lastWarState || 'Bilinmiyor'}

🔔 **Gönderilen Bildirimler:**

🚀 **Savaş Başlangıcı:**
• Savaş Bulundu: ${status.notificationsSent.warFound ? '✅' : '❌'}
• 1 Saat Kaldı: ${status.notificationsSent.oneHourStart ? '✅' : '❌'}
• 30 Dakika Kaldı: ${status.notificationsSent.thirtyMinutesStart ? '✅' : '❌'}
• 5 Dakika Kaldı: ${status.notificationsSent.fiveMinutesStart ? '✅' : '❌'}
• Savaş Başladı: ${status.notificationsSent.warStarted ? '✅' : '❌'}

⏰ **Savaş Bitişi:**
• 1 Saat Kaldı: ${status.notificationsSent.oneHourEnd ? '✅' : '❌'}
• 30 Dakika Kaldı: ${status.notificationsSent.thirtyMinutesEnd ? '✅' : '❌'}
• 5 Dakika Kaldı: ${status.notificationsSent.fiveMinutesEnd ? '✅' : '❌'}

⏱️ Kontrol Sıklığı: Her 5 dakika
🔔 Toplam Bildirim Türü: 8 farklı bildirim`;
	
	ctx.replyWithMarkdown(message);
});

bot.command('bildirim_baslat', (ctx) => {
	const userId = ctx.from.id;
	
	if (!isAdmin(userId)) {
		logUnauthorizedAccess(ctx, '/bildirim_baslat');
		ctx.reply('❌ Bu komut sadece adminler içindir.');
		return;
	}
	
	if (!warNotificationService) {
		ctx.reply('❌ Savaş bildirim sistemi yapılandırılmamış.');
		return;
	}
	
	logAdminAccess(ctx, 'Bildirim Sistemi Başlatma');
	warNotificationService.start();
	ctx.reply('🚀 Savaş bildirim sistemi başlatıldı!');
});

// Alt çizgisiz versiyon
bot.command('bildirimbaslat', (ctx) => {
	const userId = ctx.from.id;
	
	if (!isAdmin(userId)) {
		logUnauthorizedAccess(ctx, '/bildirimbaslat');
		ctx.reply('❌ Bu komut sadece adminler içindir.');
		return;
	}
	
	if (!warNotificationService) {
		ctx.reply('❌ Savaş bildirim sistemi yapılandırılmamış.');
		return;
	}
	
	logAdminAccess(ctx, 'Bildirim Sistemi Başlatma');
	warNotificationService.start();
	ctx.reply('🚀 Savaş bildirim sistemi başlatıldı!');
});

bot.command('bildirim_durdur', (ctx) => {
	const userId = ctx.from.id;
	
	if (!isAdmin(userId)) {
		logUnauthorizedAccess(ctx, '/bildirim_durdur');
		ctx.reply('❌ Bu komut sadece adminler içindir.');
		return;
	}
	
	if (!warNotificationService) {
		ctx.reply('❌ Savaş bildirim sistemi yapılandırılmamış.');
		return;
	}
	
	logAdminAccess(ctx, 'Bildirim Sistemi Durdurma');
	warNotificationService.stop();
	ctx.reply('⏹️ Savaş bildirim sistemi durduruldu!');
});

// Alt çizgisiz versiyon
bot.command('bildirimdurdur', (ctx) => {
	const userId = ctx.from.id;
	
	if (!isAdmin(userId)) {
		logUnauthorizedAccess(ctx, '/bildirimdurdur');
		ctx.reply('❌ Bu komut sadece adminler içindir.');
		return;
	}
	
	if (!warNotificationService) {
		ctx.reply('❌ Savaş bildirim sistemi yapılandırılmamış.');
		return;
	}
	
	logAdminAccess(ctx, 'Bildirim Sistemi Durdurma');
	warNotificationService.stop();
	ctx.reply('⏹️ Savaş bildirim sistemi durduruldu!');
});

bot.command('bildirim_test', async (ctx) => {
	const userId = ctx.from.id;
	const userName = ctx.from.first_name || 'Bilinmeyen';
	
	if (!isAdmin(userId)) {
		logUnauthorizedAccess(ctx, '/bildirim_test');
		ctx.reply('❌ Bu komut sadece adminler içindir.');
		return;
	}
	
	if (!warNotificationService) {
		ctx.reply('❌ Savaş bildirim sistemi yapılandırılmamış.');
		return;
	}
	
	logAdminAccess(ctx, 'Test Bildirimi Gönderme');
	
	// Test bildirimi gönder
	const testMessage = `🧪 **TEST BİLDİRİMİ** 🧪

Bu bir test mesajıdır. Savaş bildirim sistemi çalışıyor!

✅ Sistem durumu: Aktif
📍 Chat ID: ${process.env.NOTIFICATION_CHAT_ID}
👤 Test yapan admin: ${userName} (${userId})
⏰ Zaman: ${new Date().toLocaleString('tr-TR')}`;
	
	try {
		await bot.telegram.sendMessage(process.env.NOTIFICATION_CHAT_ID, testMessage, { parse_mode: 'Markdown' });
		ctx.reply('✅ Test bildirimi gönderildi!');
	} catch (error) {
		ctx.reply(`❌ Test bildirimi gönderilemedi: ${error.message}`);
	}
});

// Alt çizgisiz versiyon
bot.command('bildirimtest', async (ctx) => {
	const userId = ctx.from.id;
	const userName = ctx.from.first_name || 'Bilinmeyen';
	
	if (!isAdmin(userId)) {
		logUnauthorizedAccess(ctx, '/bildirimtest');
		ctx.reply('❌ Bu komut sadece adminler içindir.');
		return;
	}
	
	if (!warNotificationService) {
		ctx.reply('❌ Savaş bildirim sistemi yapılandırılmamış.');
		return;
	}
	
	logAdminAccess(ctx, 'Test Bildirimi Gönderme');
	
	// Test bildirimi gönder
	const testMessage = `🧪 **TEST BİLDİRİMİ** 🧪

Bu bir test mesajıdır. Savaş bildirim sistemi çalışıyor!

✅ Sistem durumu: Aktif
👤 Test yapan admin: ${userName} 
⏰ Zaman: ${new Date().toLocaleString('tr-TR')}`;
	
	try {
		await bot.telegram.sendMessage(process.env.NOTIFICATION_CHAT_ID, testMessage, { parse_mode: 'Markdown' });
		ctx.reply('✅ Test bildirimi gönderildi!');
	} catch (error) {
		ctx.reply(`❌ Test bildirimi gönderilemedi: ${error.message}`);
	}
});

// Yardım komutları
bot.command('yardim', async (ctx) => {
	const startMessage = await telegramReplies.getStarted(clashOfClansClient);
	ctx.replyWithHTML(startMessage);
});
bot.command('yardim_klan', async (ctx) => {
	const helpMessage = await help.getHelpClan(clashOfClansClient);
	ctx.replyWithHTML(helpMessage);
});
bot.command('yardim_oyuncu', (ctx) => ctx.replyWithHTML(help.getHelpPlayer()));
bot.command('yardim_savas', async (ctx) => {
	const helpMessage = await help.getHelpWar(clashOfClansClient);
	ctx.replyWithHTML(helpMessage);
});
bot.command('yardim_lig', (ctx) => ctx.replyWithHTML(help.getHelpLeague()));
bot.command('yardim_genel', async (ctx) => {
	const helpMessage = await help.getHelpGeneral(clashOfClansClient);
	ctx.replyWithHTML(helpMessage);
});

// Mesaj geldiğinde (# ile başlayan taglar için)
bot.on('message', async (ctx) => {
	const { text } = ctx.message;
	if (text && text.charAt(0) == '#') {
		const tag = text.substring(0, 10);
		ctx.reply(await player.playerMessage(tag, clashOfClansClient));
	}
});

console.log('🤖 Bot başlatıldı!');
if (warNotificationService) {
	console.log('🔔 Savaş bildirim sistemi aktif');
}
if (process.env.ADMIN_USER_IDS) {
	const adminCount = process.env.ADMIN_USER_IDS.split(',').length;
	console.log(`👥 ${adminCount} admin tanımlı`);
}

// Replit için keep-alive servisi
const http = require('http');
const server = http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.end('Telegram Bot is running! 🤖');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`🌐 Keep-alive server listening on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
	console.log('🛑 Bot durduruluyor...');
	if (warNotificationService) {
		warNotificationService.stop();
	}
	bot.stop('SIGINT');
	process.exit(0);
});

process.on('SIGTERM', () => {
	console.log('🛑 Bot durduruluyor...');
	if (warNotificationService) {
		warNotificationService.stop();
	}
	bot.stop('SIGTERM');
	process.exit(0);
});
