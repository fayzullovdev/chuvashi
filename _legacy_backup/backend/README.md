# Steam OpenID Backend Server

Bu backend server Steam OpenID autentifikatsiyasini qo'llab-quvvatlaydi.

## O'rnatish

1. Node.js o'rnatilgan bo'lishi kerak
2. Dependencies o'rnatish:
```bash
npm install
```

## Ishga tushirish

```bash
npm start
```

Yoki development rejimda:
```bash
npm run dev
```

Server `http://localhost:3000` da ishga tushadi.

## Sozlash

Frontend faylida (`assets/js/steam-auth.js`) `BACKEND_URL` ni o'z serveringiz URL ga o'zgartiring:

```javascript
const BACKEND_URL = 'http://localhost:3000'; // Yoki production URL
```

## Endpoints

- `GET /auth/steam` - Steam OpenID ga redirect qiladi
- `GET /auth/steam/callback` - Steam dan qaytgan callback ni qayta ishlaydi
- `GET /api/user/:steamId` - Foydalanuvchi ma'lumotlarini qaytaradi

## Production

Production uchun:
1. Environment variables sozlang
2. HTTPS ishlatishni tavsiya qilamiz
3. CORS sozlamalarini tekshiring
4. Error handling ni yaxshilang

