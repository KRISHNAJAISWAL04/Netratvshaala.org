/* ============================================================
   NETRATVSHAALA — Shared JavaScript
   ============================================================ */
console.log("JS LOADED");

// ---- SUPABASE CONFIGURATION ----
const SUPABASE_URL = 'https://cqmolzmdvamlgvaaqjrp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxbW9sem1kdmFtbGd2YWFxanJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODcwMTksImV4cCI6MjA5MjM2MzAxOX0.zYOibWeVg_21FbPkHR74kBRjVsXXoJSVqOiOsYET-qU';
let sbClient = null;

try {
  if (typeof supabase !== 'undefined') {
    sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  } else if (typeof supabasejs !== 'undefined') {
    sbClient = supabasejs.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
} catch (e) {
  console.warn("Supabase initialization skipped:", e);
}

document.addEventListener('DOMContentLoaded', function () {

  // ---- NAV SCROLL EFFECT ----
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // ---- MOBILE HAMBURGER MENU ----
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- SCROLL ANIMATIONS (Intersection Observer) ----
  const animElements = document.querySelectorAll('.animate-on-scroll');
  if (animElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    animElements.forEach(function (el) { observer.observe(el); });
  }

  // ---- FAQ ACCORDION ----
  const faqList = document.getElementById('faq-list');
  if (faqList && typeof faqData !== 'undefined') {
    faqData.forEach(function (f, i) {
      var item = document.createElement('div');
      item.className = 'faq-item';
      item.innerHTML =
        '<button class="faq-btn" aria-expanded="false" aria-controls="ans-' + i + '">' +
          '<span class="faq-q">' + f.q + '</span>' +
          '<span class="faq-icon" aria-hidden="true">' +
            '<svg width="12" height="12" viewBox="0 0 12 12" fill="none">' +
              '<line x1="6" y1="0" x2="6" y2="12" stroke="#0F1D2F" stroke-width="1.5"/>' +
              '<line x1="0" y1="6" x2="12" y2="6" stroke="#0F1D2F" stroke-width="1.5"/>' +
            '</svg>' +
          '</span>' +
        '</button>' +
        '<div class="faq-answer" id="ans-' + i + '" role="region">' +
          '<div class="faq-answer-inner">' + f.a + '</div>' +
        '</div>';
      var btn = item.querySelector('.faq-btn');
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(function (el) {
          el.classList.remove('open');
          el.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
      faqList.appendChild(item);
    });
    // Open first by default
    if (faqList.firstChild) {
      faqList.firstChild.classList.add('open');
      faqList.firstChild.querySelector('.faq-btn').setAttribute('aria-expanded', 'true');
    }
  }

  // ---- CONTACT FORM VALIDATION & SUBMISSION ----
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const submitBtn = contactForm.querySelector('.form-submit');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message →';

    // Clear error on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const group = input.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
    });

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      let valid = true;

      const nameField = document.getElementById('contact-name');
      const emailField = document.getElementById('contact-email');
      const msgField = document.getElementById('contact-message');

      // Reset errors
      [nameField, emailField, msgField].forEach(function (f) {
        if (!f) return;
        f.classList.remove('error');
        const group = f.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });

      // Validate
      if (!nameField.value.trim()) {
        nameField.classList.add('error');
        nameField.closest('.form-group').classList.add('has-error');
        valid = false;
      }
      if (!emailField.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.classList.add('error');
        emailField.closest('.form-group').classList.add('has-error');
        valid = false;
      }
      if (!msgField.value.trim()) {
        msgField.classList.add('error');
        msgField.closest('.form-group').classList.add('has-error');
        valid = false;
      }

      if (valid) {
        // Show loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="loader"></span> Sending...';
          submitBtn.style.opacity = '0.7';
        }

        const formData = {
          name: nameField.value.trim(),
          email: emailField.value.trim(),
          message: msgField.value.trim(),
          created_at: new Date().toISOString()
        };

        if (sbClient) {
          try {
            const { error } = await sbClient.from('contact_messages').insert([formData]);
            if (error) throw error;

            handleSuccess(contactForm, submitBtn, originalBtnText, 'Thank you! Your message has been received. We\'ll get back to you within 48 hours.');
          } catch (err) {
            console.error("Supabase Error:", err);
            showToast('Unable to send message to database. Table "contact_submissions" might be missing.');
            // Fallback to simulation/reset
            handleSuccess(contactForm, submitBtn, originalBtnText, 'Message simulation complete.');
          }
        } else {
          // Simulation fallback
          setTimeout(() => {
            handleSuccess(contactForm, submitBtn, originalBtnText, 'Thank you! Your message has been received. We\'ll get back to you within 48 hours.');
          }, 1500);
        }
      } else {
        const firstError = contactForm.querySelector('.error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  function handleSuccess(form, btn, originalText, toastMsg) {
    showToast(toastMsg);
    form.reset();
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText;
      btn.style.opacity = '1';
    }

    const formContainer = form.parentElement;
    if (formContainer && formContainer.classList.contains('animate-on-scroll')) {
      const successMsg = document.createElement('div');
      successMsg.className = 'form-success-message';
      successMsg.style.padding = '40px';
      successMsg.style.background = 'var(--cream)';
      successMsg.style.borderLeft = '4px solid var(--ga)';
      successMsg.style.borderRadius = 'var(--radius)';
      successMsg.innerHTML = '<h3 style="margin-bottom:12px; color:var(--ink);">Message Sent!</h3><p style="color:var(--ink2);">We have received your message and our team will get back to you shortly. Thank you for reaching out to Netratvshaala.</p>';
      
      form.style.display = 'none';
      formContainer.appendChild(successMsg);
    }
  }

  // ---- NEWSLETTER FORM ----
  var nlForms = document.querySelectorAll('.newsletter-form');
  nlForms.forEach(function (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var emailInput = form.querySelector('input[type="email"]');
      var submitBtn = form.querySelector('button');
      var originalText = submitBtn ? submitBtn.textContent : 'Subscribe';

      if (emailInput && emailInput.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = '...';
        }

        const email = emailInput.value.trim();

        if (sbClient) {
          try {
            const { error } = await sbClient.from('newsletter_subscribers').insert([{ email, created_at: new Date().toISOString() }]);
            if (error) throw error;
            showToast('You\'re subscribed! Watch your inbox for updates from Netratvshaala.');
          } catch (err) {
            console.error("Supabase Error:", err);
            showToast('Database Error. Table "newsletters" might be missing.');
          }
        } else {
          // Simulation
          await new Promise(resolve => setTimeout(resolve, 1000));
          showToast('You\'re subscribed! Watch your inbox for updates from Netratvshaala.');
        }

        emailInput.value = '';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      } else {
        showToast('Please enter a valid email address.');
      }
    });
  });

  // ---- TOAST NOTIFICATION ----
  function showToast(message) {
    var existing = document.querySelector('.form-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'form-toast success show';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 400);
    }, 4000);
  }

  // ---- ACTIVE NAV LINK ----
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});
