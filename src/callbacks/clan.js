const clashOfClansReplies = require('../replies/clash_of_clans');
const { escapeHtml } = require('../utils/helpers');

// Klan ismini getiren yardımcı fonksiyon
const getClanName = async (clashOfClansClient) => {
	try {
		const response = await clashOfClansClient.clanByTag('#9CPU2CQR');
		return response.name;
	} catch (e) {
		return 'Klan'; // Fallback
	}
};

const getClanMembers = async (ctx, clashOfClansClient) => {
	let message = '';
	try {
		const response = await clashOfClansClient.clanMembersByTag('#9CPU2CQR');
		const { items } = response;
		message += '*****⚔Üyeler⚔*****\n\n';
		for (let i = 0; i < items.length; i++) {
			const member = items[i];
			const safeName = escapeHtml(member.name);
			message += `${i+1}. ${safeName} - <code>${member.tag}</code>\n\n`;
		}
		message += clashOfClansReplies.getTagHelpMessage();
	} catch (e) {
		message = clashOfClansReplies.getErrorMessage(e);
	}
	ctx.replyWithHTML(message);
};

const getClan = async (ctx, clashOfClansClient) => {
	let message = '';
	try {
	 	const response = await clashOfClansClient.clanByTag('#9CPU2CQR');
		const safeName = escapeHtml(response.name);
		const safeDescription = escapeHtml(response.description);
	 	message += `***** 🏛 ${safeName} - <code>${response.tag}</code> *****\n\n`;
	 	message += `📝 Açıklama: \n"${safeDescription}"\n`;
	 	message += `\n ⭐️ Klan seviyesi: ${response.clanLevel}\n`;
	 	message += `\n 👥 Toplam üye sayısı: ${response.members}\n`;
	 	message += `\n🎨 Resmi logo:`;
	 	message += `\n${response.badgeUrls.medium}\n`;
	} catch (e) {
		message = clashOfClansReplies.getErrorMessage(e);
	}
	ctx.replyWithHTML(message);
};

module.exports = {
	getClanMembers,
	getClan,
	getClanName,
};
