// JavaScript optimizado - Funcionalidades esenciales únicamente
class SitioFeria {
  constructor() {
    this.init();
  }

  init() {
    this.setupNavegacion();
    this.setupFormularios();
    this.setupAnimaciones();
    this.setupAccesibilidad();
  }

  // Navegación suave
  setupNavegacion() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', this.handleNavClick.bind(this));
    });
  }

  handleNavClick(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      targetSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Validación de formularios
  setupFormularios() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));
    
    // Validación en tiempo real
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', this.validateField.bind(this));
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validación completa
    if (this.validateForm(data)) {
      this.showMessage('¡Gracias por tu mensaje! Te contactaremos pronto.', 'success');
      form.reset();
    }
  }

  validateForm(data) {
    const rules = {
      nombre: { required: true, minLength: 2 },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      asunto: { required: true },
      mensaje: { required: true, minLength: 10 }
    };

    let isValid = true;

    Object.entries(rules).forEach(([field, rule]) => {
      const value = data[field]?.trim() || '';
      const fieldElement = document.getElementById(field);
      
      if (rule.required && !value) {
        this.setFieldError(fieldElement, 'Este campo es obligatorio');
        isValid = false;
      } else if (rule.minLength && value.length < rule.minLength) {
        this.setFieldError(fieldElement, `Mínimo ${rule.minLength} caracteres`);
        isValid = false;
      } else if (rule.pattern && !rule.pattern.test(value)) {
        this.setFieldError(fieldElement, 'Formato inválido');
        isValid = false;
      } else {
        this.clearFieldError(fieldElement);
      }
    });

    return isValid;
  }

  validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Limpiar errores previos
    this.clearFieldError(field);
    
    // Validaciones específicas
    switch(field.type) {
      case 'text':
        if (field.id === 'nombre' && value.length > 0 && value.length < 2) {
          this.setFieldError(field);
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          this.setFieldError(field);
        }
        break;
      case 'textarea':
        if (field.id === 'mensaje' && value.length > 0 && value.length < 10) {
          this.setFieldError(field);
        }
        break;
    }
  }

  setFieldError(field, message = '') {
    field.classList.add('form-error');
    field.classList.remove('form-success');
  }

  clearFieldError(field) {
    field.classList.remove('form-error');
    field.classList.add('form-success');
  }

  showMessage(text, type = 'info') {
    // Remover mensajes existentes
    const existingMessage = document.querySelector('.temp-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Crear nuevo mensaje
    const message = document.createElement('div');
    message.className = `temp-message temp-message--${type}`;
    message.textContent = text;
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 2rem;
      background: ${type === 'success' ? '#6aa84f' : '#e74c3c'};
      color: white;
      border-radius: 8px;
      z-index: 1000;
      transition: all 0.3s ease;
    `;

    document.body.appendChild(message);

    // Eliminar después de 3 segundos
    setTimeout(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 3000);
  }

  // Animaciones de entrada
  setupAnimaciones() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Aplicar a todas las secciones
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(section);
    });
  }

  // Mejoras de accesibilidad
  setupAccesibilidad() {
    // Navegación por teclado para elementos interactivos
    const interactiveElements = document.querySelectorAll(
      'button, .portfolio-link, .submit-btn, nav a'
    );
    
    interactiveElements.forEach(element => {
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
      
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    });

    // Indicador de navegación activa
    this.setupActiveNavIndicator();
  }

  setupActiveNavIndicator() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            const activeLink = document.querySelector(`nav a[href="#${id}"]`);
            
            // Remover estado activo de todos los enlaces
            navLinks.forEach(link => {
              link.style.backgroundColor = '';
              link.style.color = '#F5F5DC';
            });
            
            // Agregar estado activo al enlace actual
            if (activeLink) {
              activeLink.style.backgroundColor = '#6aa84f';
              activeLink.style.color = 'white';
            }
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach(section => {
      observer.observe(section);
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new SitioFeria();
  
  // Lazy loading para imágenes (si es necesario)
  const images = document.querySelectorAll('img[data-src]');
  if (images.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }
}); 