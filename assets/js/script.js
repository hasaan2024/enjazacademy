// script.js - ملف JavaScript الجديد للإضافات التفاعلية
document.addEventListener('DOMContentLoaded', function() {
  // WhatsApp button visibility control for homepage
  if (document.body.classList.contains('homepage')) {
    const whatsappButton = document.querySelector('.whatsapp-float');
    const servicesSection = document.querySelector('#services');
    
    if (whatsappButton && servicesSection) {
      const whatsappObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            whatsappButton.classList.add('show');
          } else {
            whatsappButton.classList.remove('show');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50% 0px'
      });
      
      whatsappObserver.observe(servicesSection);
    }
  }
  
  // تنفيذ الشريط التنقل عند التمرير
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // تفعيل التمرير السلس للروابط
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // تفعيل عداد الإحصائيات
  const counters = document.querySelectorAll('.counter');
  const animationDuration = 2000; // مدة الأنيميشن بالمللي ثانية
  
  // تشغيل العداد عندما يصبح القسم مرئيًا
  const statsSection = document.querySelector('.stats');
  
  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-count');
      let startTime = null;

      const updateCounter = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const currentCount = Math.min(Math.floor(progress / animationDuration * target), target);
        counter.innerText = currentCount;

        if (progress < animationDuration) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target; // التأكد من الوصول للرقم النهائي
        }
      };
      requestAnimationFrame(updateCounter);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  if (statsSection) {
    observer.observe(statsSection);
  }

  // زر العودة إلى الأعلى
  const scrollButton = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollButton.classList.add('active');
    } else {
      scrollButton.classList.remove('active');
    }
  });
  
  scrollButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // القائمة المتنقلة
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active', isActive);
      
      // منع تمرير الصفحة عندما تكون القائمة مفتوحة
      if (navToggle.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  // تفعيل الروابط في شريط التنقل عند التمرير
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          // Check if the link's href contains the section's id
          if (link.getAttribute('href').includes(id)) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { 
    rootMargin: '-50% 0px -50% 0px' // Trigger when the section is in the middle of the viewport
  });

  sections.forEach(section => {
    navObserver.observe(section);
  });

  // Language Switcher Dropdown
  const langSwitcherBtn = document.getElementById('languageSwitcherBtn');
  const langDropdown = document.getElementById('languageDropdown');

  if (langSwitcherBtn && langDropdown) {
    langSwitcherBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = langSwitcherBtn.getAttribute('aria-expanded') === 'true';
      langSwitcherBtn.setAttribute('aria-expanded', !isExpanded);
      langDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!langSwitcherBtn.contains(e.target) && !langDropdown.contains(e.target)) {
        langDropdown.classList.remove('show');
        langSwitcherBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }




  // إضافة تأثيرات للبطاقات عند التمرير بطريقة محسنة
  const animatedElements = document.querySelectorAll('.card, .feature, .testimonial, .work-card');
  
  const cardObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // إضافة الكلاس عند ظهور العنصر
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  
  animatedElements.forEach(el => {
    cardObserver.observe(el);
  });

  // ربط نموذج النشرة البريدية بـ Google Sheets
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    const messageEl = document.getElementById('newsletterMessage');
    const submitButton = newsletterForm.querySelector('button');
    const inputEl = newsletterForm.querySelector('input');

    // دالة بسيطة وفعالة للتحقق من البريد الإلكتروني
    function isEmailValid(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }

    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = inputEl.value;

      if (!isEmailValid(email)) {
        messageEl.textContent = getCurrentTranslation('newsletter_invalid_email');
        messageEl.style.color = '#e74c3c';
        inputEl.classList.add('invalid');
        inputEl.classList.remove('valid');
        return; // إيقاف الإرسال
      }

      const formspreeUrl = "https://formspree.io/f/mwpreojd";
      // عرض رسالة "جاري الإرسال" وتعطيل الزر
      messageEl.textContent = getCurrentTranslation('newsletter_sending');
      messageEl.style.color = '#f39c12'; // لون برتقالي
      submitButton.disabled = true;

      fetch(formspreeUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        },
        body: new FormData(newsletterForm)
      })
      .then(response => {
        if (response.ok) {
          messageEl.textContent = getCurrentTranslation('newsletter_success');
          messageEl.style.color = '#27ae60'; // لون أخضر
          inputEl.classList.remove('valid', 'invalid');
          inputEl.value = ''; // مسح حقل الإدخال
        } else {
          messageEl.textContent = getCurrentTranslation('newsletter_error');
          messageEl.style.color = '#e74c3c'; // لون أحمر
        }
      })
      .catch(error => {
        messageEl.textContent = getCurrentTranslation('newsletter_network_error');
        messageEl.style.color = '#e74c3c'; // لون أحمر
      })
      .finally(() => {
        submitButton.disabled = false; // إعادة تفعيل الزر
      });
    });
  }

  // --- ربط نموذج "تواصل معنا" بـ Formspree ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const messageEl = document.getElementById('contactFormMessage');
    const submitButton = contactForm.querySelector('button');

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // التحقق من الحقول المطلوبة
      const name = contactForm.querySelector('[name="name"]').value.trim();
      const email = contactForm.querySelector('[name="_replyto"]').value.trim();
      const message = contactForm.querySelector('[name="message"]').value.trim();

      if (name === '' || email === '' || message === '') {
        messageEl.textContent = getCurrentTranslation('contact_fill_all_fields');
        messageEl.style.color = '#e74c3c'; // لون أحمر
        return;
      }

      // !! هام: استبدل هذا بالرابط الجديد من Formspree لنموذج التواصل
      const formspreeContactUrl = "https://formspree.io/f/xwprebed"; 

      messageEl.textContent = getCurrentTranslation('contact_sending');
      messageEl.style.color = '#f39c12'; // لون برتقالي
      submitButton.disabled = true;

      fetch(formspreeContactUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: new FormData(contactForm)
      })
      .then(response => {
        if (response.ok) {
          messageEl.textContent = getCurrentTranslation('contact_success');
          messageEl.style.color = '#27ae60'; // لون أخضر
          contactForm.reset(); // مسح حقول النموذج
        } else {
          response.json().then(data => {
            const errorMsg = data.errors ? data.errors.map(error => error.message).join(', ') : getCurrentTranslation('contact_error');
            messageEl.textContent = errorMsg;
            messageEl.style.color = '#e74c3c';
          });
        }
      })
      .catch(error => {
        messageEl.textContent = getCurrentTranslation('contact_network_error');
        messageEl.style.color = '#e74c3c';
      })
      .finally(() => {
        submitButton.disabled = false;
      });
    });
  }
  
    // تفعيل التمرير لأزرار قسم الأعمال
    const worksContainer = document.querySelector('.works-container');
    const leftBtn = document.querySelector('.scroll-btn.left');
    const rightBtn = document.querySelector('.scroll-btn.right');
  
    if (worksContainer && leftBtn && rightBtn) {
      leftBtn.addEventListener('click', () => {
        worksContainer.scrollBy({
          left: -300,
          behavior: 'smooth'
        });
      });
  
      rightBtn.addEventListener('click', () => {
        worksContainer.scrollBy({
          left: 300,
          behavior: 'smooth'
        });
      });
    }
});

function requestQuote(serviceKey) {
  const whatsappNumber = '201142412684'; // رقم الواتساب الخاص بك
  const serviceNameTranslated = getCurrentTranslation(serviceKey);
  const messageTemplate = getCurrentTranslation('whatsapp_quote_message');
  const message = messageTemplate.replace('{serviceName}', serviceNameTranslated);
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappLink, '_blank');
}

function requestOtherServiceQuote() {
  const whatsappNumber = '201142412684'; // رقم الواتساب الخاص بك
  const messageTemplate = getCurrentTranslation('whatsapp_other_service_message');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageTemplate)}`;
  window.open(whatsappLink, '_blank');
}

function requestPaymentInfo() {
  const whatsappNumber = '201142412684'; // رقم الواتساب الخاص بك
  const messageTemplate = getCurrentTranslation('whatsapp_payment_message');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageTemplate)}`;
  window.open(whatsappLink, '_blank');
}

// دالة مساعدة للحصول على الترجمة الحالية (معرفة عالمياً)
const getCurrentTranslation = (key) => translations[document.documentElement.lang][key];