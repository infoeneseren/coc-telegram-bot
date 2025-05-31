// HTML güvenlik fonksiyonu
function escapeHtml(text) {
	if (!text) return text;
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;');
}

// API tarih formatını Date objesine çevir
function parseApiDate(dateString) {
	if (!dateString) return null;
	
	// Format: "20250529T130521.000Z" -> "2025-05-29T13:05:21.000Z"
	const formatted = dateString.replace(
		/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})\.(\d{3})Z$/,
		'$1-$2-$3T$4:$5:$6.$7Z'
	);
	
	return new Date(formatted);
}

// Kalan süreyi hesapla
function getTimeRemaining(targetDate) {
	const now = new Date();
	const diffMs = targetDate.getTime() - now.getTime();
	
	if (diffMs <= 0) {
		return null;
	}
	
	const hours = Math.floor(diffMs / (1000 * 60 * 60));
	const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
	
	if (hours > 0) {
		return `${hours} saat ${minutes} dakika`;
	} else {
		return `${minutes} dakika`;
	}
}

// Savaş zaman durumu
function getWarTimeStatus(warState, startTime, endTime) {
	const now = new Date();
	
	if (warState === 'preparation') {
		if (startTime) {
			const remaining = getTimeRemaining(startTime);
			if (remaining) {
				return `⏳ Savaş başlamasına ${remaining} kaldı`;
			} else {
				return `🚀 Savaş başladı!`;
			}
		}
	} else if (warState === 'inWar') {
		if (endTime) {
			const remaining = getTimeRemaining(endTime);
			if (remaining) {
				return `⏰ Savaş bitişine ${remaining} kaldı`;
			} else {
				return `🏁 Savaş bitti!`;
			}
		}
	} else if (warState === 'warEnded') {
		return `✅ Savaş tamamlandı`;
	}
	
	return '';
}

// Admin kontrolü
function isAdmin(userId) {
	if (!process.env.ADMIN_USER_IDS) return false;
	
	const adminIds = process.env.ADMIN_USER_IDS.split(',').map(id => id.trim());
	return adminIds.includes(userId.toString());
}

// Yetkisiz erişim logları
function logUnauthorizedAccess(ctx, command) {
	const userId = ctx.from.id;
	const userName = ctx.from.first_name || 'Bilinmeyen';
	const userUsername = ctx.from.username ? `@${ctx.from.username}` : 'Username yok';
	const userLastName = ctx.from.last_name || '';
	const fullName = userLastName ? `${userName} ${userLastName}` : userName;
	
	console.log(`🚫 YETKİSİZ ERİŞİM DENEMESİ:`);
	console.log(`   👤 Ad: ${fullName}`);
	console.log(`   🆔 ID: ${userId}`);
	console.log(`   💬 Username: ${userUsername}`);
	console.log(`   📱 Komut: ${command}`);
	console.log(`   ⏰ Zaman: ${new Date().toLocaleString('tr-TR')}`);
	console.log(`   🌐 Dil: ${ctx.from.language_code || 'Bilinmiyor'}`);
	console.log(`   ──────────────────────────────────────`);
}

// Admin erişim logları
function logAdminAccess(ctx, action) {
	const userId = ctx.from.id;
	const userName = ctx.from.first_name || 'Bilinmeyen';
	const userUsername = ctx.from.username ? `@${ctx.from.username}` : 'Username yok';
	
	console.log(`✅ ADMIN ERİŞİMİ: ${action}`);
	console.log(`   👤 Admin: ${userName} (${userUsername})`);
	console.log(`   🆔 ID: ${userId}`);
	console.log(`   ⏰ Zaman: ${new Date().toLocaleString('tr-TR')}`);
}

module.exports = {
	escapeHtml,
	parseApiDate,
	getTimeRemaining,
	getWarTimeStatus,
	isAdmin,
	logUnauthorizedAccess,
	logAdminAccess,
}; 