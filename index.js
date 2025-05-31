require('dotenv').config();
const clashApi = require('clash-of-clans-api');
const { Telegraf } = require('telegraf');

const clan = require('./src/callbacks/clan');
const player = require('./src/callbacks/player');
const war = require('./src/callbacks/war');
const leagues = require('./src/callbacks/leagues');
const help = require('./src/callbacks/help');
const telegramReplies = require('./src/replies/telegram');
const WarNotificationService = require('./src/services/warNotifications');
const { isAdmin, logUnauthorizedAccess, logAdminAccess } = require('./src/utils/helpers');

// Telegram init
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.catch((err, ctx) => console.error(`Hata oluştu ${ctx.updateType} için:`, err.message));

// Clash of Clans API init
const clashOfClansClient = clashApi();

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
	const startMessage = await telegramReplies.getStarted(clashOfClansClient);
	ctx.replyWithHTML(startMessage);
});
bot.help(async (ctx) => {
	const startMessage = await telegramReplies.getStarted(clashOfClansClient);
	ctx.replyWithHTML(startMessage);
});
bot.launch();

// Klan komutları
bot.command('klan', async (ctx) => await clan.getClan(ctx, clashOfClansClient));
bot.command('uyeler', async (ctx) => await clan.getClanMembers(ctx, clashOfClansClient));

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
