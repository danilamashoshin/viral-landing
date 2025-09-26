// DOM Elements
const header = document.getElementById('header');
const miniCTA = document.getElementById('mini-cta');
const progressBar = document.getElementById('progress-bar');
const stickyBuy = document.getElementById('sticky-buy');
const exitPopup = document.getElementById('exit-popup');
const closePopup = document.getElementById('close-popup');
const socialProof = document.getElementById('social-proof');
const timer = document.getElementById('timer');

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена, Facebook Pixel готов к работе');
});

// Social Proof Names
const notifications = [
    "Emma from Los Angeles",
    "Michael from New York", 
    "Sophie from London",
    "David from Toronto",
    "Maria from Barcelona",
    "Alex from Sydney",
    "Lisa from Berlin",
    "John from Paris",
    "Sarah from Dubai",
    "Tom from Singapore"
];

// Countdown Timer
function initCountdown() {
    // Get saved time or set new 48-hour countdown
    let endTime = localStorage.getItem('countdownEnd');
    
    if (!endTime || new Date(endTime) < new Date()) {
        // Set new 48-hour countdown
        const now = new Date();
        now.setHours(now.getHours() + 48);
        endTime = now.toISOString();
        localStorage.setItem('countdownEnd', endTime);
    }
    
    function updateTimer() {
        const now = new Date().getTime();
        const end = new Date(endTime).getTime();
        const distance = end - now;
        
        if (distance < 0) {
            timer.textContent = "00:00:00";
            return;
        }
        
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Scroll Effects
let lastScroll = 0;
function handleScroll() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Header scroll effect
    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Progress bar
    const scrollPercentage = (scrollY / (documentHeight - windowHeight)) * 100;
    progressBar.style.width = `${scrollPercentage}%`;
    
    // Sticky buy button (mobile)
    if (window.innerWidth <= 768) {
        if (scrollY > windowHeight * 0.5) {
            stickyBuy.classList.add('show');
        } else {
            stickyBuy.classList.remove('show');
        }
    }
    
    lastScroll = scrollY;
}

// Social Proof Notifications
function showSocialProof() {
    const randomName = notifications[Math.floor(Math.random() * notifications.length)];
    const messages = [
        `${randomName} just enrolled in the course!`,
        `${randomName} started creating their first animation!`,
        `${randomName} just joined the community!`,
        `${randomName} is learning viral animation secrets!`
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const notificationText = socialProof.querySelector('.notification-text');
    
    notificationText.textContent = randomMessage;
    socialProof.classList.add('show');
    
    setTimeout(() => {
        socialProof.classList.remove('show');
    }, 5000);
}

// Exit Intent Popup (Desktop only)
let exitIntentShown = false;
function handleExitIntent(e) {
    if (window.innerWidth <= 768 || exitIntentShown) return;
    
    if (e.clientY <= 0) {
        exitPopup.classList.add('show');
        exitIntentShown = true;
    }
}


// Функция для открытия Lemon Squeezy в модальном окне
function openLemonModal(url) {
    console.log('Открываем Lemon Squeezy модалку:', url);
    
    // Отслеживаем начало оформления заказа
    if (window.fbq) {
        console.log('Отправляем InitiateCheckout');
        fbq('track', 'InitiateCheckout', {
            content_name: 'Course Purchase',
            content_category: 'Course',
            currency: 'USD'
        });
    }
    
    const modal = document.getElementById('lemonModal');
    const iframeContainer = document.getElementById('lemonIframeContainer');
    
    // Создаем iframe
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.setAttribute('allow', 'payment');
    
    // Отслеживаем загрузку iframe
    iframe.onload = function() {
        console.log('Lemon Squeezy iframe загружен');
        
        // Отправляем событие ЗаполненнаяФорма через 15 секунд после открытия модалки
        setTimeout(() => {
            if (window.fbq) {
                console.log('Отправляем событие ЗаполненнаяФорма через 15 секунд');
                fbq('trackCustom', 'ЗаполненнаяФорма', {
                    content_name: 'Checkout Form',
                    content_category: 'Course',
                    currency: 'USD'
                });
            }
        }, 15000); // 15 секунд
    };
    
    // Очищаем контейнер и добавляем iframe
    iframeContainer.innerHTML = '';
    iframeContainer.appendChild(iframe);
    
    // Показываем модальное окно
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Функция для закрытия модального окна Lemon Squeezy
function closeLemonModal() {
    const modal = document.getElementById('lemonModal');
    const iframeContainer = document.getElementById('lemonIframeContainer');
    
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Очищаем iframe через небольшую задержку
    setTimeout(() => {
        iframeContainer.innerHTML = '';
    }, 300);
}

// Initialize all CTA buttons
function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const location = button.dataset.location;
            const text = button.innerText;
            
            // Google Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click_cta', {
                    'button_text': text,
                    'button_location': location
                });
            }
            
            // Проверяем, находится ли кнопка в блоке тарифов
            if (location === 'pricing-starter' || location === 'pricing-pro') {
                // Кнопки в блоке тарифов открывают Lemon Squeezy в модальном окне
                let redirectUrl = '';
                
                if (location === 'pricing-pro') {
                    // Pro пакет за $39
                    redirectUrl = 'https://animator-procrastinator.lemonsqueezy.com/buy/13921c85-fec7-4d04-8049-0535a25734b2';
                } else {
                    // Starter пакет за $19
                    redirectUrl = 'https://animator-procrastinator.lemonsqueezy.com/buy/8627eb62-1495-4c9d-9f16-12ffe4e27ae8';
                }
                
                // Отправляем лид в Google Sheets (не блокируя UX)
                const leadData = {
                    fullName: '',
                    email: '',
                    country: (userLocation && userLocation.countryName) ? userLocation.countryName : '',
                    phone: '',
                    package: location === 'pricing-pro' ? 'PRO' : 'STARTER',
                    price: location === 'pricing-pro' ? '39' : '19',
                    userAgent: navigator.userAgent,
                    referrer: document.referrer
                };
                try { sendToGoogleSheets(leadData); } catch (_) {}

                // Кинем клиентские события Meta Pixel для лида (на всякий) 
                try {
                    if (typeof fbq === 'function') {
                        fbq('track', 'Lead', {
                            content_name: leadData.package,
                            value: leadData.price ? Number(leadData.price) : undefined,
                            currency: 'USD'
                        });
                        fbq('trackCustom', 'ЗаполненнаяЗаявка', {
                            content_name: leadData.package,
                            value: leadData.price ? Number(leadData.price) : undefined,
                            currency: 'USD'
                        });
                    }
                } catch (_) {}

                // Отправим лид на сервер для CAPI
                try {
                    fetch('/events/lead', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            package: leadData.package,
                            value: leadData.price,
                            currency: 'USD'
                        })
                    }).catch(() => {});
                } catch (_) {}

                // Meta Pixel: InitiateCheckout before открываем оплату
                try {
                    if (typeof fbq === 'function') {
                        fbq('track', 'InitiateCheckout', {
                            currency: 'USD',
                            value: location === 'pricing-pro' ? 39 : 19,
                            content_name: location === 'pricing-pro' ? 'PRO' : 'STARTER',
                            content_type: 'product'
                        });
                    }
                } catch (_) {}

                // Открываем в модальном окне
                openLemonModal(redirectUrl);
            } else {
                // Все остальные кнопки: фиксируем клик как лид и ведем на блок тарифов
                const genericLead = {
                    fullName: '',
                    email: '',
                    country: (userLocation && userLocation.countryName) ? userLocation.countryName : '',
                    phone: '',
                    package: 'CTA_CLICK',
                    price: '',
                    userAgent: navigator.userAgent,
                    referrer: document.referrer,
                    button_text: text,
                    button_location: location || 'unknown'
                };
                try { sendToGoogleSheets(genericLead); } catch (_) {}

                // Ведем пользователя к тарифам
                const pricingSection = document.getElementById('pricing');
                if (pricingSection) {
                    pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    
    // Mini CTA in header - ведет на блок тарифов
    if (miniCTA) {
        miniCTA.addEventListener('click', (e) => {
            e.preventDefault();
            const pricingSection = document.getElementById('pricing');
            if (pricingSection) {
                pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // Закрытие модального окна Lemon Squeezy
    const closeLemonBtn = document.getElementById('closeLemonModal');
    if (closeLemonBtn) {
        closeLemonBtn.addEventListener('click', closeLemonModal);
    }
    
    // Закрытие при клике вне окна
    const lemonModal = document.getElementById('lemonModal');
    if (lemonModal) {
        lemonModal.addEventListener('click', (e) => {
            if (e.target === lemonModal) {
                closeLemonModal();
            }
        });
    }
}

// Close popup
closePopup.addEventListener('click', () => {
    exitPopup.classList.remove('show');
});

exitPopup.addEventListener('click', (e) => {
    if (e.target === exitPopup) {
        exitPopup.classList.remove('show');
    }
});

// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.module, .audience-card, .testimonial-card, .stat');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Count Up Animation
function animateCountUp() {
    const counters = document.querySelectorAll('.count-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.dataset.target);
                const duration = 2000;
                const start = 0;
                const increment = target / (duration / 16);
                
                let current = start;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    
                    if (target % 1 !== 0) {
                        counter.textContent = current.toFixed(1);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, 16);
                
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Draw Growth Chart
function drawGrowthChart() {
    const canvas = document.getElementById('growth-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw growth line
    ctx.beginPath();
    ctx.strokeStyle = '#FCD34D';
    ctx.lineWidth = 3;
    
    // Create upward trend line
    ctx.moveTo(10, height - 10);
    ctx.quadraticCurveTo(width / 2, height / 3, width - 10, 10);
    ctx.stroke();
    
    // Add glow effect
    ctx.shadowColor = '#FCD34D';
    ctx.shadowBlur = 10;
    ctx.stroke();
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initCTAButtons();
    animateOnScroll();
    animateCountUp();
    drawGrowthChart();
    initFAQ();
    initStickyVideo();
    initUrgencyUpdates();
    initHeroVideo();
    initFloatingElements();
    initLiveNotifications();
    initParallax();
    initMagneticButtons();
    initGlobalImpact();
    initPaymentForm();
    // Определяем страну пользователя заранее для лидов
    detectCountryByIP().then((loc) => { userLocation = loc; }).catch(() => {});
    
    // Start social proof notifications after 10 seconds
    setTimeout(() => {
        showSocialProof();
        // Show every 15-30 seconds
        setInterval(() => {
            showSocialProof();
        }, Math.random() * 15000 + 15000);
    }, 10000);
});

// FAQ Accordion
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-question');
    
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const faqItem = item.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // Open clicked
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// Sticky Video Preview
function initStickyVideo() {
    const stickyVideo = document.getElementById('sticky-video');
    const closeBtn = document.getElementById('close-sticky-video');
    const stickyOverlay = document.querySelector('.sticky-video-overlay');
    let hasShown = false;
    
    window.addEventListener('scroll', () => {
        if (!hasShown && window.scrollY > window.innerHeight * 1.5) {
            stickyVideo.classList.add('show');
            hasShown = true;
        }
    });
    
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stickyVideo.classList.remove('show');
    });
    
    if (stickyOverlay) {
        stickyOverlay.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Сначала скроллим к hero секции
            const heroSection = document.querySelector('.hero');
            heroSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Затем открываем модальное окно через 500мс
            setTimeout(() => {
                const videoModal = document.getElementById('hero-video-modal');
                const videoContainer = document.getElementById('hero-video-container');
                
                if (videoModal && videoContainer) {
                    videoModal.classList.add('show');
                    const videoId = 'dGYMwTK7STI';
                    videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                }
            }, 500);
        });
    }
}

// Urgency Updates
function initUrgencyUpdates() {
    // Update spots left
    const spotsLeft = document.querySelector('.spots-left');
    const progressFill = document.querySelector('.progress-bar-fill');
    let currentSpots = 73;
    
    setInterval(() => {
        if (currentSpots > 10 && Math.random() > 0.7) {
            currentSpots--;
            spotsLeft.textContent = currentSpots;
            progressFill.style.width = `${100 - currentSpots}%`;
        }
    }, 30000);
    
    // Update viewers count
    const viewersCount = document.querySelector('.viewers-count');
    setInterval(() => {
        const viewers = Math.floor(Math.random() * 5) + 2;
        viewersCount.textContent = viewers;
    }, 45000);
    
    // Update last enrollment
    const lastEnrollment = document.querySelector('.last-enrollment');
    const enrollmentTimes = ['2 minutes ago', '5 minutes ago', '8 minutes ago', '12 minutes ago', '15 minutes ago'];
    let currentIndex = 3;
    
    setInterval(() => {
        currentIndex = (currentIndex - 1 + enrollmentTimes.length) % enrollmentTimes.length;
        lastEnrollment.textContent = enrollmentTimes[currentIndex];
    }, 60000);
}

// Event listeners
window.addEventListener('scroll', handleScroll);
document.addEventListener('mouseout', handleExitIntent);

// Handle video placeholders (for future implementation)
document.querySelectorAll('.work-item').forEach(item => {
    item.addEventListener('click', () => {
        const videoId = item.dataset.videoId;
        if (videoId) {
            // Future implementation: Open video modal
            console.log('Video ID:', videoId);
        }
    });
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Add parallax effect on desktop
if (window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-video-container');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        }
    });
});

// Apply lazy loading to all images with data-src
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Hero Video with Sound
function initHeroVideo() {
    const playButton = document.getElementById('play-button-large');
    const videoModal = document.getElementById('hero-video-modal');
    const videoContainer = document.getElementById('hero-video-container');
    const closeModal = document.getElementById('close-hero-modal');
    
    if (!playButton || !videoModal || !videoContainer) return;
    
    playButton.addEventListener('click', () => {
        // Open modal
        videoModal.classList.add('show');
        
        // Load video with sound
        const videoId = 'dGYMwTK7STI';
        videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    });
    
    closeModal.addEventListener('click', () => {
        videoModal.classList.remove('show');
        videoContainer.innerHTML = '';
    });
    
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            videoModal.classList.remove('show');
            videoContainer.innerHTML = '';
        }
    });
}

