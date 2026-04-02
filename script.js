document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Titan Script Initialized...");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll('.page').forEach(section => section.classList.add('section-shell'));

    function initTypewriter() {
        const target = document.getElementById('heroTypewriter');
        if (!target || target.dataset.started === 'true') return;

        const words = ['Finance', 'Agriculture', 'Healthcare', 'Education'];
        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        target.dataset.started = 'true';
        if (prefersReducedMotion) {
            target.textContent = words.join(' • ');
            return;
        }

        const tick = () => {
            const word = words[wordIndex];
            if (!deleting) {
                charIndex += 1;
                target.textContent = word.slice(0, charIndex);
                if (charIndex === word.length) {
                    deleting = true;
                    setTimeout(tick, 1100);
                    return;
                }
            } else {
                charIndex -= 1;
                target.textContent = word.slice(0, charIndex);
                if (charIndex === 0) {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                }
            }
            setTimeout(tick, deleting ? 55 : 85);
        };

        tick();
    }

    function animateCounters() {
        document.querySelectorAll('[data-count-target]').forEach(el => {
            if (el.dataset.countDone === 'true') return;
            const target = Number(el.dataset.countTarget || '0');
            const finalDisplay = el.dataset.countDisplay || String(target);
            if (!Number.isFinite(target)) return;

            if (prefersReducedMotion) {
                el.textContent = finalDisplay;
                el.dataset.countDone = 'true';
                return;
            }

            const start = performance.now();
            const duration = 1100;
            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(target * eased);
                el.textContent = String(current);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = finalDisplay;
                    el.dataset.countDone = 'true';
                }
            };

            requestAnimationFrame(step);
        });
    }

    function initRevealObserver() {
        const revealNodes = document.querySelectorAll('.service-card, .team-card, .industry-card, #about h2, #services h2, #industries h2, #contact h2');
        revealNodes.forEach((node, index) => {
            node.setAttribute('data-reveal', '');
            node.style.setProperty('--reveal-order', String(index % 6));
        });

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            revealNodes.forEach(node => node.classList.add('revealed'));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            });
        }, { threshold: 0.12 });

        revealNodes.forEach(node => observer.observe(node));
    }

    /* ================== HAMBURGER MENU LOGIC ================== */
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = mobileMenu.classList.toggle("is-open");
            mobileMenu.setAttribute("aria-hidden", !isOpen);
            hamburger.setAttribute("aria-expanded", isOpen);
            this.querySelector('span').innerText = isOpen ? "✕" : "☰";
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                mobileMenu.classList.remove("is-open");
                mobileMenu.setAttribute("aria-hidden", "true");
                hamburger.setAttribute("aria-expanded", "false");
                hamburger.querySelector('span').innerText = "☰";
            });
        });

        // Close menu if user clicks outside of it
        document.addEventListener("click", function (e) {
            if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
                if (mobileMenu.classList.contains("is-open")) {
                    mobileMenu.classList.remove("is-open");
                    mobileMenu.setAttribute("aria-hidden", "true");
                    hamburger.setAttribute("aria-expanded", "false");
                    hamburger.querySelector('span').innerText = "☰";
                }
            }
        });
    }

    /* ================== SERVICES ACCORDION ================== */
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        const toggle = card.querySelector('.toggle-open');
        const body = card.querySelector('.card-body');
        const closeBtn = card.querySelector('.close-card');

        if (toggle && body) {
            toggle.addEventListener('click', () => {
                const isOpen = card.classList.contains("open");
                // Close all others first
                serviceCards.forEach(c => {
                    c.classList.remove("open");
                    const cardBody = c.querySelector('.card-body');
                    if (cardBody) cardBody.classList.remove("open");
                });
                // Open this one if it wasn't open
                if (!isOpen) {
                    card.classList.add("open");
                    body.classList.add("open");
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                card.classList.remove("open");
                body.classList.remove("open");
            });
        }
    });

    /* ================== FORM VALIDATION & FEEDBACK ================== */
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    function openEmailFallback({ fullName, email, company, projectType, projectDetails }) {
        const recipient = 'techtitans194@gmail.com';
        const subject = `Project Inquiry - ${projectType || 'General'}`;
        const body = [
            'New inquiry from Tech Titans website',
            '',
            `Full Name: ${fullName || ''}`,
            `Contact Email: ${email || ''}`,
            `Company / Organization: ${company || 'Not provided'}`,
            `Project Type: ${projectType || ''}`,
            '',
            'Project Details:',
            projectDetails || ''
        ].join('\n');

        const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
    }

    if (contactForm) {
        const emailJsPublicKey = (contactForm.dataset.emailjsPublicKey || '').trim();
        const emailJsServiceId = (contactForm.dataset.emailjsServiceId || '').trim();
        const emailJsTemplateId = (contactForm.dataset.emailjsTemplateId || '').trim();

        if (window.emailjs && emailJsPublicKey && !emailJsPublicKey.includes('YOUR_EMAILJS_')) {
            window.emailjs.init({ publicKey: emailJsPublicKey });
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate required fields
            const fullName = contactForm.querySelector('input[name="full_name"]');
            const email = contactForm.querySelector('input[name="email"]');
            const company = contactForm.querySelector('input[name="company"]');
            const projectType = contactForm.querySelector('select[name="project_type"]');
            const projectDetails = contactForm.querySelector('textarea[name="project_details"]');

            if (!fullName.value || !email.value || !projectType.value || !projectDetails.value) {
                showFormMessage('Please fill in all required fields', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }

            // Disable button and show loading state
            submitBtn.disabled = true;
            document.getElementById('btnText').classList.add('hidden');
            document.getElementById('btnLoader').classList.remove('hidden');

            try {
                if (!window.emailjs) {
                    showFormMessage('Email service is not available. Opening your email app as fallback.', 'error');
                    openEmailFallback({
                        fullName: fullName.value,
                        email: email.value,
                        company: company.value,
                        projectType: projectType.value,
                        projectDetails: projectDetails.value
                    });
                    return;
                }

                if (!emailJsPublicKey || !emailJsServiceId || !emailJsTemplateId ||
                    emailJsPublicKey.includes('YOUR_EMAILJS_') ||
                    emailJsServiceId.includes('YOUR_EMAILJS_') ||
                    emailJsTemplateId.includes('YOUR_EMAILJS_')) {
                    showFormMessage('EmailJS is not configured yet. Opening your email app as fallback.', 'error');
                    openEmailFallback({
                        fullName: fullName.value,
                        email: email.value,
                        company: company.value,
                        projectType: projectType.value,
                        projectDetails: projectDetails.value
                    });
                    return;
                }

                const templateParams = {
                    from_name: fullName.value,
                    from_email: email.value,
                    company: company.value || 'Not provided',
                    project_type: projectType.value,
                    message: projectDetails.value,
                    to_email: 'techtitans194@gmail.com'
                };

                await window.emailjs.send(emailJsServiceId, emailJsTemplateId, templateParams);

                showFormMessage('✓ Your proposal has been received — we\'ll respond within 48 hours', 'success');
                contactForm.reset();
                projectType.value = '';
            } catch (error) {
                showFormMessage('Unable to send automatically. Opening your email app as fallback.', 'error');
                console.error('Form submission error:', error);
                openEmailFallback({
                    fullName: fullName.value,
                    email: email.value,
                    company: company.value,
                    projectType: projectType.value,
                    projectDetails: projectDetails.value
                });
            } finally {
                // Re-enable button
                submitBtn.disabled = false;
                document.getElementById('btnText').classList.remove('hidden');
                document.getElementById('btnLoader').classList.add('hidden');
            }
        });
    }

    function showFormMessage(message, type) {
        if (!formMessage) return;
        
        formMessage.textContent = message;
        formMessage.classList.remove('hidden');
        formMessage.className = `${formMessage.className} p-4 rounded-xl text-center font-semibold transition-all`;
        
        if (type === 'success') {
            formMessage.style.background = 'rgba(30, 213, 255, 0.1)';
            formMessage.style.color = '#1ed5ff';
            formMessage.style.borderLeft = '4px solid #1ed5ff';
        } else {
            formMessage.style.background = 'rgba(239, 68, 68, 0.1)';
            formMessage.style.color = '#ef4444';
            formMessage.style.borderLeft = '4px solid #ef4444';
        }

        // Auto-hide after 6 seconds
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 6000);
    }

    /* ================== INDUSTRIES INLINE ================== */
    (function () {
        const industryCards = document.querySelectorAll('.industry-card');
        const modal = document.getElementById('industryModal');
        const modalBody = document.getElementById('industryModalBody');
        const modalTitle = document.getElementById('industryModalTitle');
        const modalClose = document.getElementById('industryModalClose');
        const modalDismiss = document.getElementById('industryModalDismiss');
        const modalContact = document.getElementById('industryModalContact');

        const industryData = {
            fintech: {
                problem: "Low financial inclusion, high fraud rates and fragmented payment systems.",
                solutions: [
                    "AI credit scoring using mobile money data",
                    "Real-time fraud detection for digital payments",
                    "Unified payment gateways combining multiple payment methods"
                ],
                impact: "Reduce fraud losses by up to 35% using ML-powered transaction scoring."
            },
            agriculture: {
                problem: "Low yields, weak market access and lack of real-time farm intelligence.",
                solutions: [
                    "Precision farming platforms using satellite & sensor data",
                    "Mobile apps connecting farmers directly to buyers",
                    "Crop disease detection using phone cameras + AI"
                ],
                impact: "Increase crop yields 20-30% and reduce post-harvest losses."
            },
            education: {
                problem: "Limited access to personalised learning and outdated school admin.",
                solutions: [
                    "Adaptive learning platforms tailored to each student",
                    "Mobile-first apps for practical & vocational skills",
                    "School management systems for admin automation"
                ],
                impact: "Improve student pass rates by 25% and reduce admin workload by 40%."
            },
            healthcare: {
                problem: "Limited access to medical expertise, poor diagnostic capacity and medication shortages.",
                solutions: [
                    "Telemedicine platforms for remote consultations",
                    "AI diagnostic tools for medical imaging",
                    "Drug inventory tracking systems for clinics"
                ],
                impact: "Enable rural clinics to reach specialists and reduce diagnostic delays by 60%."
            },
            manufacturing: {
                problem: "Unplanned downtime, slow production and poor supply chain visibility.",
                solutions: [
                    "Production monitoring systems using IoT sensors",
                    "Predictive maintenance tools for factory equipment",
                    "Supply chain tracking platforms from factory to customer"
                ],
                impact: "Reduce unplanned downtime by 45% and improve production output by 35%."
            }
        };

        function closeIndustryModal() {
            if (!modal) return;
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
        }

        function openIndustryModal(key) {
            if (!modal || !modalBody || !modalTitle) return;
            const info = industryData[key];
            if (!info) return;

            modalTitle.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            modalBody.innerHTML = `
                <p class="leading-relaxed"><strong class="text-[var(--cyan)]">Problem:</strong> ${info.problem}</p>
                <div>
                    <p class="mb-2 font-semibold text-white"><strong class="text-[var(--cyan)]">Solutions:</strong></p>
                    <ul class="list-disc pl-6 space-y-2 text-slate-300">
                        ${info.solutions.map(s => `<li class="leading-relaxed">${s}</li>`).join('')}
                    </ul>
                </div>
                <p class="leading-relaxed"><strong class="text-[var(--cyan)]">Impact:</strong> ${info.impact}</p>
            `;

            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
        }

        industryCards.forEach(card => {
            const key = card.dataset.key;
            if (!key) return;

            card.addEventListener('click', (e) => {
                e.preventDefault();
                openIndustryModal(key);
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openIndustryModal(key);
                }
            });
        });

        if (modalClose) modalClose.addEventListener('click', closeIndustryModal);
        if (modalDismiss) modalDismiss.addEventListener('click', closeIndustryModal);

        if (modalContact) {
            modalContact.addEventListener('click', () => {
                closeIndustryModal();
                const contactBtn = document.querySelector('[data-target="contact"]');
                if (contactBtn) contactBtn.click();
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeIndustryModal();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeIndustryModal();
        });
    })();

    /* ================== PAGE NAVIGATION ================== */
    function setActiveNav(pageId) {
        document.querySelectorAll('.nav-link').forEach(btn => {
            const isActive = btn.getAttribute('data-target') === pageId;
            btn.classList.toggle('is-active', isActive);
        });
    }

    function showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        setActiveNav(pageId);
        if (pageId === 'home') animateCounters();

        if (mobileMenu) {
            mobileMenu.classList.remove('is-open');
            mobileMenu.setAttribute("aria-hidden", "true");
            if (hamburger) {
                hamburger.setAttribute("aria-expanded", "false");
                hamburger.querySelector('span').innerText = "☰";
            }
        }
    }

    document.querySelectorAll('[data-target]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const target = button.getAttribute('data-target');
            showPage(target);
        });
    });

    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });

        const toggleBackToTop = () => {
            backToTop.classList.toggle('show', window.scrollY > 360);
        };

        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        toggleBackToTop();
    }

    initTypewriter();
    initRevealObserver();
    setActiveNav('home');
    animateCounters();

    console.log("✓ All titan systems online");
});
