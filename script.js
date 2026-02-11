// Плавная прокрутка, маленькие эффекты
document.addEventListener('DOMContentLoaded', function() {
    // подсветка активного пункта меню
    const currentLocation = location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentLocation) {
            link.classList.add('active');
        }
    });
});