// Floating Elements
function initFloatingElements() {
    const floatingEmojis = ['🎬', '📱', '✨', '🚀', '💰', '🎯'];
    const heroSection = document.querySelector('.hero');
    
    if (!heroSection) return;
    
    floatingEmojis.forEach((emoji, index) => {
        const floatingEl = document.createElement('div');
        floatingEl.className = 'floating-emoji';
        floatingEl.textContent = emoji;
        floatingEl.style.left = `${Math.random() * 90 + 5}%`;
        floatingEl.style.top = `${Math.random() * 90 + 5}%`;
        floatingEl.style.animationDelay = `${index * 2}s`;
        floatingEl.style.animationDuration = `${20 + Math.random() * 10}s`;
        heroSection.appendChild(floatingEl);
    });
}

// Live Notifications
function initLiveNotifications() {
    const liveNotifications = [
        "🔥 Emma from LA just went viral - 2.3M views!",
        "💰 Michael landed a $2000 client!",
        "🎉 Sophie's first animation hit 500K!",
        "⚡ 3 people watching this page right now",
        "🚀 Only 27 spots left at this price!",
        "🎯 David's reel got 1M views in 24 hours!",
        "💎 New student from Tokyo just enrolled!",
        "🏆 Sarah hit 100K followers milestone!"
    ];
    
    let currentIndex = 0;
    
    // Enhanced social proof with varied notifications
    setInterval(() => {
        const notification = liveNotifications[currentIndex];
        showLiveNotification(notification);
        currentIndex = (currentIndex + 1) % liveNotifications.length;
    }, 8000);
}

