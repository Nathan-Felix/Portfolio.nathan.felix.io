document.addEventListener('DOMContentLoaded', function() {
    "use strict";
    
    // Éléments DOM
    const loader = document.querySelector('.loader-container');
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const themeToggle = document.getElementById('themeToggle');
    const typedText = document.getElementById('typedText');
    const certFeed = document.getElementById('cert-feed');
    const contactForm = document.getElementById('contactForm');
    
    // Initialiser les animations
    initAnimations();
    
    // Effet de machine à écrire
    if (typedText) {
        typeWriter();
    }
    
    // Créer les bulletins CERT-FR
    if (certFeed) {
        loadCertFeed();
    }
    
    // Gérer la soumission du formulaire de contact
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Animation de chargement
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 800);
    }
    
    // Afficher/masquer le menu mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
    
    // Fermer le menu mobile lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });
    
    // Détection du défilement
    window.addEventListener('scroll', () => {
        handleScroll();
        animateOnScroll();
    });
    
    // Toggle entre mode clair et sombre
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // Vérifier les préférences de l'utilisateur
        if (localStorage.getItem('theme') === 'dark' || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))) {
            document.body.classList.add('dark-theme');
        }
    }
    
    // Smooth scroll pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Bouton retour en haut
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Animation au défilement
    function handleScroll() {
        const scrollPosition = window.scrollY;
        
        // Header collant
        if (scrollPosition > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
        
        // Bouton retour en haut
        if (scrollPosition > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
        
        // Navigation active
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const id = section.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Initialiser les animations
    function initAnimations() {
        // Ajouter la classe fade-in aux éléments à animer
        document.querySelectorAll('.section-header, .formation-content, .experience-item, .competence-category, .projet-card, .cert-item, .contact-item').forEach(el => {
            el.classList.add('fade-in');
        });
        
        // Déclencher l'animation sur les éléments visibles au chargement
        setTimeout(() => {
            animateOnScroll();
        }, 100);
    }
    
    // Animer les éléments au défilement
    function animateOnScroll() {
        const elements = document.querySelectorAll('.fade-in');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    // Effet de machine à écrire
    function typeWriter() {
        const phrases = [
            "Étudiant en BTS SIO SISR",
            "Technicien informatique",
            "Passionné d'informatique",
            "Spécialiste réseaux et systèmes"
        ];
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                // Effacement
                typedText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 30;
            } else {
                // Écriture
                typedText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = Math.random() * 50 + 100;
            }
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                // Fin de l'écriture
                isDeleting = true;
                typingSpeed = 1500;
            } else if (isDeleting && charIndex === 0) {
                // Fin de l'effacement
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500;
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Démarrer l'effet
        setTimeout(type, 1000);
    }
    
    // Toggle entre mode clair et sombre
    function toggleTheme() {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    }
    
    // Gérer la soumission du formulaire
    function handleContactSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Afficher l'état de chargement
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simuler l'envoi (en conditions réelles, vous utiliseriez fetch ou XMLHttpRequest)
        setTimeout(() => {
            // Afficher le succès
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé';
            submitBtn.classList.add('btn-success');
            
            // Réinitialiser le formulaire
            this.reset();
            
            // Restaurer le bouton après un délai
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.classList.remove('btn-success');
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    }
    
// Charger les bulletins CERT-FR
    function loadCertFeed() {
        // Données actualisées pour 2025
        const bulletins = [
            {
                date: "15/03/2025",
                title: "Vulnérabilité critique dans l'écosystème OpenSSL",
                description: "Une faille de sécurité majeure découverte dans OpenSSL permet potentiellement des attaques de type man-in-the-middle et d'exécution de code à distance.",
                severity: "critique",
                reference: "CERTFR-2025-AVI-0042",
                link: "https://www.cert.ssi.gouv.fr/avis/CERTFR-2025-AVI-0042/"
            },
            {
                date: "22/02/2025",
                title: "Faille de sécurité dans les systèmes cloud Azure",
                description: "Microsoft Azure a identifié une vulnérabilité permettant une escalade de privilèges dans certains services cloud, nécessitant une mise à jour immédiate.",
                severity: "élevée",
                reference: "CERTFR-2025-AVI-0035",
                link: "https://www.cert.ssi.gouv.fr/avis/CERTFR-2025-AVI-0035/"
            },
            {
                date: "10/01/2025",
                title: "Risques de sécurité dans les frameworks JavaScript",
                description: "Plusieurs frameworks JavaScript populaires présentent des vulnérabilités potentielles d'injection de code et de contournement de sécurité.",
                severity: "moyenne",
                reference: "CERTFR-2025-AVI-0012",
                link: "https://www.cert.ssi.gouv.fr/avis/CERTFR-2025-AVI-0012/"
            },
            {
                date: "05/04/2025",
                title: "Vulnérabilité dans les systèmes de gestion de contenu WordPress",
                description: "Une faille de sécurité critique affectant plusieurs versions de WordPress permet une injection de code malveillant et une potentielle prise de contrôle à distance.",
                severity: "critique",
                reference: "CERTFR-2025-AVI-0056",
                link: "https://www.cert.ssi.gouv.fr/avis/CERTFR-2025-AVI-0056/"
            },
            {
                date: "18/02/2025",
                title: "Vulnérabilités dans l'infrastructure réseau Cisco",
                description: "Plusieurs vulnérabilités critiques découvertes dans les routeurs et switchs Cisco pouvant permettre des attaques par déni de service et contournement de sécurité.",
                severity: "élevée",
                reference: "CERTFR-2025-AVI-0028",
                link: "https://www.cert.ssi.gouv.fr/avis/CERTFR-2025-AVI-0028/"
            }
        ];
        
        // Vider le conteneur
        certFeed.innerHTML = '';
        
        // Ajouter chaque bulletin
        bulletins.forEach((bulletin, index) => {
            const item = document.createElement('div');
            item.className = 'cert-item fade-in';
            item.dataset.delay = index * 100;
            
            item.innerHTML = `
                <div class="cert-header">
                    <span class="cert-date">${bulletin.date}</span>
                    <span class="cert-severity severity-${bulletin.severity}">${getSeverityText(bulletin.severity)}</span>
                </div>
                <h4>${bulletin.title}</h4>
                <p>${bulletin.description}</p>
                <div class="cert-footer">
                    <span>${bulletin.reference}</span>
                    <a href="${bulletin.link}" target="_blank">
                        Voir le bulletin <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            `;
            
            certFeed.appendChild(item);
        });
        
        // Déclencher l'animation
        setTimeout(() => {
            document.querySelectorAll('.cert-item').forEach(item => {
                item.classList.add('visible');
            });
        }, 300);
    }
    
    // Obtenir le texte de sévérité en français
    function getSeverityText(severity) {
        const severityMap = {
            'critique': 'Critique',
            'élevée': 'Élevée',
            'moyenne': 'Moyenne',
            'faible': 'Faible'
        };
        
        return severityMap[severity] || 'Inconnue';
    }
	document.addEventListener('DOMContentLoaded', function() {
    "use strict";
    
    // ... (tout le code existant reste ici)

    // Code précédent de gestion du formulaire (à remplacer ou compléter)
    function handleContactSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Afficher l'état de chargement
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simuler l'envoi (en conditions réelles, vous utiliseriez fetch ou XMLHttpRequest)
        setTimeout(() => {
            // Afficher le succès
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message envoyé';
            submitBtn.classList.add('btn-success');
            
            // Réinitialiser le formulaire
            this.reset();
            
            // Restaurer le bouton après un délai
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.classList.remove('btn-success');
                submitBtn.disabled = false;
            }, 3000);
        }, 1500);
    }

    // NOUVEAU CODE DE GESTION DE FORMULAIRE À AJOUTER ICI
    // Gestion avancée du formulaire de contact
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    // Vérification de base des champs du formulaire
    function validateForm() {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        let isValid = true;

        // Réinitialiser les messages d'erreur
        formMessage.textContent = '';
        formMessage.classList.remove('error', 'success');

        // Validation du nom
        if (name.value.trim().length < 2) {
            displayError('Veuillez entrer un nom valide');
            isValid = false;
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            displayError('Veuillez entrer une adresse email valide');
            isValid = false;
        }

        // Validation du sujet
        if (subject.value.trim().length < 3) {
            displayError('Le sujet doit contenir au moins 3 caractères');
            isValid = false;
        }

        // Validation du message
        if (message.value.trim().length < 10) {
            displayError('Le message doit contenir au moins 10 caractères');
            isValid = false;
        }

        return isValid;
    }

    // Afficher les messages d'erreur
    function displayError(message) {
        formMessage.textContent = message;
        formMessage.classList.add('error');
    }

    // Vérifier si le formulaire existe avant d'ajouter les écouteurs
    if (contactForm) {
        // Gestion de la soumission du formulaire
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Vérifier la validité du formulaire
            if (!validateForm()) {
                return;
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Désactiver le bouton et afficher l'état de chargement
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            formMessage.textContent = '';
            formMessage.classList.remove('error', 'success');

            // Utiliser un service de formulaire comme Formspree
            fetch("https://formspree.io/f/votre_identifiant_formspree", {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Succès
                    formMessage.textContent = 'Votre message a été envoyé avec succès !';
                    formMessage.classList.add('success');
                    contactForm.reset();
                    
                    // Réinitialiser le bouton
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    // Erreur
                    response.json().then(data => {
                        let errorMessage = 'Une erreur est survenue lors de l\'envoi du message.';
                        if (data.errors) {
                            errorMessage = data.errors.map(error => error.message).join(', ');
                        }
                        formMessage.textContent = errorMessage;
                        formMessage.classList.add('error');
                        
                        // Réactiver le bouton
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    });
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                formMessage.textContent = 'Impossible d\'envoyer le message. Veuillez réessayer.';
                formMessage.classList.add('error');
                
                // Réactiver le bouton
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });

        // Ajouter des écouteurs d'événements pour la validation en temps réel
        const formFields = contactForm.querySelectorAll('input, textarea');
        formFields.forEach(field => {
            field.addEventListener('blur', validateForm);
        });
    }
});
});