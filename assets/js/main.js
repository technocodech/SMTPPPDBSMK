// ============================================
// MAIN UI CONTROLLER - GLOBAL FUNCTIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("🎨 UI Controller ready");
    
    // ========== NAVBAR SCROLL EFFECT ==========
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ========== COUNTER ANIMATION ==========
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            let current = 0;
            const increment = target / 50;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current).toLocaleString() + suffix;
                    setTimeout(updateCounter, 30);
                } else {
                    counter.innerText = target.toLocaleString() + suffix;
                }
            };
            
            updateCounter();
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    // ========== CURRENT YEAR ==========
    document.querySelectorAll('.current-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
    
    // ========== PPDB YEAR ==========
    document.querySelectorAll('.ppdb-year').forEach(el => {
        el.textContent = window.PPDB_YEAR || '2026/2027';
    });
});