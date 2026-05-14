# 🔥 Firebase Kurulum Rehberi (Vercel için)

Bu rehberle siten profesyonel bir backend kazanacak: **güvenli admin paneli + veritabanı + kimlik doğrulama**. Toplam süre: 15 dakika. Tamamen ücretsiz.

> ⚠️ **Bu rehberi sırayla takip et, hiçbir adımı atlama.** Her adımda ne yapacağını açıklayacağım.

---

## 🎯 Genel Bakış — Ne Yapacağız?

1. Firebase'de proje oluşturup ayarlarını alacağız
2. `index.html` ve `admin.html` dosyalarına bu ayarları yapıştıracağız
3. Kimlik doğrulama (Authentication) açacağız — admin için
4. Firestore Database açacağız — fikirleri saklamak için
5. Güvenlik kuralları yazacağız — sadece sen erişebilesin diye
6. Vercel'deki domain'leri Firebase'e tanıtacağız
7. Push'layıp test edeceğiz

---

## ADIM 1 — Firebase Projesi Oluştur

1. <https://console.firebase.google.com> adresine git
2. Google hesabınla giriş yap (`ahmetyaman.se@gmail.com`)
3. **"Add project"** veya **"Create a project"** butonuna bas
4. Proje adı: `ahmetyaman-portfolio` yaz → **Continue**
5. Google Analytics ekranı çıkar → **"Disable Google Analytics"** toggle'ını **kapat** → **Create project**
6. Birkaç saniye bekle, "Your new project is ready" görünce **Continue**

---

## ADIM 2 — Web Uygulaması Ekle (En Kritik Adım)

1. Proje ana sayfasında ortada şu ikonları göreceksin: `</>` (web), Android, iOS
2. **`</>`** (web) ikonuna tıkla
3. App nickname: `portfolio-web` yaz
4. **"Also set up Firebase Hosting"** kutusunu İŞARETLEME
5. **"Register app"** butonuna bas
6. Karşına bu kod çıkacak — **TAMAMINI KOPYALA**:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "ahmetyaman-portfolio.firebaseapp.com",
  projectId: "ahmetyaman-portfolio",
  storageBucket: "ahmetyaman-portfolio.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

