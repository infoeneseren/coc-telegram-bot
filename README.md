<p align="center">
	<img src="https://api-assets.clashofclans.com/badges/200/BbOiJGTyOXe7oxCFiCYfg-oRyzXm8ZeN_rFjnjNn9HA.png" height="200" alt="dostluk klan rozeti" />
</p>

# 🤖 dostluk Clash of Clans Telegram Bot

dostluk klanı için geliştirilmiş kapsamlı Clash of Clans Telegram botu. Klan bilgileri, oyuncu istatistikleri, savaş analizleri ve **otomatik savaş bildirimlerini** içerir.

## ✨ Özellikler

### 🏛️ Klan Yönetimi
- Klan bilgileri ve istatistikleri
- Üye listeleri ve detayları
- Dinamik klan ismi sistemi

### 👤 Oyuncu Analizi
- Kapsamlı oyuncu profilleri
- Asker, büyü ve kahraman seviyeleri
- Başarım takibi ve ilerleme
- Hızlı etiket tanıma (#ABC123)

### ⚔️ Gelişmiş Savaş Sistemi
- Mevcut savaş durumu ve analiz
- Townhall dağılımı karşılaştırması
- Saldırı verimliliği ve istatistikleri
- Eksik saldırı yapan üye takibi
- Savaş geçmişi ve başarı oranları
- Klan Savaş Ligi bilgileri

### 🔔 **YENİ: Otomatik Savaş Bildirimleri**
- 🔥 Savaş bulunduğunda anında bildirim
- ⏰ Savaş başlamadan 1 saat, 30 dakika, 5 dakika önce uyarılar
- 🚨 Savaş başladığında bildirim
- 🏆 Savaş bittiğinde sonuç bildirimi
- 📊 Kapsamlı bildirim yönetimi

### 🏆 Sıralama Sistemleri
- Türkiye klan sıralaması
- Türkiye oyuncu sıralaması
- Lig sistemi bilgileri

## 🚀 Kurulum

### 1. Gereksinimler
```bash
Node.js 14.0+
npm
Telegram Bot Token
Clash of Clans API Token (ücretsiz)
```

### 2. Bağımlılıkları Yükle
```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarla
`env_example.txt` dosyasını `.env` olarak kopyalayın ve düzenleyin:

```env
# Telegram Bot Token (@BotFather'dan alın)
BOT_TOKEN=your_telegram_bot_token_here

# Klan savaşı bildirimlerinin gönderileceği grup/kanal ID'si
# Bu ID'yi almak için: @userinfobot'u grubunuza ekleyin ve /start yazın
NOTIFICATION_CHAT_ID=your_group_or_channel_id_here
```

### 4. Bot Tokenları

#### Telegram Bot Token:
1. Telegram'da @BotFather'a mesaj gönderin
2. `/newbot` komutunu kullanın
3. Bot adı ve kullanıcı adı belirleyin
4. Verilen token'ı `.env` dosyasına ekleyin

#### Bildirim Chat ID:
1. @userinfobot'u grubunuza ekleyin
2. `/start` yazın
3. Grup ID'sini `.env` dosyasına ekleyin

#### Admin User ID'leri:
1. @userinfobot'a özel mesaj gönderin
2. `/start` yazın
3. Kullanıcı ID'nizi alın
4. Birden fazla admin için virgülle ayırın: `123456789,987654321`

### 5. Botu Başlat
```bash
npm start
```

## 📱 Komutlar

### 🏛️ Klan Komutları
- `/klan` - Klan bilgileri
- `/uyeler` - Üye listesi

### 👤 Oyuncu Komutları
- `/oyuncu #tag` - Oyuncu detayları
- `#ABC123` - Hızlı oyuncu sorgusu

### ⚔️ Savaş Komutları
- `/savas` - Mevcut savaş durumu
- `/savas_analiz` - Detaylı savaş analizi
- `/savas_saldirmayanlar` - Eksik saldırı listesi
- `/savas_gecmis` - Savaş geçmişi
- `/savas_lig` - Klan Savaş Ligi

### 🏆 Sıralama Komutları
- `/klan_siralamasi` - Türkiye klan sıralaması
- `/oyuncu_siralamasi` - Türkiye oyuncu sıralaması
- `/ligler` - Lig sistemi bilgileri

### 🔧 Admin Komutları
- `/admin` - Admin paneli (sadece adminler)

### 📚 Yardım Komutları
- `/yardim` - Ana yardım menüsü
- `/yardim_klan` - Klan komutları yardımı
- `/yardim_oyuncu` - Oyuncu komutları yardımı
- `/yardim_savas` - Savaş komutları yardımı
- `/yardim_lig` - Lig komutları yardımı

## 🔔 Otomatik Bildirim Sistemi

### Nasıl Çalışır?
- Bot her 5 dakikada bir klan savaşını kontrol eder
- Belirlenen zamanlarda otomatik bildirimler gönderir
- Aynı bildirimi birden fazla göndermez
- **Sadece adminler tarafından yönetilir**

### Admin Sistemi:
Bu sistem sadece yetkili adminler tarafından kontrol edilir:

1. **Admin Paneli:** `/admin` komutu ile erişim
2. **Admin Kontrolü:** Çevre değişkeninde tanımlı admin ID'leri
3. **Güvenlik:** Normal kullanıcılar admin komutlarını göremez

### Admin Komutları:
- `/admin` - Ana admin paneli
- `/bildirim_durum` - Sistem durumunu görüntüle
- `/bildirim_baslat` - Bildirim sistemini başlat
- `/bildirim_durdur` - Bildirim sistemini durdur
- `/bildirim_test` - Test bildirimi gönder

### Bildirim Türleri:
1. **Savaş Bulundu** - Yeni savaş eşleşmesi
2. **1 Saat Kaldı (Başlangıç)** - Savaş başlamadan 1 saat önce
3. **30 Dakika Kaldı (Başlangıç)** - Savaş başlamadan 30 dakika önce
4. **5 Dakika Kaldı (Başlangıç)** - Savaş başlamadan 5 dakika önce
5. **Savaş Başladı** - Savaş başladığında
6. **1 Saat Kaldı (Bitiş)** - Savaş bitmeden 1 saat önce
7. **30 Dakika Kaldı (Bitiş)** - Savaş bitmeden 30 dakika önce
8. **5 Dakika Kaldı (Bitiş)** - Savaş bitmeden 5 dakika önce
9. **Savaş Bitti** - Savaş sonucu ile birlikte

### Yönetim:
- Sadece adminler `/admin` komutunu kullanabilir
- Bildirim komutları ana menüde görünmez
- Test bildirimleri admin bilgilerini içerir

## 🛠️ Teknik Detaylar

### Teknoloji Stack:
- **Node.js** - Runtime environment
- **Telegraf** - Telegram bot framework
- **node-cron** - Zamanlama sistemi
- **clash-of-clans-api** - CoC API client
- **dotenv** - Environment management

### Proje Yapısı:
```
├── src/
│   ├── callbacks/          # Bot komut işleyicileri
│   ├── replies/            # Mesaj şablonları
│   ├── services/           # Otomatik servisler
│   └── utils/              # Yardımcı fonksiyonlar
├── index.js                # Ana bot dosyası
├── package.json            # Bağımlılıklar
└── README.md              # Dokümantasyon
```

### Güvenlik:
- Environment variables ile token güvenliği
- HTML escape ile XSS koruması
- Error handling ve logging
- Rate limiting aware

## 🔧 Yapılandırma

### Klan Değiştirme:
Farklı bir klan için kullanmak istiyorsanız:
1. `src/callbacks/clan.js` dosyasında klan tag'ını değiştirin
2. `src/callbacks/war.js` dosyasında klan tag'ını değiştirin
3. `src/services/warNotifications.js` dosyasında klan tag'ını değiştirin

### Bildirim Sıklığı:
`src/services/warNotifications.js` dosyasında cron schedule'ı değiştirebilirsiniz:
```javascript
// Her 5 dakika: '*/5 * * * *'
// Her dakika: '* * * * *'
// Her 10 dakika: '*/10 * * * *'
```

## 🐛 Sorun Giderme

### Yaygın Sorunlar:
1. **Bot yanıt vermiyor**: Bot token'ını kontrol edin
2. **Bildirimler gelmiyor**: NOTIFICATION_CHAT_ID'yi kontrol edin
3. **API hataları**: İnternet bağlantısını kontrol edin

### Log Kontrol:
```bash
# Bot başlatırken logları takip edin
npm start

# Console çıktılarında şunları arayın:
# ✅ Savaş bildirim sistemi aktif!
# 🔔 Savaş bildirimi gönderildi
```

## 📞 Destek

Bu bot **dostluk** klanı için özel geliştirilmiştir. Sorunlar için klan liderlerine ulaşın.

## 📄 Lisans

ISC License - Kişisel ve klan kullanımı için ücretsiz.

---

**dostluk Klanı** - Clash of Clans 🏆