function showLiveNotification(message) {
    const existingNotification = document.querySelector('.live-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'live-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Animated View Counter
function initViewCounter() {
    const viewCounter = document.createElement('div');
    viewCounter.className = 'view-counter';
    viewCounter.innerHTML = `
        <span class="counter-label">Total Student Views:</span>
        <span class="counter-number">127,543,892</span>
    `;
    
    const statsSection = document.querySelector('.impact-stats');
    if (statsSection) {
        statsSection.appendChild(viewCounter);
        
        let currentViews = 127543892;
        setInterval(() => {
            currentViews += Math.floor(Math.random() * 1000);
            viewCounter.querySelector('.counter-number').textContent = currentViews.toLocaleString();
        }, 3000);
    }
}

// Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero, .opportunity, .pricing');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.backgroundPosition = `50% ${yPos}px`;
        });
    });
}

// Magnetic Buttons Effect
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.cta-button');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const strength = 0.3;
            
            button.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// Sound Effects (optional)
function initSoundEffects() {
    const hoverSound = new Audio('sounds/hover.mp3');
    const clickSound = new Audio('sounds/click.mp3');
    
    // Preload sounds
    hoverSound.volume = 0.3;
    clickSound.volume = 0.5;
    
    const buttons = document.querySelectorAll('.cta-button, .showreel-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            hoverSound.currentTime = 0;
            hoverSound.play().catch(() => {});
        });
        
        button.addEventListener('click', () => {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
        });
    });
}

