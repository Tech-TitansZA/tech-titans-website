document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Titan Script Initialized...");

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

        function closeAllInline() {
            document.querySelectorAll('.inline-body').forEach(body => {
                body.classList.remove("open");
                body.setAttribute("aria-hidden", "true");
            });
        }

        industryCards.forEach(card => {
            const key = card.dataset.key;
            const inline = card.querySelector('.inline-body');
            if (!key || !inline) return;

            card.addEventListener('click', (e) => {
                if (e.target.closest('.inline-body') && !e.target.classList.contains('inline-close')) return;

                const isOpen = inline.classList.contains("open");

                if (isOpen) {
                    inline.classList.remove("open");
                    inline.setAttribute("aria-hidden", "true");
                    return;
                }

                const info = industryData[key];
                if (!info) return;

                inline.innerHTML = `
                    <div class="space-y-5 py-6 border-t border-white/10 mt-4 animate-fadeIn">
                        <p class="text-white leading-relaxed"><strong class="text-[var(--cyan)] font-bold">Problem:</strong> ${info.problem}</p>
                        <div>
                            <p class="text-white mb-3 font-semibold"><strong class="text-[var(--cyan)]">Solutions:</strong></p>
                            <ul class="list-disc pl-6 space-y-2 text-slate-300">
                                ${info.solutions.map(s => `<li class="leading-relaxed">${s}</li>`).join('')}
                            </ul>
                        </div>
                        <p class="text-white leading-relaxed"><strong class="text-[var(--cyan)] font-bold">Impact:</strong> ${info.impact}</p>
                        <div class="flex flex-wrap gap-4 pt-4">
                            <button class="inline-contact px-6 py-3 bg-gradient-to-r from-[var(--cyan)] to-[var(--blue)] text-white font-bold rounded-xl transition-all transform hover:-translate-y-1 shadow-lg\">Request Proposal</button>\n                            <button class="inline-close px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all\">Close</button>\n                        </div>\n                    </div>\n                `;

                closeAllInline();
                inline.classList.add("open");
                inline.setAttribute("aria-hidden", "false");

                inline.querySelector(".inline-contact").addEventListener("click", (e) => {
                    e.stopPropagation();
                    const contactBtn = document.querySelector('[data-target="contact"]');
                    if (contactBtn) contactBtn.click();
                });

                inline.querySelector(".inline-close").addEventListener("click", (e) => {
                    e.stopPropagation();
                    inline.classList.remove("open");
                });
            });
        });
    })();

    /* ================== PAGE NAVIGATION ================== */
    function showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

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

    console.log("✓ All titan systems online");
});
