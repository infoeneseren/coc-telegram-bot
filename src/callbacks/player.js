const clashOfClansReplies = require('../replies/clash_of_clans');
const { escapeHtml } = require('../utils/helpers');

const getPlayer = async (ctx, clashOfClansClient) => {
	let tag;
	const messageBySpace = ctx.message.text.split(" ");
	for (let i = 0; i < messageBySpace.length; i++) {
		const message = messageBySpace[i];
		if (message && message.charAt(0) == '#') {
			tag = message;
			break;
		}
	}
	if(tag) {
		ctx.reply(await playerMessage(tag, clashOfClansClient));
	} else {
		ctx.replyWithHTML('Bana oyuncunun etiketini gönder. Şu şekilde: <code>#123ABC</code>');
	}
};

async function playerMessage(tag, clashOfClansClient) {
	let message = '';
	try {
		const response = await clashOfClansClient.playerByTag(tag);
		
		// Ana başlık
		const safeName = escapeHtml(response.name);
		message += `*****👤 ${safeName} *****\n\n`;
		
		// Temel bilgiler
		message += `🏠 Belediye Binası: ${response.townHallLevel}\n`;
		message += `⭐ Seviye: ${response.expLevel}\n`;
		message += `🏆 Kupa: ${response.trophies}\n`;
		message += `🏆 En Yüksek Kupa: ${response.bestTrophies}\n`;
		
		// Builder Base bilgileri
		if (response.builderHallLevel) {
			message += `💎 Builder Base: Seviye ${response.builderHallLevel}\n`;
		}
		if (response.versusTrophies) {
			message += `💎 Versus Kupa: ${response.versusTrophies}\n`;
		}
		
		// Savaş bilgileri
		message += `⚔️ Savaş Yıldızı: ${response.warStars}\n`;
		
		// Klan bilgileri
		if (response.clan) {
			const safeClanName = escapeHtml(response.clan.name);
			message += `\n🏛️ Klan: ${safeClanName}\n`;
			message += `🎩 Rütbe: ${getRoleName(response.role)}\n`;
		}
		
		// Bağış bilgileri
		message += `\n❤️ Bağışlar: ${response.donations}\n`;
		message += `😻 Alınan Bağışlar: ${response.donationsReceived}\n`;
		
		// Lig bilgileri
		if (response.league) {
			const safeLeagueName = escapeHtml(response.league.name);
			message += `\n🏋️ Lig: ${safeLeagueName}\n`;
		}
		
		// Kahramanlar
		if (response.heroes && response.heroes.length > 0) {
			message += `\n👑 **Kahramanlar:**\n`;
			response.heroes.forEach(hero => {
				const safeHeroName = escapeHtml(hero.name);
				message += `${safeHeroName}: Seviye ${hero.level}/${hero.maxLevel}\n`;
			});
		}
		
		// En yüksek seviyeli askerler (ilk 5)
		if (response.troops && response.troops.length > 0) {
			message += `\n⚔️ **En Güçlü Askerler:**\n`;
			const topTroops = response.troops
				.sort((a, b) => b.level - a.level)
				.slice(0, 5);
			topTroops.forEach(troop => {
				const safeTroopName = escapeHtml(troop.name);
				message += `${safeTroopName}: Seviye ${troop.level}/${troop.maxLevel}\n`;
			});
		}
		
		// En yüksek seviyeli büyüler (ilk 3)
		if (response.spells && response.spells.length > 0) {
			message += `\n🪄 **En Güçlü Büyüler:**\n`;
			const topSpells = response.spells
				.sort((a, b) => b.level - a.level)
				.slice(0, 3);
			topSpells.forEach(spell => {
				const safeSpellName = escapeHtml(spell.name);
				message += `${safeSpellName}: Seviye ${spell.level}/${spell.maxLevel}\n`;
			});
		}
		
		// Başarım özeti
		if (response.achievements && response.achievements.length > 0) {
			const completed = response.achievements.filter(a => a.stars >= a.target);
			const inProgress = response.achievements.filter(a => a.stars < a.target);
			
			message += `\n🏅 **Başarımlar:**\n`;
			message += `✅ Tamamlanan: ${completed.length}\n`;
			message += `⏳ Devam Eden: ${inProgress.length}\n`;
			
			// En yakın başarım
			if (inProgress.length > 0) {
				const nearest = inProgress.reduce((prev, curr) => {
					const prevProgress = prev.value / prev.target;
					const currProgress = curr.value / curr.target;
					return currProgress > prevProgress ? curr : prev;
				});
				const progress = Math.round((nearest.value / nearest.target) * 100);
				const safeAchievementName = escapeHtml(nearest.name);
				message += `🎯 En Yakın: ${safeAchievementName} (%${progress})\n`;
			}
		}
		
		// Etiket bilgisi
		message += `\n🏷️ Etiket: <code>${tag}</code>`;
		
	} catch (e) {
		message = clashOfClansReplies.getErrorMessage(e);
	}
	return message;
}

// Yardımcı fonksiyon
function getRoleName(role) {
	switch (role) {
		case 'leader': return 'Lider';
		case 'coLeader': return 'Yardımcı Lider';
		case 'admin': return 'Veteran';
		case 'member': return 'Üye';
		default: return role;
	}
}

module.exports = {
	getPlayer,
	playerMessage,
};
