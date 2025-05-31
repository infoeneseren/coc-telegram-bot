const clashOfClansReplies = require('../replies/clash_of_clans');
const clan = require('./clan');
const { escapeHtml } = require('../utils/helpers');

// Savaş ligleri
const getWarLeagues = async (ctx, clashOfClansClient) => {
	let message = '';
	try {
		// Savaş ligleri listesi doğrudan mevcut değil, bunun yerine farklı bir yaklaşım kullanacağız
		message += '*****🏆 Lig Sistemi Hakkında*****\n\n';
		message += 'Clash of Clans\'ta şu ligler mevcut:\n\n';
		message += '🥉 Bronz Lig\n';
		message += '🥈 Gümüş Lig\n';
		message += '🥇 Altın Lig\n';
		message += '💎 Kristal Lig\n';
		message += '🏆 Usta Lig\n';
		message += '🌟 Şampiyon Lig\n';
		message += '⭐ Titan Lig\n';
		message += '🔥 Legend Ligi\n\n';
		message += 'Oyuncu sıralaması için /oyuncu_siralamasi komutunu kullanın.';
		
	} catch (e) {
		message = clashOfClansReplies.getErrorMessage(e);
	}
	ctx.replyWithHTML(message);
};

// Klan sıralaması (Türkiye)
const getClanRankings = async (ctx, clashOfClansClient) => {
	let message = '';
	try {
		// Türkiye lokasyon ID'si: 32000249
		const response = await clashOfClansClient.clansByLocation('32000249');
		
		if (response && response.items && response.items.length > 0) {
			const { items } = response;
			
			message += '*****🏆 Türkiye Klan Sıralaması (İlk 10)*****\n\n';
			
			for (let i = 0; i < Math.min(items.length, 10); i++) {
				const clan = items[i];
				const safeName = escapeHtml(clan.name);
				message += `${clan.rank}. ${safeName}\n`;
				message += `   🏆 ${clan.clanPoints} puan\n`;
				message += `   👥 ${clan.members}/50 üye\n`;
				if (clan.location && clan.location.name) {
					message += `   📍 ${clan.location.name}\n`;
				}
				message += '\n';
			}
		} else {
			message = '🔍 Klan sıralaması şu anda alınamıyor.';
		}
		
	} catch (e) {
		const clanName = await clan.getClanName(clashOfClansClient);
		message = '⚠️ Klan sıralaması servisi şu anda çalışmıyor.\n\n';
		message += 'Bunun yerine şu komutları kullanabilirsiniz:\n';
		message += `• /klan - ${clanName} klan bilgileri\n`;
		message += '• /uyeler - Klan üyeleri\n';
		message += '• /savas - Mevcut savaş durumu';
	}
	ctx.replyWithHTML(message);
};

// Oyuncu sıralaması (Türkiye)
const getPlayerRankings = async (ctx, clashOfClansClient) => {
	let message = '';
	try {
		// Türkiye lokasyon ID'si: 32000249
		const response = await clashOfClansClient.playersByLocation('32000249');
		
		if (response && response.items && response.items.length > 0) {
			const { items } = response;
			
			message += '*****🏆 Türkiye Oyuncu Sıralaması (İlk 10)*****\n\n';
			
			for (let i = 0; i < Math.min(items.length, 10); i++) {
				const player = items[i];
				const safeName = escapeHtml(player.name);
				message += `${player.rank}. ${safeName}\n`;
				message += `   🏆 ${player.trophies} kupa\n`;
				message += `   ⭐ Seviye ${player.expLevel}\n`;
				if (player.clan) {
					const safeClanName = escapeHtml(player.clan.name);
					message += `   🏛️ ${safeClanName}\n`;
				}
				message += '\n';
			}
		} else {
			message = '🔍 Oyuncu sıralaması şu anda alınamıyor.';
		}
		
	} catch (e) {
		message = '⚠️ Oyuncu sıralaması servisi şu anda çalışmıyor.\n\n';
		message += 'Bunun yerine şu komutları kullanabilirsiniz:\n';
		message += '• /oyuncu #tag - Oyuncu detayları\n';
		message += '• /uyeler - Klan üyeleri\n';
		message += '• /savas - Mevcut savaş durumu';
	}
	ctx.replyWithHTML(message);
};

module.exports = {
	getWarLeagues,
	getClanRankings,
	getPlayerRankings,
}; 