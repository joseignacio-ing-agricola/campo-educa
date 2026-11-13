(() => {
  'use strict';

  const byId = id => document.getElementById(id);
  const panel = byId('carrito');
  if (!panel) return;

  const storageKey = 'campoeduca-cart-v1';
  const products = new Map();
  const buttons = new Map();
  const images = new Map();
  const format = new Intl.NumberFormat('es-CL');
  const money = amount => '$' + format.format(amount);
  const items = byId('cart-items');
  const checkout = byId('cart-checkout');
  const student = byId('cart-student');
  const status = byId('cart-status');
  let selected = [];
  let contact;
  let months;
  let promotion;
  const studentPrice = product => Math.round(product.price * (100 - promotion.discount_percent) / 100);

  function announce(message) {
    status.textContent = message;
  }

  function restore(raw) {
    try {
      const values = JSON.parse(raw);
      if (!Array.isArray(values)) return [];
      const covered = new Set();
      return values.filter(id => {
        const product = products.get(id);
        if (!product || product.courses.some(course => covered.has(course))) return false;
        product.courses.forEach(course => covered.add(course));
        return true;
      });
    } catch {
      return [];
    }
  }

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(selected)); } catch {}
  }

  function cartItem(product) {
    const row = document.createElement('li');
    row.className = 'store-cart-item';
    const photo = images.get(product.id) || images.get(product.courses[0]);
    if (photo) {
      const image = document.createElement('img');
      image.src = photo;
      image.alt = '';
      image.width = 52;
      image.height = 44;
      row.append(image);
    }

    const description = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = product.name;
    const amount = document.createElement('span');
    amount.textContent = money(product.price) + ' CLP';
    description.append(name, amount);
    row.append(description);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'store-remove';
    remove.textContent = '×';
    remove.setAttribute('aria-label', 'Quitar ' + product.name);
    remove.addEventListener('click', () => {
      const index = [...items.children].indexOf(row);
      selected = selected.filter(id => id !== product.id);
      save();
      render();
      announce('Quitaste ' + product.name + ' del carrito.');
      const focusIndex = Math.min(index, items.children.length - 1);
      (items.children[focusIndex]?.querySelector('button') || byId('cart-title')).focus();
    });
    row.append(remove);
    return row;
  }

  function whatsappLink(order, total) {
    const lines = order.map(product => {
      const contents = product.isPack ? ' (' + product.courses.map(id => products.get(id).name).join(' + ') + ')' : '';
      return '• ' + product.name + contents + ' — ' + money(product.price) + ' CLP';
    });
    const message = [
      'Hola, CampoEduca. Quiero consultar por este pedido:',
      '',
      ...lines,
      '',
      'Total estimado: ' + money(total) + ' CLP.',
      months + ' meses de acceso desde la activación.',
      ...(student.checked ? [
        'Solicito validar ' + promotion.code + ' por mi matrícula vigente.',
        'Estimado si se valida: ' + money(order.reduce((sum, product) =>
          sum + (product.isPack ? product.price : studentPrice(product)), 0)) + ' CLP. El descuento aplica a cursos individuales.',
      ] : []),
      '¿Me pueden confirmar el total y los pasos para pagar y activar el acceso?',
    ].join('\n');
    const link = new URL('https://wa.me/' + contact);
    link.searchParams.set('text', message);
    return link.href;
  }

  function render() {
    const order = selected.map(id => products.get(id));
    const total = order.reduce((sum, product) => sum + product.price, 0);
    items.replaceChildren(...order.map(cartItem));
    items.hidden = !order.length;
    byId('cart-empty').hidden = !!order.length;
    byId('cart-count').textContent = '(' + order.length + ')';
    byId('cart-nav-count').textContent = String(order.length);
    document.querySelector('.store-cart-nav').setAttribute('aria-label', 'Ver carrito. Productos: ' + order.length);
    const eligible = order.some(product => !product.isPack);
    byId('cart-student-option').hidden = !eligible;
    if (!eligible) student.checked = false;
    const estimate = byId('cart-student-estimate');
    const totalLabel = byId('cart-total-label');
    totalLabel.textContent = student.checked ? 'Total con descuento*' : 'Total estimado';
    byId('cart-total').textContent = money(total) + ' CLP';
    estimate.hidden = !student.checked;
    if (student.checked) {
      const discounted = order.reduce((sum, product) => sum + (product.isPack ? product.price : studentPrice(product)), 0);
      byId('cart-total').textContent = money(discounted) + ' CLP';
      estimate.textContent = 'Antes: ' + money(total) + ' CLP. Ahorras ' + money(total-discounted) + ' CLP. *Sujeto a validar matrícula. Los packs mantienen su precio.';
    }
    checkout.setAttribute('aria-disabled', String(!order.length));
    if (order.length) checkout.href = whatsappLink(order, total);
    else checkout.removeAttribute('href');
    for (const [id, button] of buttons) {
      const added = selected.includes(id);
      button.textContent = added ? 'En el carrito ✓' : products.get(id).isPack ? 'Agregar pack al carrito' : 'Agregar al carrito';
      button.setAttribute('aria-label', (added ? 'Ver en el carrito: ' : 'Agregar al carrito: ') + products.get(id).name);
      button.classList.toggle('is-added', added);
    }
  }

  function addProduct(id) {
    const product = products.get(id);
    if (selected.includes(id)) {
      panel.scrollIntoView({block: 'start'});
      panel.focus({preventScroll: true});
      return;
    }
    const overlap = selected.map(key => products.get(key)).find(item =>
      item.courses.some(course => product.courses.includes(course)));
    if (overlap) {
      announce(product.name + ' comparte un curso con ' + overlap.name + '. Quita esa selección si quieres cambiarla.');
      panel.scrollIntoView({block: 'start'});
      panel.focus({preventScroll: true});
      return;
    }
    selected = [...selected, id];
    save();
    render();
    announce('Agregaste ' + product.name + ' al carrito.');
  }

  function registerCatalog(data) {
    if (!/^\d{8,15}$/.test(data.whatsapp) || !Number.isInteger(data.access_months) || data.access_months < 1) {
      throw Error('Datos de venta inválidos');
    }
    contact = data.whatsapp;
    months = data.access_months;
    promotion = data.student_promotion;
    const valid = item => typeof item.id === 'string' && typeof item.name === 'string' &&
      Number.isSafeInteger(item.price) && item.price > 0;
    for (const course of data.courses.filter(valid)) {
      products.set(course.id, {...course, courses: [course.id], isPack: false});
    }
    const packs = [...data.packs, {
      id: 'campo-educa-4',
      name: 'Pack Campo Educa · 4 cursos',
      price: data.bundle_price,
      courses: data.bundle_course_ids,
    }];
    for (const pack of packs.filter(valid)) {
      if (pack.courses.length && pack.courses.every(id => products.has(id))) {
        products.set(pack.id, {...pack, isPack: true});
      }
    }
  }

  function activateButtons() {
    for (const link of document.querySelectorAll('[data-cart-add]')) {
      const id = link.dataset.cartAdd;
      if (!products.has(id)) continue;
      const photo = link.closest('article, .store-pack')?.querySelector('img');
      if (photo) images.set(id, photo.getAttribute('src'));
      const button = document.createElement('button');
      button.type = 'button';
      button.className = link.className + ' store-add';
      button.dataset.cartAdd = id;
      button.addEventListener('click', () => addProduct(id));
      link.replaceWith(button);
      buttons.set(id, button);
    }
  }

  byId('cart-title').tabIndex = -1;
  student.addEventListener('change', render);
  document.querySelector('.store-more-packs')?.addEventListener('click', () => {
    byId('paquetes').open = true;
  });
  document.querySelector('.store-cart-nav').addEventListener('click', () => {
    requestAnimationFrame(() => panel.focus({preventScroll: true}));
  });
  window.addEventListener('storage', event => {
    if (event.key === storageKey && products.size) {
      selected = restore(event.newValue);
      render();
    }
  });
  fetch('precios.json?v=20261113', {cache: 'no-cache'})
    .then(response => {
      if (!response.ok) throw Error('Catálogo no disponible');
      return response.json();
    })
    .then(data => {
      registerCatalog(data);
      try { selected = restore(localStorage.getItem(storageKey)); } catch {}
      activateButtons();
      render();
      const url = new URL(location.href);
      const requested = url.searchParams.get('agregar');
      if (requested && products.has(requested)) {
        url.searchParams.delete('agregar');
        history.replaceState(null, '', url);
        addProduct(requested);
        panel.scrollIntoView({block:'start'});
        panel.focus({preventScroll:true});
      }
    })
    .catch(() => {
      announce('El carrito no pudo cargar los precios. Puedes consultar por WhatsApp desde cada curso.');
    });
})();
