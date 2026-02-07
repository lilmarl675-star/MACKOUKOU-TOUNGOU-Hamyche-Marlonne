document.addEventListener('DOMContentLoaded', () => {
    // Éléments du DOM
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const profileImage = document.querySelector('.hero-image img');

    const projectsGrid = document.getElementById('projectsGrid');
    const toggleProjects = document.getElementById('toggleProjects');

    /* =============================
       MENU HAMBURGER
    ============================= */

    // Gestion du clic sur le menu hamburger
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Fermer le menu quand on clique sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Fermer le menu quand on clique en dehors
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /* =============================
       PROJECTS TOGGLE
    ============================= */
    if (projectsGrid && toggleProjects) {
        const projectCards = projectsGrid.querySelectorAll('.project-card');

        if (projectCards.length <= 3) {
            toggleProjects.style.display = 'none';
        } else {
            toggleProjects.addEventListener('click', () => {
                const expanded = projectsGrid.classList.toggle('expanded');
                toggleProjects.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                toggleProjects.textContent = expanded ? 'Voir moins de projets' : 'Voir plus de projets';
            });
        }
    }

    /* =============================
       ANIMATIONS AU SCROLL
    ============================= */

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    sections.forEach(section => {
        section.classList.add('hidden');
        observer.observe(section);
    });

    /* =============================
       NAVBAR ACTIVE LINK
    ============================= */
    function updateActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    // Mettre à jour le lien actif au chargement et au défilement
    window.addEventListener('load', updateActiveLink);
    window.addEventListener('scroll', updateActiveLink);

    /* =============================
       SMOOTH SCROLL
    ============================= */
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;

            e.preventDefault();
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Mettre à jour l'URL sans recharger la page
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });

    /* =============================
       EFFET GLOW SUR LA PHOTO
    ============================= */
    if (profileImage) {
        profileImage.addEventListener('mousemove', () => {
            profileImage.style.boxShadow = '0 0 60px rgba(0,255,174,0.9)';
            profileImage.style.transform = 'scale(1.02)';
        });

        profileImage.addEventListener('mouseleave', () => {
            profileImage.style.boxShadow = '0 0 40px rgba(0,255,174,0.6)';
            profileImage.style.transform = 'scale(1)';
        });
    }

    /* =============================
       CHARGEMENT DES IMAGES
    ============================= */
    function loadImages() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.onload = () => img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Charger les images
    loadImages();

    /* =============================
       ANIMATION DES BARRES DE COMPÉTENCES
    ============================= */
    const skillBars = document.querySelectorAll('.progress');

    // Fonction pour animer les barres de compétences
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';

            // Réinitialiser l'opacité pour l'animation
            bar.style.opacity = '1';

            // Démarrer l'animation après un court délai pour permettre au navigateur de traiter le changement d'opacité
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-in-out';
                bar.style.width = width;
            }, 100);
        });
    }

    // Observer l'intersection avec la section des compétences
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    // Arrêter d'observer après la première intersection
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(skillsSection);
    }
});