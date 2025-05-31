// Yardım mesajları

const clan = require('./clan');

const getHelpClan = async (clashOfClansClient) => {
	const clanName = await clan.getClanName(clashOfClansClient);
	return `
**🏛️ Klan Komutları Yardımı**

/klan - ${clanName} klanının genel bilgilerini gösterir
/uyeler - Klan üyelerinin listesini gösterir

**Kullanım:**
Sadece komutu yazmanız yeterli. Klan bilgileri otomatik olarak getirilir.

**Örnek:**
\`/klan\` - Klan bilgilerini gösterir
\`/uyeler\` - Tüm üyeleri listeler
	`;
};

const getHelpPlayer = () => {
	return `
**👤 Oyuncu Komutları Yardımı**

/oyuncu #tag - Oyuncunun tüm bilgilerini gösterir:
• Temel bilgiler (seviye, kupa, belediye binası)
• Klan bilgileri ve rütbe
• Bağış istatistikleri
• Kahramanlar ve seviyeleri
• En güçlü askerler (ilk 5)
• En güçlü büyüler (ilk 3)
• Başarım özeti

**Tag Formatı:**
Tag #ABC123 şeklinde olmalıdır. # karakteri ile başlamalı.

**Örnek:**
\`/oyuncu #ABC123\` - Oyuncunun tüm detaylı bilgileri

**Hızlı Kullanım:**
Tag'ı mesajda da gönderebilirsiniz:
\`#ABC123\` yazmak otomatik olarak oyuncu bilgilerini getirir.

**Not:** Komut tek seferde tüm oyuncu bilgilerini kapsamlı şekilde gösterir.
	`;
};

const getHelpWar = async (clashOfClansClient) => {
	const clanName = await clan.getClanName(clashOfClansClient);
	return `
**⚔️ Savaş Komutları Yardımı**

/savas - Mevcut savaş durumunu detaylı gösterir:
• Savaş durumu ve takım boyutu
• Yıldız ve hasar karşılaştırması 
• En iyi performans gösteren saldırılar
• Kalan saldırı sayısı
• Eksik saldırı yapan üyeler (saldırı haklarıyla)

/savas_analiz - Kapsamlı savaş analizi:
• Townhall dağılımı karşılaştırması
• Saldırı verimliliği (yıldız bazında)
• Ortalama hasar değerleri
• Taktiksel analiz

/savas_saldirmayanlar - Eksik saldırı detayları:
• Hiç saldırmayan üyeler listesi (0/2)
• Eksik saldırı yapan üyeler (1/2)
• Tam saldırı yapan üyeler (2/2)
• TH seviyesine göre sıralama
• Detaylı istatistikler ve oranlar

/savas_gecmis - Son savaşların geçmişini gösterir:
• Son 5 savaş sonucu
• Takım boyutları ve tarihler
• Genel istatistikler (galibiyet oranı)

/savas_lig - Klan Savaş Ligi bilgilerini gösterir:
• CWL durumu ve sezon bilgisi
• Katılan klanlar listesi

**Kullanım:**
Komutlar ${clanName} klanının savaş bilgilerini otomatik getirir.

**Örnek:**
\`/savas\` - Anlık savaş durumu ve performans
\`/savas_analiz\` - Detaylı TH ve verimlilik analizi
\`/savas_saldirmayanlar\` - Kimler saldırmadı, kimler eksik?

**Durum Açıklamaları:**
🕊️ Savaşta değil
🛠️ Hazırlık aşaması
⚔️ Savaş devam ediyor
🏁 Savaş bitti

**Saldırı Durumları:**
❌ Hiç saldırmamış (0/2)
⚠️ Eksik saldırı (1/2)
✅ Tam saldırı (2/2)

**Analiz Özellikleri:**
📊 TH seviyesi karşılaştırması
🌟 Yıldız verimliliği
💥 Hasar ortalamaları
⚠️ Eksik saldırı uyarıları
📈 Detaylı istatistikler
	`;
};

const getHelpLeague = () => {
	return `
**🏆 Sıralama Komutları Yardımı**

/ligler - Lig sistemi hakkında bilgi
/klan_siralamasi - Türkiye klan sıralaması (İlk 10)
/oyuncu_siralamasi - Türkiye oyuncu sıralaması (İlk 10)

**Kullanım:**
\`/ligler\` - CoC lig sistemi bilgileri
\`/klan_siralamasi\` - En iyi 10 Türk klanı
\`/oyuncu_siralamasi\` - En iyi 10 Türk oyuncusu

**Not:**
Sıralamalar Türkiye lokasyonu için gösterilir.
Clash of Clans resmi API verilerini kullanır.
	`;
};

const getHelpGeneral = async (clashOfClansClient) => {
	const clanName = await clan.getClanName(clashOfClansClient);
	return `
**📚 Genel Yardım**

**Ana Kategoriler:**
• /yardim_klan - Klan komutları yardımı
• /yardim_oyuncu - Oyuncu komutları yardımı  
• /yardim_savas - Savaş komutları yardımı
• /yardim_lig - Sıralama komutları yardımı

**Hızlı İpuçları:**
✅ Tag'lar # ile başlamalı
✅ Komutlarda büyük/küçük harf fark etmez
✅ \`#ABC123\` yazmak otomatik oyuncu bilgisi getirir
✅ Hata alırsanız tag'ı kontrol edin

**API Sınırlamaları:**
⚠️ Capital Raid bilgileri mevcut değil
⚠️ Bazı özellikler API kısıtlamaları nedeniyle çalışmayabilir

**Destek:**
Bu bot ${clanName} klanı için geliştirilmiştir.
Sorun yaşarsanız klan liderlerine ulaşın.
	`;
};

module.exports = {
	getHelpClan,
	getHelpPlayer,
	getHelpWar,
	getHelpLeague,
	getHelpGeneral,
};
