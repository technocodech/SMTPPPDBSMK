// ============================================
// API SERVICE - KONEKSI KE BACKEND
// ============================================

class ApiService {
    constructor() {
        this.baseUrl = window.BASE_URL;
        console.log("✅ API Service ready:", this.baseUrl);
    }

    async register(formData) {
        try {
            console.log("📤 Mengirim data pendaftaran...");
            
            // DEBUG: Tampilkan data yang dikirim
            for (let pair of formData.entries()) {
                if (pair[0] === 'document') {
                    console.log(`📎 File: ${pair[1].name} (${pair[1].type})`);
                } else {
                    console.log(`📝 ${pair[0]}: ${pair[1]}`);
                }
            }

            const response = await fetch(`${this.baseUrl}/api/register`, {
                method: 'POST',
                body: formData,
                // JANGAN SET CONTENT-TYPE! Browser akan set otomatis dengan boundary
            });

            console.log("📥 Response status:", response.status);
            
            const data = await response.json();
            console.log("📦 Response data:", data);

            if (!response.ok) {
                throw new Error(data.detail || data.message || 'Pendaftaran gagal');
            }

            return {
                success: true,
                message: data.message,
                registration_number: data.registration_number,
                data: data
            };

        } catch (error) {
            console.error("❌ Error:", error.message);
            
            let errorMessage = error.message;
            
            if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Tidak dapat terhubung ke server. Pastikan backend sudah running.';
            }
            
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    async healthCheck() {
        try {
            const response = await fetch(`${this.baseUrl}/api/health`);
            const data = await response.json();
            console.log("💚 Server health:", data);
            return data;
        } catch (error) {
            console.error("💔 Server down:", error.message);
            return null;
        }
    }
}

// INITIALIZE
window.api = new ApiService();

// AUTO CHECK SERVER
setTimeout(() => {
    window.api.healthCheck();
}, 1000);