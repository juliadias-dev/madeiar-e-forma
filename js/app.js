(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.main-nav');

  function setMenuOpen(open) {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  }

  menuButton?.addEventListener('click', () => {
    setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  menu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  const filters = [...document.querySelectorAll('.filter')];
  const galleryItems = [...document.querySelectorAll('.gallery-item')];

  function filterGallery(category = 'todos') {
    galleryItems.forEach(item => {
      item.hidden = category !== 'todos' && item.dataset.category !== category;
    });
  }

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(button => button.classList.toggle('active', button === filter));
      filterGallery(filter.dataset.filter);
    });
  });

  const lightbox = document.querySelector('.lightbox');
  let visibleItems = [];
  let activeImage = 0;
  let previousFocus = null;

  function showImage(index) {
    if (!lightbox || !visibleItems.length) return;
    activeImage = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[activeImage];
    const image = lightbox.querySelector('figure img');
    image.src = item.dataset.image;
    image.alt = item.querySelector('img').alt;
    lightbox.querySelector('figcaption').textContent = `${item.dataset.title} · Projeto ilustrativo`;
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('visible');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    previousFocus?.focus();
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      if (!lightbox) return;
      visibleItems = galleryItems.filter(galleryItem => !galleryItem.hidden);
      activeImage = visibleItems.indexOf(item);
      previousFocus = item;
      showImage(activeImage);
      lightbox.classList.add('visible');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      lightbox.querySelector('.lightbox-close').focus();
    });
  });

  if (lightbox) {
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(activeImage - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(activeImage + 1));
    lightbox.addEventListener('click', event => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', event => {
      if (!lightbox.classList.contains('visible')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') showImage(activeImage - 1);
      if (event.key === 'ArrowRight') showImage(activeImage + 1);
    });
  }

  const form = document.querySelector('#quote-form');
  const phone = form?.elements.telefone;

  phone?.addEventListener('input', () => {
    let digits = phone.value.replace(/\D/g, '').slice(0, 11);
    if (digits.length > 10) digits = digits.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    else if (digits.length > 6) digits = digits.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    else if (digits.length > 2) digits = digits.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    phone.value = digits;
  });

  form?.addEventListener('submit', event => {
    event.preventDefault();
    let valid = true;
    form.querySelectorAll('.field-error').forEach(error => { error.textContent = ''; });

    form.querySelectorAll('[required]').forEach(field => {
      let message = '';
      if (field.type === 'radio') {
        if (!form.querySelector('[name="preferencia"]:checked')) message = 'Escolha uma preferência de contato.';
      } else if (!field.value.trim()) {
        message = 'Este campo é obrigatório.';
      } else if (!field.checkValidity()) {
        message = field.type === 'email'
          ? 'Informe um e-mail válido.'
          : 'Confira este campo.';
      }

      if (message) {
        valid = false;
        const error = field.type === 'radio'
          ? field.closest('fieldset').querySelector('.field-error')
          : field.parentElement.querySelector('.field-error');
        error.textContent = message;
        field.setAttribute('aria-invalid', 'true');
      } else {
        field.removeAttribute('aria-invalid');
      }
    });

    if (!valid) {
      form.querySelector('[aria-invalid]')?.focus();
      return;
    }

    const success = form.querySelector('.form-success');
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    form.reset();
  });

  document.querySelector('[data-demo="whatsapp"]')?.addEventListener('click', event => {
    const button = event.currentTarget;
    const originalLabel = 'Conversar pelo WhatsApp';
    button.textContent = 'Demonstração do WhatsApp. Nenhuma mensagem será enviada.';
    window.setTimeout(() => { button.textContent = originalLabel; }, 2600);
  });

})();
