const clan = require('../callbacks/clan');

const getStarted = async (clashOfClansClient) => {
	const clashApi = require('clash-of-clans-api');
	const client = clashOfClansClient || clashApi();
	const clanName = await clan.getClanName(client);
	
	return `
🎮 **${clanName} Clash of Clans Bot**

Merhaba! ${clanName} klanının resmi botuna hoş geldin!
Klan bilgilerinizi kolayca öğrenmek için aşağıdaki komutları kullanabilirsin:

<b>🏛️ Klan Komutları</b>
/klan - Klanın genel bilgileri ve istatistikleri
/uyeler - Tüm klan üyelerinin detaylı listesi

<b>👤 Oyuncu Komutları</b>
/oyuncu #tag - Herhangi bir oyuncunun detaylı bilgileri

<b>⚔️ Savaş Komutları</b>
/savas - Mevcut savaş durumu ve skorları
/savas_analiz - Detaylı savaş performans analizi
/savas_saldirmayanlar - Saldırı yapmayan üyeler
/savas_gecmis - Son savaşların geçmişi
/savas_lig - Klan Savaş Ligi durumu

<b>🏆 Lig ve Sıralama</b>
/ligler - Lig sistemleri hakkında bilgi
/klan_siralamasi - Türkiye'deki klan sıralarımız
/oyuncu_siralamasi - Türkiye'deki bireysel sıralar

<b>❓ Yardım</b>
/yardim - Bu menüyü tekrar göster
/yardim_klan - Klan komutları detayları
/yardim_oyuncu - Oyuncu komutları detayları
/yardim_savas - Savaş komutları detayları
/yardim_lig - Lig komutları detayları

<b>💡 Hızlı Kullanım:</b>
• Direkt #ABC123 yazarak hızlı oyuncu sorgulama
• Tüm komutlar ${clanName} klanı verilerine göre çalışır

İyi oyunlar! 🔥
`;
};

module.exports = {
	getStarted,
};
