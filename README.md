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

### 📋 Yerel Kurulum

#### 1. Gereksinimler

```bash
Node.js 14.0+
npm
Telegram Bot Token
Clash of Clans API Token (ücretsiz)
```

#### 2. Bağımlılıkları Yükle

```bash
npm install
```

#### 3. Ortam Değişkenlerini Ayarla

`env_example.txt` dosyasını `.env` olarak kopyalayın ve düzenleyin:

```env
# Telegram Bot Token (@BotFather'dan alın)
BOT_TOKEN=your_telegram_bot_token_here

# Klan savaşı bildirimlerinin gönderileceği grup/kanal ID'si
# Bu ID'yi almak için: @userinfobot'u grubunuza ekleyin ve /start yazın
NOTIFICATION_CHAT_ID=your_group_or_channel_id_here

# Clash of Clans API Token (ücretsiz)
COC_API_TOKEN=your_clash_of_clans_api_token_here
```

#### 4. Botu Başlat

```bash
npm start
```

### 🌐 Replit Kurulumu (Önerilen)

Replit'te 24/7 çalışan bot kurmak için:

#### 1. Projeyi Replit'e Yükle

1. [Replit.com](https://replit.com)'e gidin ve giriş yapın
2. "Import from GitHub" seçeneğini kullanın
3. Proje URL'nizi girin veya dosyaları sürükle-bırak yapın

#### 2. Environment Variables (Secrets) Ayarla

Replit'te sol panelden **🔐 Secrets** bölümüne gidin ve şu değerleri ekleyin:

```env
BOT_TOKEN = your_telegram_bot_token_here
NOTIFICATION_CHAT_ID = your_group_or_channel_id_here  
ADMIN_USER_IDS = 123456789,987654321
COC_API_TOKEN = your_clash_of_clans_api_token_here
```

#### 3. Repl'i Çalıştır

- **Run** butonuna basın
- Bot otomatik olarak başlayacak ve keep-alive servisi devreye girecek
- Console'da "🤖 Bot başlatıldı!" mesajını görmelisiniz

#### 4. Always On (Hep Açık) Ayarla

1. Replit'te üst menüden **Always On** seçeneğini aktifleştirin
2. Bu sayede bot 24/7 çalışmaya devam edecek

#### ⚠️ Replit Notları:

- Bot hem Telegram webhook'ları hem de HTTP server olarak çalışır
- Port 3000 üzerinde keep-alive servisi açılır
- Graceful shutdown özelliği mevcuttur
- Environment variables `.env` yerine Secrets kullanır

## 🕐 24/7 Çalışma Rehberi

### 💳 **Yöntem 1: Ücretli (Önerilen)**

**En Kolay ve Güvenilir Yöntem:**

1. **Replit Hacker Plan** satın alın ($7/ay)
2. Projenizde **"Always On"** özelliğini aktifleştirin
3. Bot hiç durmadan çalışır ✅

#### Avantajları:

- %100 uptime garantisi
- Hiç kesinti yok
- Kurulum gerektirmez
- Resmi destek

---

### 🆓 **Yöntem 2: Ücretsiz (Teknik)**

**UptimeRobot ile Keep-Alive:**

#### Adım 1: UptimeRobot Hesabı

1. [UptimeRobot](https://uptimerobot.com) sitesine gidin
2. Ücretsiz hesap oluşturun
3. Email doğrulaması yapın

#### Adım 2: Monitor Ekleme

1. **"Add New Monitor"** butonuna basın
2. Şu ayarları yapın:
   ```
   Monitor Type: HTTP(s)
   Friendly Name: CoC Telegram Bot
   URL: https://your-repl-name.your-username.repl.co
   Monitoring Interval: 5 minutes
   Monitor Timeout: 30 seconds
   ```
3. **"Create Monitor"** butonuna basın

#### Adım 3: Repl URL'nizi Bulma

1. Replit'te botunuz çalışırken
2. Sağ üstte **"Open in new tab"** butonuna basın
3. Açılan sekmedeki URL'yi kopyalayın
4. Bu URL'yi UptimeRobot'a ekleyin

#### Nasıl Çalışır:

- UptimeRobot her 5 dakikada URL'nizi kontrol eder
- Eğer bot uyuyorsa, otomatik uyandırır
- %90-95 uptime sağlar (saatte bir kısa restart olur)

#### Avantajları:

- Tamamen ücretsiz
- Kolay kurulum
- İyi uptime oranı

#### Dezavantajları:

- Saatte bir kısa kesinti (30-60 saniye)
- %100 garanti değil
- Teknik bilgi gerektirir

---

### 🔧 **Keep-Alive Sistem Kontrolü**

Botunuzda zaten keep-alive sistemi var! Şu kodu görmelisiniz:

```javascript
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
```

#### Test Etmek İçin:

1. Botunuz çalışırken
2. Tarayıcıda: `https://your-repl-name.your-username.repl.co`
3. "Telegram Bot is running! 🤖" yazısını görmelisiniz

---

### 📊 **Yöntem Karşılaştırması**

| Özellik                | Ücretli ($7/ay) | Ücretsiz   |
| ----------------------- | ---------------- | ----------- |
| **Uptime**        | %100             | %90-95      |
| **Kesinti**       | Hiç             | Saatte 1 dk |
| **Kurulum**       | 1 tık           | 15 dakika   |
| **Güvenilirlik** | Mükemmel        | İyi        |
| **Destek**        | Resmi            | Topluluk    |

### 🎯 **Öneri**

**Ciddi kullanım için:** Ücretli plan ($7/ay)
**Test/hobi için:** Ücretsiz UptimeRobot yöntemi

Botunuz şu anda mükemmel çalışıyor! Sadece 24/7 uptime için yukarıdaki yöntemlerden birini seçin.

## 🔑 Token ve ID Alma Rehberi

### 🤖 Telegram Bot Token

1. Telegram'da [@BotFather](https://t.me/BotFather)'a mesaj gönderin
2. `/newbot` komutunu kullanın
3. Bot için bir isim belirleyin (örn: "dostluk CoC Bot")
4. Bot için bir kullanıcı adı belirleyin (örn: "dostluk_coc_bot")
5. Verilen token'ı kopyalayın ve environment variables'a ekleyin

### 💬 Bildirim Chat ID Alma

1. [@userinfobot](https://t.me/userinfobot)'u grubunuza/kanalınıza ekleyin
2. Grupta `/start` yazın
3. Bot size grup ID'sini verecek (örn: `-1001234567890`)
4. Bu ID'yi NOTIFICATION_CHAT_ID olarak ekleyin
5. Bot'u gruptan çıkarabilirsiniz

### 👥 Admin User ID Alma

1. [@userinfobot](https://t.me/userinfobot)'a özel mesaj gönderin
2. `/start` yazın
3. Bot size kullanıcı ID'nizi verecek (örn: `123456789`)
4. Birden fazla admin için virgülle ayırın: `123456789,987654321`

### ⚠️ Güvenlik Uyarıları:

- Token'larınızı asla paylaşmayın
- GitHub'a push yaparken `.env` dosyasını dahil etmeyin
- Replit'te Secrets kullanın, environment variables'ı public yapmayın

### ⚔️ Clash of Clans API Token

1. [Clash of Clans Developer Portal](https://developer.clashofclans.com)'a gidin
2. Supercell ID ile giriş yapın
3. "Create New Key" butonuna basın
4. Bilgileri doldurun:
   - **Name:** Replit Bot
   - **Description:** Telegram bot for Replit
   - **IP Addresses:** `0.0.0.0/0` (tüm IP'lere izin verir)
5. Oluşturulan token'ı kopyalayın ve COC_API_TOKEN olarak ekleyin

⚠️ **IP Kısıtlaması:** `0.0.0.0/0` yazmak güvenlik açısından ideal değil ama Replit'in dinamik IP'si nedeniyle gerekli

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

### 🌐 Replit Spesifik Sorunlar:

#### "Hatalı İstek" Hatası:

1. **Secrets Kontrol**: 🔐 Secrets bölümünde tüm değerlerin doğru girildiğinden emin olun
2. **Bot Token**: BOT_TOKEN'ın doğru ve geçerli olduğunu kontrol edin
3. **Chat ID**: NOTIFICATION_CHAT_ID'nin doğru format'ta olduğunu kontrol edin (negatif sayı olmalı)

#### Bot Çalışıyor Ama Yanıt Vermiyor:

1. **Console Kontrol**: Replit Console'da hata mesajlarını kontrol edin
2. **Keep-Alive Check**: `http://your-repl-url.replit.dev` adresine tarayıcıdan gidin
3. **Webhook Problemi**: Bot'u yeniden başlatmayı deneyin

#### Always On Çalışmıyor:

1. **Upgrade**: Replit hesabınızın Always On özelliğini desteklediğinden emin olun
2. **Resource**: Repl'in çok fazla kaynak kullanmadığından emin olun
3. **Error Loop**: Bot sürekli crash oluyor olabilir, logları kontrol edin

#### Environment Variables Tanınmıyor:

```javascript
// Replit'te .env yerine process.env kullanılmalı
console.log(process.env.BOT_TOKEN); // undefined ise Secrets'e ekleyin
```

### Log Kontrol:

```bash
# Bot başlatırken logları takip edin
npm start

# Console çıktılarında şunları arayın:
# ✅ Savaş bildirim sistemi aktif!
# 🔔 Savaş bildirimi gönderildi
```

### 🔧 Replit Debug Komutları:

```javascript
// Console'da test edin:
console.log('BOT_TOKEN:', process.env.BOT_TOKEN ? 'SET' : 'NOT SET');
console.log('NOTIFICATION_CHAT_ID:', process.env.NOTIFICATION_CHAT_ID);
console.log('ADMIN_USER_IDS:', process.env.ADMIN_USER_IDS);
```

## 📞 Destek

Bu bot **dostluk** klanı için özel geliştirilmiştir. Sorunlar için klan liderlerine ulaşın.

## 📄 Lisans

ISC License - Kişisel ve klan kullanımı için ücretsiz.

---

**dostluk Klanı** - Clash of Clans 🏆
