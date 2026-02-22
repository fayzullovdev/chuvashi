// Rules Data - 90+ qoidalar
const rulesData = [
    // 1. Umumiy Qoidalar (1-15)
    { category: "Umumiy Qoidalar", num: "1.1", text: "O'yinchilarni haqorat qilish, kamsitish yoki provokatsiya qilish taqiqlanadi.", penalty: "Mute 30m - 1d" },
    { category: "Umumiy Qoidalar", num: "1.2", text: "Serverda reklama tarqatish qat'iyan man etiladi.", penalty: "Ban Permanent" },
    { category: "Umumiy Qoidalar", num: "1.3", text: "Ma'muriyat (Admin) so'zini inkor qilish yoki uning ishiga xalaqit berish taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Umumiy Qoidalar", num: "1.4", text: "Yolg'on ma'lumot berish yoki ma'muriyatni aldashga urinish taqiqlanadi.", penalty: "Ban 3d - 14d" },
    { category: "Umumiy Qoidalar", num: "1.5", text: "Discord yoki boshqa platformalarda ma'muriyatni haqorat qilish taqiqlanadi.", penalty: "Ban 7d - Permanent" },
    { category: "Umumiy Qoidalar", num: "1.6", text: "Server qoidalarini buzishga chaqirish yoki qo'llab-quvvatlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Umumiy Qoidalar", num: "1.7", text: "Ma'muriyatga nisbatan qo'pol yoki hurmatsiz munosabatda bo'lish taqiqlanadi.", penalty: "Ban 1d - 14d" },
    { category: "Umumiy Qoidalar", num: "1.8", text: "Serverda siyosiy yoki diniy mavzularni muhokama qilish taqiqlanadi.", penalty: "Mute 1h - 1d" },
    { category: "Umumiy Qoidalar", num: "1.9", text: "Rasmiy kanallarda spam yoki reklama qilish taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Umumiy Qoidalar", num: "1.10", text: "Boshqa o'yinchilarni aldash yoki firibgarlik qilish taqiqlanadi.", penalty: "Ban 7d - Permanent" },
    { category: "Umumiy Qoidalar", num: "1.11", text: "Serverda narkotik yoki spirtli ichimliklar haqida gapirish taqiqlanadi.", penalty: "Mute 1d - Ban 3d" },
    { category: "Umumiy Qoidalar", num: "1.12", text: "O'z-o'zini ma'muriyat deb ko'rsatish yoki fake admin bo'lish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Umumiy Qoidalar", num: "1.13", text: "Serverda qonuniy bo'lmagan faoliyatni targ'ib qilish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Umumiy Qoidalar", num: "1.14", text: "Ma'muriyatning shaxsiy ma'lumotlarini tarqatish taqiqlanadi.", penalty: "Ban 14d - Permanent" },
    { category: "Umumiy Qoidalar", num: "1.15", text: "Serverda zo'ravonlik yoki qo'rqitishni targ'ib qilish taqiqlanadi.", penalty: "Ban 7d - Permanent" },

    // 2. O'yin Jarayoni (2.1-2.20)
    { category: "O'yin Jarayoni", num: "2.1", text: "Cheatlardan yoki yordamchi dasturlardan foydalanish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "O'yin Jarayoni", num: "2.2", text: "Bug yoki xatoliklardan foydalanish taqiqlanadi.", penalty: "Ban 1w - Permanent" },
    { category: "O'yin Jarayoni", num: "2.3", text: "O'yin balansini buzuvchi harakatlar (monitoring, ghosting) man etiladi.", penalty: "Ban 1d - 7d" },
    { category: "O'yin Jarayoni", num: "2.4", text: "Aimbot, wallhack yoki boshqa cheatlardan foydalanish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "O'yin Jarayoni", num: "2.5", text: "Spinbot yoki boshqa aniq ko'rinadigan cheatlardan foydalanish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "O'yin Jarayoni", num: "2.6", text: "Macro yoki avtomatik skriptlardan foydalanish taqiqlanadi.", penalty: "Ban 7d - Permanent" },
    { category: "O'yin Jarayoni", num: "2.7", text: "O'yin ichida exploit yoki glitchlardan foydalanish taqiqlanadi.", penalty: "Ban 3d - 14d" },
    { category: "O'yin Jarayoni", num: "2.8", text: "Team-killing yoki o'z jamoasiga zarar yetkazish taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "O'yin Jarayoni", num: "2.9", text: "Intentional griefing yoki o'yinni buzish taqiqlanadi.", penalty: "Ban 1d - 14d" },
    { category: "O'yin Jarayoni", num: "2.10", text: "O'yin ichida afk bo'lib qolish yoki o'yinni tark etish taqiqlanadi.", penalty: "Kick - Ban 1d" },
    { category: "O'yin Jarayoni", num: "2.11", text: "O'yin ichida o'z-o'zini o'ldirish (suicide) qilish taqiqlanadi.", penalty: "Ban 1h - 1d" },
    { category: "O'yin Jarayoni", num: "2.12", text: "O'yin ichida ma'muriyatga qarshi chiqish yoki qoida buzish taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "O'yin Jarayoni", num: "2.13", text: "O'yin ichida boshqa o'yinchilarni aldash yoki firibgarlik qilish taqiqlanadi.", penalty: "Ban 7d - Permanent" },
    { category: "O'yin Jarayoni", num: "2.14", text: "O'yin ichida xaritalarni buzish yoki exploit qilish taqiqlanadi.", penalty: "Ban 3d - 14d" },
    { category: "O'yin Jarayoni", num: "2.15", text: "O'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "O'yin Jarayoni", num: "2.16", text: "O'yin ichida o'z jamoasiga xiyonat qilish taqiqlanadi.", penalty: "Ban 1d - 14d" },
    { category: "O'yin Jarayoni", num: "2.17", text: "O'yin ichida boshqa o'yinchilarni bloklash yoki to'sib qo'yish taqiqlanadi.", penalty: "Ban 1h - 1d" },
    { category: "O'yin Jarayoni", num: "2.18", text: "O'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "O'yin Jarayoni", num: "2.19", text: "O'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "O'yin Jarayoni", num: "2.20", text: "O'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "O'yin Jarayoni", num: "2.21", text: "O'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "O'yin Jarayoni", num: "2.22", text: "O'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "O'yin Jarayoni", num: "2.23", text: "O'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "O'yin Jarayoni", num: "2.24", text: "O'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "O'yin Jarayoni", num: "2.25", text: "O'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "O'yin Jarayoni", num: "2.26", text: "O'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "O'yin Jarayoni", num: "2.27", text: "O'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "O'yin Jarayoni", num: "2.28", text: "O'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "O'yin Jarayoni", num: "2.29", text: "O'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "O'yin Jarayoni", num: "2.30", text: "O'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },

    // 3. Chat va Mikrofon (3.1-3.15)
    { category: "Chat va Mikrofon", num: "3.1", text: "Mikrofonda baqirish, musiqa qo'yish yoki shovqin qilish taqiqlanadi.", penalty: "Mute 30m - 1d" },
    { category: "Chat va Mikrofon", num: "3.2", text: "Spam chat taqiqlanadi.", penalty: "Mute 1h - 1d" },
    { category: "Chat va Mikrofon", num: "3.3", text: "Siyosiy yoki diniy mavzularni muhokama qilish taqiqlanadi.", penalty: "Mute 1d - Ban 3d" },
    { category: "Chat va Mikrofon", num: "3.4", text: "Chatda haqorat yoki kamsitish so'zlari ishlatish taqiqlanadi.", penalty: "Mute 1h - 1d" },
    { category: "Chat va Mikrofon", num: "3.5", text: "Chatda reklama yoki spam qilish taqiqlanadi.", penalty: "Mute 1d - Ban 3d" },
    { category: "Chat va Mikrofon", num: "3.6", text: "Mikrofonda shovqin yoki musiqa qo'yish taqiqlanadi.", penalty: "Mute 30m - 1d" },
    { category: "Chat va Mikrofon", num: "3.7", text: "Chatda yolg'on ma'lumot tarqatish taqiqlanadi.", penalty: "Mute 1h - 1d" },
    { category: "Chat va Mikrofon", num: "3.8", text: "Chatda boshqa o'yinchilarni provokatsiya qilish taqiqlanadi.", penalty: "Mute 1d - Ban 1d" },
    { category: "Chat va Mikrofon", num: "3.9", text: "Mikrofonda nafrat yoki haqorat so'zlari ishlatish taqiqlanadi.", penalty: "Mute 1d - Ban 3d" },
    { category: "Chat va Mikrofon", num: "3.10", text: "Chatda ma'muriyatni haqorat qilish taqiqlanadi.", penalty: "Mute 1d - Ban 7d" },
    { category: "Chat va Mikrofon", num: "3.11", text: "Chatda spam yoki takrorlanuvchi xabarlar yuborish taqiqlanadi.", penalty: "Mute 1h - 1d" },
    { category: "Chat va Mikrofon", num: "3.12", text: "Mikrofonda o'yin jarayoniga xalaqit beradigan shovqin qilish taqiqlanadi.", penalty: "Mute 1h - 1d" },
    { category: "Chat va Mikrofon", num: "3.13", text: "Chatda boshqa o'yinchilarni kamsitish yoki haqorat qilish taqiqlanadi.", penalty: "Mute 1d - Ban 3d" },
    { category: "Chat va Mikrofon", num: "3.14", text: "Chatda yolg'on ma'lumot tarqatish yoki aldash taqiqlanadi.", penalty: "Mute 1h - 1d" },
    { category: "Chat va Mikrofon", num: "3.15", text: "Mikrofonda o'yin jarayoniga xalaqit beradigan harakatlar qilish taqiqlanadi.", penalty: "Mute 1h - 1d" },

    // 4. Server Qoidalari (4.1-4.15)
    { category: "Server Qoidalari", num: "4.1", text: "Serverda qonuniy bo'lmagan faoliyatni targ'ib qilish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Server Qoidalari", num: "4.2", text: "Serverda boshqa o'yinchilarni aldash yoki firibgarlik qilish taqiqlanadi.", penalty: "Ban 7d - Permanent" },
    { category: "Server Qoidalari", num: "4.3", text: "Serverda ma'muriyatga nisbatan qo'pol yoki hurmatsiz munosabatda bo'lish taqiqlanadi.", penalty: "Ban 1d - 14d" },
    { category: "Server Qoidalari", num: "4.4", text: "Serverda o'z-o'zini ma'muriyat deb ko'rsatish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Server Qoidalari", num: "4.5", text: "Serverda qonuniy bo'lmagan faoliyatni targ'ib qilish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Server Qoidalari", num: "4.6", text: "Serverda boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Server Qoidalari", num: "4.7", text: "Serverda o'yin jarayoniga xalaqit berish taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Server Qoidalari", num: "4.8", text: "Serverda boshqa o'yinchilarni bloklash yoki to'sib qo'yish taqiqlanadi.", penalty: "Ban 1h - 1d" },
    { category: "Server Qoidalari", num: "4.9", text: "Serverda o'yin ichida exploit yoki glitchlardan foydalanish taqiqlanadi.", penalty: "Ban 3d - 14d" },
    { category: "Server Qoidalari", num: "4.10", text: "Serverda o'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Server Qoidalari", num: "4.11", text: "Serverda o'yin ichida o'z jamoasiga zarar yetkazish taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Server Qoidalari", num: "4.12", text: "Serverda o'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Server Qoidalari", num: "4.13", text: "Serverda o'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Server Qoidalari", num: "4.14", text: "Serverda o'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Server Qoidalari", num: "4.15", text: "Serverda o'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Server Qoidalari", num: "4.16", text: "Serverda o'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Server Qoidalari", num: "4.17", text: "Serverda o'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Server Qoidalari", num: "4.18", text: "Serverda o'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Server Qoidalari", num: "4.19", text: "Serverda o'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Server Qoidalari", num: "4.20", text: "Serverda o'yin ichida boshqa o'yinchilarni o'ldirishga majburlash taqiqlanadi.", penalty: "Ban 1d - 7d" },

    // 5. Privilegiyalar va Do'kon (5.1-5.10)
    { category: "Privilegiyalar va Do'kon", num: "5.1", text: "Privilegiyalarni boshqa shaxsga o'tkazish yoki sotish taqiqlanadi.", penalty: "Ban 14d - Permanent" },
    { category: "Privilegiyalar va Do'kon", num: "5.2", text: "Privilegiyalarni noto'g'ri usulda olishga urinish taqiqlanadi.", penalty: "Ban 7d - Permanent" },
    { category: "Privilegiyalar va Do'kon", num: "5.3", text: "Privilegiyalardan noto'g'ri foydalanish taqiqlanadi.", penalty: "Ban 3d - 14d" },
    { category: "Privilegiyalar va Do'kon", num: "5.4", text: "Privilegiyalarni boshqa o'yinchilarga berish taqiqlanadi.", penalty: "Ban 7d - Permanent" },
    { category: "Privilegiyalar va Do'kon", num: "5.5", text: "Privilegiyalarni sotish yoki almashtirish taqiqlanadi.", penalty: "Ban 14d - Permanent" },
    { category: "Privilegiyalar va Do'kon", num: "5.6", text: "Privilegiyalarni noto'g'ri usulda olishga urinish taqiqlanadi.", penalty: "Ban 7d - Permanent" },
    { category: "Privilegiyalar va Do'kon", num: "5.7", text: "Privilegiyalardan noto'g'ri foydalanish taqiqlanadi.", penalty: "Ban 3d - 14d" },
    { category: "Privilegiyalar va Do'kon", num: "5.8", text: "Privilegiyalarni boshqa o'yinchilarga berish taqiqlanadi.", penalty: "Ban 7d - Permanent" },
    { category: "Privilegiyalar va Do'kon", num: "5.9", text: "Privilegiyalarni sotish yoki almashtirish taqiqlanadi.", penalty: "Ban 14d - Permanent" },
    { category: "Privilegiyalar va Do'kon", num: "5.10", text: "Privilegiyalarni noto'g'ri usulda olishga urinish taqiqlanadi.", penalty: "Ban 7d - Permanent" },
    { category: "Privilegiyalar va Do'kon", num: "5.11", text: "Privilegiyalarni noto'g'ri usulda olishga urinish taqiqlanadi.", penalty: "Ban 7d - Permanent" },
    { category: "Privilegiyalar va Do'kon", num: "5.12", text: "Privilegiyalarni noto'g'ri usulda olishga urinish taqiqlanadi.", penalty: "Ban 7d - Permanent" },
    { category: "Privilegiyalar va Do'kon", num: "5.13", text: "Privilegiyalarni noto'g'ri usulda olishga urinish taqiqlanadi.", penalty: "Ban 7d - Permanent" },
    { category: "Privilegiyalar va Do'kon", num: "5.14", text: "Privilegiyalarni noto'g'ri usulda olishga urinish taqiqlanadi.", penalty: "Ban 7d - Permanent" },
    { category: "Privilegiyalar va Do'kon", num: "5.15", text: "Privilegiyalarni noto'g'ri usulda olishga urinish taqiqlanadi.", penalty: "Ban 7d - Permanent" },

    // 6. Texnik Qoidalar (6.1-6.10)
    { category: "Texnik Qoidalar", num: "6.1", text: "Serverga DDoS hujum qilish yoki xizmatni buzish taqiqlanadi.", penalty: "Ban Permanent + IP Ban" },
    { category: "Texnik Qoidalar", num: "6.2", text: "Serverga kirishga urinish yoki exploit qilish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Texnik Qoidalar", num: "6.3", text: "Server kodini buzish yoki exploit qilish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Texnik Qoidalar", num: "6.4", text: "Serverga kirishga urinish yoki exploit qilish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Texnik Qoidalar", num: "6.5", text: "Server kodini buzish yoki exploit qilish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Texnik Qoidalar", num: "6.6", text: "Serverga DDoS hujum qilish yoki xizmatni buzish taqiqlanadi.", penalty: "Ban Permanent + IP Ban" },
    { category: "Texnik Qoidalar", num: "6.7", text: "Serverga kirishga urinish yoki exploit qilish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Texnik Qoidalar", num: "6.8", text: "Server kodini buzish yoki exploit qilish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Texnik Qoidalar", num: "6.9", text: "Serverga kirishga urinish yoki exploit qilish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Texnik Qoidalar", num: "6.10", text: "Server kodini buzish yoki exploit qilish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Texnik Qoidalar", num: "6.11", text: "Serverga kirishga urinish yoki exploit qilish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Texnik Qoidalar", num: "6.12", text: "Server kodini buzish yoki exploit qilish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Texnik Qoidalar", num: "6.13", text: "Serverga kirishga urinish yoki exploit qilish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Texnik Qoidalar", num: "6.14", text: "Server kodini buzish yoki exploit qilish taqiqlanadi.", penalty: "Ban Permanent" },
    { category: "Texnik Qoidalar", num: "6.15", text: "Serverga kirishga urinish yoki exploit qilish taqiqlanadi.", penalty: "Ban Permanent" },

    // 7. Jamiyat Qoidalari (7.1-7.10)
    { category: "Jamiyat Qoidalari", num: "7.1", text: "Jamiyatda nafrat yoki diskriminatsiya targ'ib qilish taqiqlanadi.", penalty: "Ban 7d - Permanent" },
    { category: "Jamiyat Qoidalari", num: "7.2", text: "Jamiyatda boshqa a'zolarni haqorat qilish taqiqlanadi.", penalty: "Ban 3d - 14d" },
    { category: "Jamiyat Qoidalari", num: "7.3", text: "Jamiyatda spam yoki reklama qilish taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Jamiyat Qoidalari", num: "7.4", text: "Jamiyatda yolg'on ma'lumot tarqatish taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Jamiyat Qoidalari", num: "7.5", text: "Jamiyatda ma'muriyatga nisbatan qo'pol yoki hurmatsiz munosabatda bo'lish taqiqlanadi.", penalty: "Ban 1d - 14d" },
    { category: "Jamiyat Qoidalari", num: "7.6", text: "Jamiyatda boshqa a'zolarni provokatsiya qilish taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Jamiyat Qoidalari", num: "7.7", text: "Jamiyatda nafrat yoki diskriminatsiya targ'ib qilish taqiqlanadi.", penalty: "Ban 7d - Permanent" },
    { category: "Jamiyat Qoidalari", num: "7.8", text: "Jamiyatda boshqa a'zolarni haqorat qilish taqiqlanadi.", penalty: "Ban 3d - 14d" },
    { category: "Jamiyat Qoidalari", num: "7.9", text: "Jamiyatda spam yoki reklama qilish taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Jamiyat Qoidalari", num: "7.10", text: "Jamiyatda yolg'on ma'lumot tarqatish taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Jamiyat Qoidalari", num: "7.11", text: "Jamiyatda yolg'on ma'lumot tarqatish taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Jamiyat Qoidalari", num: "7.12", text: "Jamiyatda yolg'on ma'lumot tarqatish taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Jamiyat Qoidalari", num: "7.13", text: "Jamiyatda yolg'on ma'lumot tarqatish taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Jamiyat Qoidalari", num: "7.14", text: "Jamiyatda yolg'on ma'lumot tarqatish taqiqlanadi.", penalty: "Ban 1d - 7d" },
    { category: "Jamiyat Qoidalari", num: "7.15", text: "Jamiyatda yolg'on ma'lumot tarqatish taqiqlanadi.", penalty: "Ban 1d - 7d" }
];

// Rules rendering and search functionality
function renderRules(filteredRules = null) {
    const rulesContent = document.querySelector('.rules-content');
    if (!rulesContent) return;

    const rulesToRender = filteredRules || rulesData;
    const categories = [...new Set(rulesToRender.map(r => r.category))];

    let html = '';
    categories.forEach(category => {
        const categoryRules = rulesToRender.filter(r => r.category === category);
        html += `
            <div class="rule-category hidden">
                <h2>${category}</h2>
                <ul class="rule-list">
                    ${categoryRules.map(rule => `
                        <li>
                            <span class="rule-num">${rule.num}</span>
                            ${rule.text}
                            <span class="rule-penalty">(${rule.penalty})</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    });

    rulesContent.innerHTML = html;
    
    // Re-initialize animations
    initRulesAnimations();
}

function initRulesAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.rule-category.hidden');
    hiddenElements.forEach((el) => {
        observer.observe(el);
    });
}

function initRulesSearch() {
    const searchInput = document.getElementById('rulesSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            renderRules();
            return;
        }

        const filteredRules = rulesData.filter(rule => {
            const searchText = `${rule.text} ${rule.penalty} ${rule.category} ${rule.num}`.toLowerCase();
            return searchText.includes(searchTerm);
        });

        renderRules(filteredRules);
        
        // Show no results message
        const rulesContent = document.querySelector('.rules-content');
        if (filteredRules.length === 0 && rulesContent) {
            rulesContent.innerHTML = `
                <div class="no-results">
                    <p>Hech qanday qoida topilmadi. Boshqa so'z bilan qidiring.</p>
                </div>
            `;
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderRules();
    initRulesSearch();
});

