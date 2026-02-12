// ============================================
// FORM HANDLER - PRODUCTION READY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 DOM loaded - initializing form...");
    
    const form = document.getElementById('registrationForm');
    
    if (!form) {
        console.error("❌ Form tidak ditemukan! Pastikan ID='registrationForm'");
        return;
    }
    
    console.log("✅ Form ditemukan, mengaktifkan handler...");
    
    // ========== FILE UPLOAD HANDLER ==========
    const fileInput = document.getElementById('document');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const fileUploadArea = document.querySelector('.file-upload-area');
    
    if (fileInput && fileNameDisplay) {
        fileInput.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                fileNameDisplay.textContent = file.name;
                fileNameDisplay.style.color = 'var(--gold-dark)';
                
                // Validasi file
                const maxSize = 2 * 1024 * 1024; // 2MB
                const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
                
                if (!allowedTypes.includes(file.type)) {
                    showAlert('Format file harus PDF, JPG, atau PNG', 'error');
                    this.value = '';
                    fileNameDisplay.textContent = 'Tidak ada file dipilih';
                    return;
                }
                
                if (file.size > maxSize) {
                    showAlert('Ukuran file maksimal 2MB', 'error');
                    this.value = '';
                    fileNameDisplay.textContent = 'Tidak ada file dipilih';
                    return;
                }
            } else {
                fileNameDisplay.textContent = 'Tidak ada file dipilih';
            }
        });
        
        // Trigger file input saat area diklik
        if (fileUploadArea) {
            fileUploadArea.addEventListener('click', function(e) {
                if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
                    fileInput.click();
                }
            });
        }
    }
    
    // ========== INPUT ICON EFFECTS ==========
    document.querySelectorAll('.input-wrapper').forEach(wrapper => {
        const input = wrapper.querySelector('.form-control');
        const icon = wrapper.querySelector('.input-icon');
        
        if (input && icon) {
            input.addEventListener('focus', () => {
                icon.style.color = 'var(--gold)';
                icon.style.transform = 'scale(1.1)';
            });
            
            input.addEventListener('blur', () => {
                icon.style.color = '';
                icon.style.transform = '';
            });
        }
    });
    
    // ========== FORM SUBMISSION ==========
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log("📤 Form submitted!");
        
        // ========== VALIDASI ==========
        const full_name = document.getElementById('full_name')?.value;
        const nisn = document.getElementById('nisn')?.value;
        const email = document.getElementById('email')?.value;
        const phone = document.getElementById('phone')?.value;
        const origin_school = document.getElementById('origin_school')?.value;
        const major = document.getElementById('major')?.value;
        const address = document.getElementById('address')?.value;
        const document_file = document.getElementById('document')?.files[0];
        const agreement = document.getElementById('agreement')?.checked;
        
        // Reset error
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));
        
        let isValid = true;
        
        // Validasi Nama
        if (!full_name || full_name.trim() === '') {
            showFieldError('full_name', 'Nama lengkap harus diisi');
            isValid = false;
        }
        
        // Validasi NISN
        if (!nisn || nisn.trim() === '') {
            showFieldError('nisn', 'NISN harus diisi');
            isValid = false;
        } else if (!/^\d{10}$/.test(nisn)) {
            showFieldError('nisn', 'NISN harus 10 digit angka');
            isValid = false;
        }
        
        // Validasi Email
        if (!email || email.trim() === '') {
            showFieldError('email', 'Email harus diisi');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFieldError('email', 'Format email tidak valid');
            isValid = false;
        }
        
        // Validasi Phone
        if (!phone || phone.trim() === '') {
            showFieldError('phone', 'Nomor WhatsApp harus diisi');
            isValid = false;
        } else if (!/^(0|62)\d{9,13}$/.test(phone.replace(/\s/g, ''))) {
            showFieldError('phone', 'Format nomor WhatsApp tidak valid');
            isValid = false;
        }
        
        // Validasi Asal Sekolah
        if (!origin_school || origin_school.trim() === '') {
            showFieldError('origin_school', 'Asal sekolah harus diisi');
            isValid = false;
        }
        
        // Validasi Jurusan
        if (!major || major === '') {
            showFieldError('major', 'Pilih jurusan terlebih dahulu');
            isValid = false;
        }
        
        // Validasi Alamat
        if (!address || address.trim() === '') {
            showFieldError('address', 'Alamat harus diisi');
            isValid = false;
        }
        
        // Validasi File
        if (!document_file) {
            showAlert('Upload berkas persyaratan', 'error');
            isValid = false;
        }
        
        // Validasi Agreement
        if (!agreement) {
            showAlert('Anda harus menyetujui syarat dan ketentuan', 'error');
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // ========== SUBMIT TO BACKEND ==========
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses pendaftaran...';
        
        try {
            // Buat FormData
            const formData = new FormData();
            formData.append('full_name', full_name.trim());
            formData.append('nisn', nisn.trim());
            formData.append('email', email.trim());
            formData.append('phone', phone.trim());
            formData.append('origin_school', origin_school.trim());
            formData.append('major', major);
            formData.append('address', address.trim());
            formData.append('document', document_file);
            
            // Kirim ke API
            const result = await window.api.register(formData);
            
            if (result.success) {
                // Success
                showAlert(result.message || 'Pendaftaran berhasil!', 'success');
                
                // Simpan nomor registrasi
                if (result.registration_number) {
                    sessionStorage.setItem('registration_number', result.registration_number);
                }
                
                // Redirect ke halaman sukses
                setTimeout(() => {
                    window.location.href = 'success.html';
                }, 2000);
                
            } else {
                // Error dari server
                showAlert(result.error || 'Pendaftaran gagal', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
            
        } catch (error) {
            console.error('Submission error:', error);
            showAlert('Terjadi kesalahan sistem', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
    
    // ========== HELPER FUNCTIONS ==========
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        
        field.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Hapus error lama jika ada
        const oldError = document.getElementById(`error-${fieldId}`);
        if (oldError) oldError.remove();
        
        errorDiv.id = `error-${fieldId}`;
        
        // Cari parent yang tepat
        const parent = field.closest('.form-group') || field.parentNode;
        parent.appendChild(errorDiv);
    }
    
    function showAlert(message, type = 'success') {
        const alertId = 'alert-' + Date.now();
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        
        const alertHtml = `
            <div id="${alertId}" class="custom-alert ${type}">
                <div class="alert-content">
                    <i class="fas ${icon}"></i>
                    <span>${message}</span>
                </div>
                <button onclick="this.parentElement.remove()" class="alert-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', alertHtml);
        
        setTimeout(() => {
            const alert = document.getElementById(alertId);
            if (alert) {
                alert.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => alert.remove(), 300);
            }
        }, 5000);
    }
});

// EXPOSE FUNCTION UNTUK FILE INPUT
window.triggerFileInput = function() {
    document.getElementById('document')?.click();
};