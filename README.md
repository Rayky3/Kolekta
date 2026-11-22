# Kolekta

Aplikasi **Progressive Web App (PWA)** untuk mengelola koleksi pribadi (action figure, kartu, model kit, komik, dan lainnya).
Data dan foto tersimpan di perangkat pengguna menggunakan **IndexedDB**, tanpa login dan tanpa server (*offline-first*).
Satu basis kode untuk dua tampilan: **mobile** (menu bawah) dan **desktop** (sidebar).

## Fitur
- Beranda: total koleksi, ringkasan, dan koleksi terbaru
- Collections: daftar koleksi dan tampilan kosong
- Tambah, lihat detail, edit, dan hapus koleksi
- Foto dari kamera atau galeri, dengan pangkas foto (Kostum, 1:1, 4:3, 16:9, 3:4, 9:16)
- Grafik pertumbuhan koleksi (7H, 1B, 3B, 1T) dan rekap berdasarkan jenis
- Konfirmasi saat keluar dari halaman yang belum disimpan

## Teknologi
HTML, CSS, dan JavaScript tanpa framework; IndexedDB; Web App Manifest dan Service Worker.
Font: Poppins (isi) dan Conthrax (nama "Kolekta").

## Struktur folder
```
Kolekta/
├── assets/            gambar, ikon, dan font
├── css/               style.css, components.css, responsive.css
├── js/                database, navigasi, form, crop, grafik, dan lainnya
├── pages/             dashboard, collection, detail, add, edit, chart
├── index.html         pintu masuk (mengarah ke pages/dashboard.html)
├── manifest.json
├── service-worker.js
└── package.json
```

## Menjalankan secara lokal
1. Buka folder di VS Code, lalu jalankan dengan ekstensi **Live Server** (klik kanan `index.html`, **Open with Live Server**).
2. Atau lewat terminal (butuh Node.js):
   ```
   npm install
   npm start
   ```
Jangan membuka `index.html` dengan klik dua kali (alamat `file://`), karena IndexedDB dan service worker dapat tidak berfungsi.

## Font Conthrax
Letakkan berkas `conthrax-sb.otf` (atau `.ttf`) di `assets/fonts/`. Tanpa berkas ini, nama "Kolekta" memakai font cadangan.
Periksa lisensi Conthrax sebelum aplikasi dipublikasikan.

## Deploy ke GitHub Pages
1. Unggah proyek ke repositori GitHub.
2. Buka **Settings**, **Pages**, pilih cabang `main` dan folder `/ (root)`.
3. Aplikasi dapat dibuka di `https://<username>.github.io/<nama-repo>/`.

Semua jalur berkas bersifat relatif agar berjalan di subfolder GitHub Pages.

## Catatan data
Data tersimpan hanya di peramban perangkat. Menghapus data situs atau aplikasi akan menghapus koleksi, dan data tidak tersinkronisasi antarperangkat.

## Status pengembangan
- [x] Halaman, CSS, dan JavaScript inti
- [ ] `manifest.json` dan ikon aplikasi
- [ ] `service-worker.js` (akses tanpa internet)
- [ ] Font lokal untuk mode offline