7. **Bu kodu güvenli bir yere kaydet** (Notepad'e yapıştır)
8. **"Continue to console"** butonuna bas

### Kodu Dosyalara Yapıştır

**İki dosyaya yapıştırman gerekiyor: `index.html` ve `admin.html`**

#### `index.html` için:
1. Dosyayı bir text editörü ile aç (Notepad, VS Code, Sublime fark etmez)
2. **Ctrl+F** ile şunu ara: `BURAYA_API_KEY`
3. Aşağıdaki bloğu bul:

```javascript
const firebaseConfig = {
  apiKey: "BURAYA_API_KEY",
  authDomain: "BURAYA_AUTH_DOMAIN",
  projectId: "BURAYA_PROJECT_ID",
  storageBucket: "BURAYA_STORAGE_BUCKET",
  messagingSenderId: "BURAYA_MESSAGING_SENDER_ID",
  appId: "BURAYA_APP_ID"
};
```

4. Bu bloğu komple sil, yerine Firebase'den aldığın **gerçek değerleri** yapıştır

#### `admin.html` için:
**Aynı işlemi `admin.html` dosyasında da yap.** İki dosyada da aynı değerler olmalı.

---

## ADIM 3 — Authentication (Kimlik Doğrulama) Aç

Bu admin paneline güvenli giriş için:

1. Sol menüde **"Build"** → **"Authentication"**
2. **"Get started"** butonuna bas
3. Açılan sayfada **"Email/Password"** kartına tıkla
4. İlk toggle'ı (Email/Password) **AÇIK** konuma getir → **Save**
5. Üst kısımda **"Users"** sekmesine geç
6. **"Add user"** butonuna bas
7. **E-posta:** `ahmetyaman.se@gmail.com`
8. **Parola:** **GÜÇLÜ BİR PAROLA** belirle (en az 12 karakter, harf+rakam+sembol)
   - ⚠️ Bu parolanı **unutma!** Admin paneline giriş yapmak için lazım olacak
9. **Add user**

> 💡 Parolanı bir yere not et (şifre yöneticisi varsa orada saklayabilirsin).

---

## ADIM 4 — Firestore Database Oluştur

Bu fikirlerin saklanacağı veritabanı:

1. Sol menüde **"Build"** → **"Firestore Database"**
2. **"Create database"** butonuna bas
3. **Konum:** `eur3 (europe-west)` seç (Türkiye'ye en yakın) → **Next**
4. **"Start in production mode"** seç → **Create**
5. Birkaç saniye bekle, veritabanı oluşacak

---

## ADIM 5 — Güvenlik Kuralları (ÇOK ÖNEMLİ!)

Bu adım olmazsa **ya kimse fikir gönderemez** ya da **herkes verilerini okur**. Doğru kuralları yazmalıyız.

1. Firestore Database sayfasında üstte **"Rules"** sekmesine tıkla
2. Karşına bir kod editörü çıkacak — **içindeki TÜM METNİ SİL**
3. Şu kodu yapıştır:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /ideas/{ideaId} {

      // Herkes fikir gönderebilir (CREATE), ama doğrulamalarla
      allow create: if
        request.resource.data.keys().hasAll(['name','email','title','category','message','createdAt','read'])
        && request.resource.data.name is string
        && request.resource.data.email is string
        && request.resource.data.title is string
        && request.resource.data.category is string
        && request.resource.data.message is string
        && request.resource.data.name.size() >= 2
        && request.resource.data.name.size() <= 100
        && request.resource.data.title.size() >= 3
        && request.resource.data.title.size() <= 200
        && request.resource.data.message.size() >= 10
        && request.resource.data.message.size() <= 5000
        && request.resource.data.email.matches('.*@.*[.].*')
        && request.resource.data.read == false;

      // Sadece giriş yapmış kullanıcı (sen) okuyabilir, düzenleyebilir, silebilir
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

4. **"Publish"** butonuna bas
5. ✅ Güvenlik kuralları aktif

### Bu Kurallar Ne Yapar?
- ✅ Sitenden form gönderen herkes fikir yazabilir
- ✅ Ama 5000 karakterden uzun mesaj atamaz (spam koruması)
- ✅ E-posta formatı zorunlu (`@.com` falan)
- ✅ Sadece **giriş yapmış kullanıcı** (yani sen) verileri görebilir
- ❌ Kötü niyetli birisi tarayıcı konsolundan veri çekmeye çalışsa **GÖREMEZ**

---

## ADIM 6 — Vercel Domain'lerini Firebase'e Tanıt

Bu Firebase'in sadece güvendiği yerlerden istek kabul etmesi için:

1. Firebase Console → **Authentication** → **Settings** sekmesi
2. Aşağı kaydır → **"Authorized domains"** bölümü
3. **"Add domain"** butonuna bas, **şu domain'leri tek tek ekle**:

```
ahmetyamann.com
```

```
www.ahmetyamann.com
```

Eğer Vercel sana otomatik bir alt domain (`*.vercel.app`) verdiyse onu da ekle:
```
ahmetyaman-portfolio.vercel.app
```

> Vercel'deki **gerçek domain'lerini görmek için**: Vercel dashboard → projen → Settings → Domains. Hepsini Firebase'e ekle.

---

## ADIM 7 — Git Push ve Test

Şimdi değişiklikleri Vercel'e push'layalım:

```bash
git add .
```

```bash
git commit -m "firebase entegrasyonu eklendi"
```

```bash
git push
```

Vercel **30-60 saniye içinde** otomatik deploy edecek.

---

## ADIM 8 — Test! 🧪

### Test 1: Fikir gönder
1. <https://ahmetyamann.com> aç
2. Fikir Havuzu bölümüne git
3. Bir test fikri doldur ve gönder
4. ✅ "Fikrin için teşekkürler!" mesajı görmen lazım

### Test 2: Admin paneline gir
1. <https://ahmetyamann.com/admin.html> aç (veya footer'daki ⚙ admin linkine bas)
2. ADIM 3'te oluşturduğun e-posta ve parolayı gir
3. ✅ Dashboard açılmalı, az önce gönderdiğin fikri görmelisin

### Test 3: Veritabanını doğrula
1. Firebase Console → Firestore Database
2. **"Data"** sekmesi
3. ✅ `ideas` koleksiyonu olmalı, içinde gönderdiğin test fikri olmalı

---

## 🆘 Sorun Giderme

### "Firebase bağlantısı kuruldu" yazısı gelmedi (F12 Console)
- `firebaseConfig`'i tam ve doğru yapıştırdın mı?
- `BURAYA_API_KEY` yazıları kaldıysa, eksik yapıştırmışsın
- Tarayıcıyı Ctrl+Shift+R ile yenile (önbellek temizle)

### "auth/invalid-credential" hatası
- E-posta veya parola yanlış
- ADIM 3'te oluşturduğun **TAM AYNI** bilgilerle giriş yap
- Bilgisayar büyük/küçük harf duyarlıdır

### "Missing or insufficient permissions" hatası
- ADIM 5'teki güvenlik kurallarını eksik yapıştırmışsın
- Firebase Console → Firestore → Rules → tekrar kontrol et, **Publish**'lediğinden emin ol

### Form gönderildi ama admin panelinde görünmüyor
- Firestore Database'i kontrol et — veri orada mı?
- `index.html` ve `admin.html`'deki `firebaseConfig` **AYNI** mı?
- Tarayıcı konsolunda (F12) hata var mı?

### Admin paneline giriş yapamıyorum, "Firebase Kurulumu Gerekli" diyor
- `admin.html` dosyasındaki `firebaseConfig`'i değiştirmedin
- Adım 2'yi `admin.html` için de tekrarla

### "auth/unauthorized-domain" hatası
- ADIM 6'da Vercel domain'lerini Firebase'e eklemedin
- Hangi domain'den giriş yapıyorsun, onu **Authorized domains**'e ekle

---

## 🔐 Güvenlik Notları

### ✅ Güvenli Olduğun Durumlar
- Parolanı kimseyle paylaşma
- `firebaseConfig`'deki `apiKey` halka açık olabilir (Google'ın çalışma şekli budur — gerçek güvenlik kurallar üzerinden çalışır)
- HTTPS otomatik aktif (Vercel sağlıyor)
- Verilerin Google'ın sunucularında şifreli saklanır

### ⚠️ Dikkat
- Parolanı tahmin edilebilecek bir şey yapma (`123456`, `password`, doğum tarihin)
- Şifre unuttuysan: Firebase Console → Authentication → Users → e-postanın yanındaki üç noktaya tıkla → **Reset password**

---

## 💰 Maliyet — Tamamen ÜCRETSİZ

Firebase Spark planı limitleri (senin için fazlasıyla yeterli):
- **Authentication:** ayda 50.000 ücretsiz giriş
- **Firestore:** günde 20.000 okuma, 20.000 yazma, 1 GB depolama
- **Bandwidth:** ayda 10 GB

Kişisel portfolyo için bu limitlere **asla yaklaşmazsın**. Endişe etme.

---

## 🎯 Hızlı Kontrol Listesi

Hepsi tamamsa siten %100 profesyonel:

- [ ] Firebase projesi oluşturuldu
- [ ] `firebaseConfig` HEM `index.html` HEM `admin.html`'de doğru
- [ ] Authentication açıldı, admin kullanıcısı eklendi
- [ ] Firestore Database oluşturuldu (eur3 konumu)
- [ ] Güvenlik kuralları yapıştırılıp **Publish**'lendi
- [ ] Vercel domain'leri Firebase Authorized Domains'e eklendi
- [ ] Git push yapıldı, Vercel deploy etti
- [ ] Test fikri gönderildi, admin panelinde görüldü

---

## 🚀 Sonraki Yol Haritan

Firebase kurduktan sonra ileride yapabileceğin harika şeyler:
- Yeni admin kullanıcısı ekleme (örn. ekip arkadaşı)
- Fikirlere "Cevaplandı" / "Hayata geçti" gibi etiketler ekleme
- Fikirleri kategorilere göre istatistik (grafik)
- E-posta bildirimi (yeni fikir geldiğinde sana otomatik mail)
- Yorum sistemi (her fikre cevap yazabilme)

Bunların hepsi şu an oluşturduğun altyapı üzerine eklenir 💪

---

İyi şanslar! Takıldığın yere bana yaz, beraber çözeriz 🔥
