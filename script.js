document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 Titan Script Initialized...");

    /* ================== NUCLEAR NAV LOGIC ================== */
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileLinks = document.querySelectorAll(".mobile-link");

    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", function (e) {
            e.stopPropagation(); // Prevents the 'document click' from firing
            
            const isOpen = mobileMenu.classList.toggle("is-open");
            
            // Update the icon
            this.querySelector('span').innerText = isOpen ? "✕" : "☰";
            
            console.log("Menu state:", isOpen ? "OPEN" : "CLOSED");
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("is-open");
                hamburger.querySelector('span').innerText = "☰";
            });
        });

        // Close menu if user clicks outside of it
     hamburger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const isOpen = mobileMenu.classList.toggle("is-open");

    this.querySelector('span').innerText = isOpen ? "✕" : "☰";
});
    }
});

    /* ================== 2. SERVICES ACCORDION ================== */
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
                    c.querySelector('.card-body').classList.remove("open");
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

 /* ================== INDUSTRIES INLINE (TITAN VERSION) ================== */
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
            impact: "Safer transactions, better credit access, and streamlined payments across Africa."
        },
        agriculture: {
            problem: "Low yields, weak market access and lack of real-time farm intelligence.",
            solutions: [
                "Precision farming platforms using satellite & sensor data",
                "Mobile apps connecting farmers directly to buyers",
                "Crop disease detection using phone cameras + AI"
            ],
            impact: "Higher yields, reduced losses, and direct market access for farmers."
        },
        education: {
            problem: "Limited access to personalised learning and outdated school admin.",
            solutions: [
                "Adaptive learning platforms tailored to each student",
                "Mobile-first apps for practical & vocational skills",
                "School management systems for admin automation"
            ],
            impact: "Better learning outcomes and reduced admin load for schools."
        },
        healthcare: {
            problem: "Limited access to medical expertise, poor diagnostic capacity and medication shortages.",
            solutions: [
                "Telemedicine platforms for remote consultations",
                "AI diagnostic tools for medical imaging",
                "Drug inventory tracking systems for clinics"
            ],
            impact: "Earlier diagnosis, wider access to care, and reduced stock-outs."
        },
        manufacturing: {
            problem: "Unplanned downtime, slow production and poor supply chain visibility.",
            solutions: [
                "Production monitoring systems using IoT sensors",
                "Predictive maintenance tools for factory equipment",
                "Supply chain tracking platforms from factory to customer"
            ],
            impact: "Higher output, fewer breakdowns, and full supply chain transparency."
        }
    };

    function closeAllInline() {
        document.querySelectorAll('.inline-body').forEach(body => {
            body.classList.remove("open");
            body.setAttribute("aria-hidden", "true");
            body.style.maxHeight = null; // Reset height
        });
    }

    industryCards.forEach(card => {
        const key = card.dataset.key;
        const inline = card.querySelector('.inline-body');
        if (!key || !inline) return;

        card.addEventListener('click', (e) => {
            // If clicking a button inside the expanded area, don't trigger the toggle
            if (e.target.closest('.inline-body') && !e.target.classList.contains('inline-close')) return;

            const isOpen = inline.classList.contains("open");

            if (isOpen) {
                inline.classList.remove("open");
                inline.setAttribute("aria-hidden", "true");
                return;
            }

            const info = industryData[key];
            if (!info) return;

            // Build the HTML with high-quality formatting
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
                        <button class="inline-contact px-6 py-3 bg-gradient-to-r from-[var(--cyan)] to-[var(--blue)] text-white font-bold rounded-xl transition-all transform hover:-translate-y-1 shadow-lg">Request Proposal</button>
                        <button class="inline-close px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all">Close</button>
                    </div>
                </div>
            `;

            closeAllInline();
            inline.classList.add("open");
            inline.setAttribute("aria-hidden", "false");

            // Attach listener to the NEWLY created Contact button
            inline.querySelector(".inline-contact").addEventListener("click", (e) => {
                e.stopPropagation();
                const contactBtn = document.querySelector('.nav-btn[data-target="contact"]');
                if (contactBtn) contactBtn.click();
            });

            // Attach listener to the NEWLY created Close button
            inline.querySelector(".inline-close").addEventListener("click", (e) => {
                e.stopPropagation();
                inline.classList.remove("open");
            });
        });
    });
})();
});