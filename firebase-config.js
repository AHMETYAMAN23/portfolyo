// ============================================================
// FIREBASE CONFIG - SADECE BU DOSYAYI DÜZENLE!
// ============================================================
// Firebase Console > Project Settings > Your apps bölümünden
// aldığın firebaseConfig değerlerini aşağıya yapıştır.
//
// ÖNEMLİ: index.html ve admin.html bu dosyayı otomatik kullanır.
// Sadece BU dosyayı düzenlemen yeterlidir.
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyAs8nP6GZ-41UUMBt8YXBmMni-MuKpqPK4",
    authDomain: "ahmetyaman-portfolio.firebaseapp.com",
    projectId: "ahmetyaman-portfolio",
    storageBucket: "ahmetyaman-portfolio.firebasestorage.app",
    messagingSenderId: "414231552646",
    appId: "1:414231552646:web:632f70706b711229eda707"

};

// Bu satırın ALTINI DEĞİŞTİRME!
window.__FIREBASE_CONFIG__ = firebaseConfig;
window.__FIREBASE_READY__ = firebaseConfig.apiKey !== "BURAYA_API_KEY" ;
