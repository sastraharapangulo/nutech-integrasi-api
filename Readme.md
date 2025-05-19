# 📦 Nutech Integrasi API - Sastra Harapan Gulo

Sistem backend API yang menyediakan layanan untuk login user, pengecekan saldo, top-up balance, dan riwayat transaksi.

## 🌍 Application URL

**API Documentation:** [Nutech API Docs](https://127.0.0.1:3000/api/v1/api-docs)

## 🚀 Features

- User Authentication menggunakan JWT
- Cek Saldo (Balance)
- Top Up Balance
- History Transaksi
- Validasi input
- Dokumentasi API dengan Swagger (OpenAPI)

---

## 🛠️ Tech Stack

- Node.js min versi 20.0.0
- Express.js
- PostgreSQL
- JSON Web Token (JWT)
- Express Validator
- Swagger (OpenAPI)
- Dotenv

---

## 🚀 Installation Steps

1. **Clone Repository:**
   ```sh
   git clone
   cd api-nutech-integrasi
   ```
2. **Copy dan Konfigurasi File Environment:**
   ```sh
   cp .env.sample .env
   ```
3. **Install Dependencies:**
   ```sh
   npm install
   ```

## Inisialisasi Database

1. **Pastikan Anda Sudah:**
   - Menginstall PostgreSQL
   - Menyiapkan database (nutech)
   - Mengatur koneksi di file .env
2. **Inisialisasi Database**
   ```sh
   npm run db:init
   ```

## 📫 Author

Made by Sastra Harapan Gulo