// Global Impact Statistics
function initGlobalImpact() {
    // Live views counter
    const liveCounter = document.getElementById('liveViews');
    if (liveCounter) {
        setInterval(() => {
            const current = parseInt(liveCounter.textContent.replace(/,/g, ''));
            const increment = Math.floor(Math.random() * 1000) + 100;
            const newValue = current + increment;
            liveCounter.textContent = newValue.toLocaleString();
        }, 3000);
    }
    
    // Draw growth chart
    const canvas = document.getElementById('growthChart');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Draw axes
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(40, height - 40);
        ctx.lineTo(width - 20, height - 40);
        ctx.moveTo(40, height - 40);
        ctx.lineTo(40, 20);
        ctx.stroke();
        
        // Draw growth curve
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 4;
        ctx.beginPath();
        
        const points = [];
        for (let i = 0; i < 6; i++) {
            const x = 40 + (i * (width - 60) / 5);
            const y = height - 40 - Math.pow(i, 2) * 5;
            points.push({ x, y });
        }
        
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const xc = (points[i].x + points[i - 1].x) / 2;
            const yc = (points[i].y + points[i - 1].y) / 2;
            ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
        }
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = '#8B5CF6';
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Add labels
        ctx.fillStyle = '#6B7280';
        ctx.font = '14px sans-serif';
        ctx.fillText('Month 1', 40, height - 20);
        ctx.fillText('Month 6', width - 60, height - 20);
        ctx.fillText('Views', 10, 30);
    }
}

