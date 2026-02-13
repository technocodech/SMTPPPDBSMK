// ============================================
// PRODUCTION CONFIGURATION - PASTIKAN URL SESUAI
// ============================================

// BACKEND URL - GANTI SESUAI IP / DOMAIN ANDA
// ============================================
// Local development: 
const BASE_URL = "https://4649-36-70-40-50.ngrok-free.app";
// 
// Jaringan lokal: 
// const BASE_URL = "http://192.168.1.100:8000";
//
// Production: 
// const BASE_URL = "https://api.sekolahmodern.sch.id";

// EXPOSE KE GLOBAL
window.BASE_URL = BASE_URL;
window.APP_NAME = "Sekolah Modern";
window.PPDB_YEAR = "2026/2027";

// JANGAN UBAH BARIS DI BAWAH INI
console.log(`🔥 API URL: ${window.BASE_URL}`);

console.log(`📅 PPDB: ${window.PPDB_YEAR}`);