// Showreel Video Modal
const videoModal = document.getElementById('video-modal');
const videoContainer = document.getElementById('video-container');
const closeModal = document.getElementById('close-modal');

document.querySelector('.showreel-btn').addEventListener('click', function() {
    const videoUrl = this.dataset.video;
    const videoId = videoUrl.split('/').pop();
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    
    videoContainer.innerHTML = `<iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    videoModal.classList.add('show');
});

closeModal.addEventListener('click', () => {
    videoModal.classList.remove('show');
    videoContainer.innerHTML = '';
});

videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        videoModal.classList.remove('show');
        videoContainer.innerHTML = '';
    }
});

// URL Google Sheets Web App
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwJyK7JhLDqmZ2Jf31BR8B9lA88yAAFppahUIzkjJ8A1ZXQK_cfK5KoRmSo53PfpLrF/exec';

// Глобальная переменная для таймера
let countdownInterval;

// Тестовая функция для проверки
window.testCountdown = function() {
    console.log('Testing countdown...');
    startCountdown();
};

// Функция таймера обратного отсчета
function startCountdown() {
    console.log('Starting countdown timer...');
    
    // Очищаем предыдущий интервал если есть
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    let time = 600; // 10 минут в секундах
    
    // Ищем элемент таймера в модальном окне
    const timerElement = document.querySelector('#paymentModal .countdown-timer');
    
    // Проверяем что элемент существует
    if (!timerElement) {
        console.error('Timer element not found in payment modal');
        return;
    }
    
    console.log('Timer element found:', timerElement);
    
    // Функция обновления таймера
    function updateTimer() {
        if (time < 0) return;
        
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (time === 0) {
            clearInterval(countdownInterval);
            timerElement.textContent = 'Offer Expired!';
            timerElement.style.color = '#DC2626';
        }
        time--;
    }
    
    // Сразу обновляем таймер
    updateTimer();
    
    // Запускаем интервал
    countdownInterval = setInterval(updateTimer, 1000);
}

// Функция определения страны по IP
async function detectCountryByIP() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return {
            country: data.country_code || 'US',
            countryName: data.country_name || 'United States',
            phoneCode: data.country_calling_code || '+1'
        };
    } catch (error) {
        console.error('Error detecting country:', error);
        return {
            country: 'US',
            countryName: 'United States',
            phoneCode: '+1'
        };
    }
}

// Глобальная переменная для хранения данных о локации
let userLocation = null;

// Инициализация формы оплаты (больше не используется, но оставляем для совместимости)
async function initPaymentForm() {
    // Эта функция больше не нужна, так как мы используем Lemon Squeezy
    // Оставляем пустой для совместимости
    return;
}

// Функция отправки данных в Google Sheets
async function sendToGoogleSheets(formData) {
    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        console.log('Data sent to Google Sheets');
        return true;
    } catch (error) {
        console.error('Error sending to Google Sheets:', error);
        
        // Альтернативный метод через форму
        try {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = GOOGLE_SHEETS_URL;
            form.target = 'hidden-iframe';
            
            Object.keys(formData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = formData[key];
                form.appendChild(input);
            });
            
            // Создаем скрытый iframe
            const iframe = document.createElement('iframe');
            iframe.name = 'hidden-iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            document.body.appendChild(form);
            form.submit();
            
            setTimeout(() => {
                form.remove();
                iframe.remove();
            }, 1000);
            
            return true;
        } catch (formError) {
            console.error('Form method also failed:', formError);
            return false;
        }
    }
}

// Функция валидации email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Функция показа сообщения об успехе
function showSuccessMessage() {
    const modal = document.querySelector('.payment-modal-content');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✅</div>
            <h3>Success! Check Your Email</h3>
            <p>We've received your order and sent instructions to your email.</p>
            <p class="success-note">Payment link will be sent within 5 minutes.</p>
        </div>
    `;
    
    modal.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}


// Отслеживание событий Lemon Squeezy
window.addEventListener('message', function(event) {
    // Логируем ВСЕ события для отладки
    console.log('Получено событие от:', event.origin, 'Данные:', event.data);
    
    // Проверяем все возможные origins от Lemon Squeezy
    const lemonOrigins = [
        'https://app.lemonsqueezy.com',
        'https://lemonsqueezy.com',
        'https://checkout.lemonsqueezy.com',
        'https://api.lemonsqueezy.com',
        'https://animator-procrastinator.lemonsqueezy.com'
    ];
    
    if (!lemonOrigins.includes(event.origin)) {
        console.log('Событие не от Lemon Squeezy, игнорируем');
        return;
    }
    
    const data = event.data;
    
    // Логируем все события от Lemon Squeezy для отладки
    console.log('Lemon Squeezy event:', data);
    
    // Проверяем структуру данных - может быть вложенной
    let eventData = data;
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        const firstKey = Object.keys(data)[0];
        if (Array.isArray(data[firstKey]) && data[firstKey].length > 0) {
            eventData = data[firstKey][0];
            console.log('Извлеченные данные события:', eventData);
        }
    }
    
    // Проверяем тип события в извлеченных данных
    const eventType = eventData.type || eventData.name;
    
    // Когда пользователь реально заполняет форму (только реальные события)
    const formEvents = [
        'form-field-focus',
        'form-field-change',
        'form-field-input',
        'form-submit',
        'field-focus',
        'field-change', 
        'field-input',
        'checkout-form-interaction',
        'payment-form-interaction'
    ];
    
    if (formEvents.includes(eventType) || 
        (eventType && eventType.includes('form') && eventType.includes('field'))) {
        if (window.fbq) {
            console.log('Отправляем событие ЗаполненнаяФорма, тип события:', eventType);
            fbq('trackCustom', 'ЗаполненнаяФорма', {
                content_name: 'Checkout Form',
                content_category: 'Course',
                currency: 'USD'
            });
        }
    }
    
    // Когда покупка завершена через postMessage
    if (eventType === 'purchase-complete' || 
        eventType === 'order-complete' ||
        eventType === 'payment-success' ||
        eventType === 'checkout-complete') {
        if (window.fbq) {
            console.log('Отправляем события Purchase и Оплата, тип события:', eventType);
            fbq('track', 'Purchase', {
                value: eventData.amount || 19,
                currency: 'USD',
                content_name: eventData.product_name || 'Course',
                content_category: 'Course'
            });
            
            fbq('trackCustom', 'Оплата', {
                value: eventData.amount || 19,
                currency: 'USD',
                content_name: eventData.product_name || 'Course'
            });
        }
    }
});


// Функция показа сообщения об ошибке
function showErrorMessage(message = 'Something went wrong. Please try again.') {
    const submitBtn = document.querySelector('.submit-payment-btn');
    
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    submitBtn.parentNode.insertBefore(errorDiv, submitBtn.nextSibling);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

 
 
 
