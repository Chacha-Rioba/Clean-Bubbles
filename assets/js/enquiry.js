(() => {
  const SERVICES = {
    laundry: [
      'Wash, dry and fold','Washing','Drying','Ironing','Folding','Stain removal',
      'Dry cleaning','Duvets / duvet covers','Carpets / curtains','Mattresses','Shoe cleaning','Pickup & delivery','Not sure'
    ],
    cleaning: [
      'Sofa cleaning','Dining-chair cleaning','Deep-house cleaning','Office cleaning',
      'Kitchen cleaning','Mattress cleaning','Wall-to-wall carpet cleaning','Not sure'
    ],
    fumigation: [
      'General pest control','Cockroach control','Bed bug control','Termite control',
      'Rodent enquiry','Ant enquiry','Disinfection / sanitization','Fogging enquiry','Not sure'
    ]
  };

  const modal = document.createElement('div');
  modal.className = 'enquiry-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="enquiry-backdrop" data-close-modal></div>
    <section class="enquiry-dialog" role="dialog" aria-modal="true" aria-labelledby="enquiry-title">
      <button class="enquiry-close" type="button" aria-label="Close enquiry" data-close-modal>×</button>
      <p class="eyebrow">WhatsApp enquiry</p>
      <h2 id="enquiry-title">Tell us what you need.</h2>
      <p>This prepares a message for you to review. Nothing is sent until you continue to WhatsApp and choose to send it.</p>

      <form id="enquiry-form" novalidate>
        <div class="form-grid">
          <div class="form-field">
            <label for="enquiry-category">Category</label>
            <select id="enquiry-category" name="category" required>
              <option value="">Choose a category</option>
              <option value="laundry">Laundry</option>
              <option value="cleaning">Cleaning</option>
              <option value="fumigation">Fumigation</option>
            </select>
            <span class="form-error" data-error-for="category"></span>
          </div>

          <div class="form-field">
            <label for="enquiry-service">Service</label>
            <select id="enquiry-service" name="service" required>
              <option value="">Choose a service</option>
            </select>
            <span class="form-error" data-error-for="service"></span>
          </div>

          <div class="form-field">
            <label for="enquiry-name">Name <span aria-hidden="true">(optional)</span></label>
            <input id="enquiry-name" name="name" maxlength="80" autocomplete="name">
            <span class="form-error" data-error-for="name"></span>
          </div>

          <div class="form-field">
            <label for="enquiry-area">Area</label>
            <select id="enquiry-area" name="area" required>
              <option value="">Choose area</option>
              <option>Thika</option>
              <option>Nairobi</option>
              <option>Other</option>
            </select>
            <span class="form-error" data-error-for="area"></span>
          </div>

          <div class="form-field full">
            <label for="enquiry-neighbourhood">Neighbourhood / locality</label>
            <input id="enquiry-neighbourhood" name="neighbourhood" maxlength="120" placeholder="e.g. Thika town, Ruiru, Juja">
            <span class="form-error" data-error-for="neighbourhood"></span>
          </div>

          <div class="form-field" id="quantity-field" hidden>
            <label for="enquiry-quantity">Approximate quantity <span aria-hidden="true">(optional)</span></label>
            <input id="enquiry-quantity" name="quantity" type="number" min="1" step="1" inputmode="numeric" placeholder="e.g. 2">
            <span class="form-error" data-error-for="quantity"></span>
          </div>

          <div class="form-field" id="property-field" hidden>
            <label for="enquiry-property">Property type</label>
            <select id="enquiry-property" name="property">
              <option value="">Not sure / not applicable</option>
              <option>Home</option>
              <option>Office</option>
              <option>Other</option>
            </select>
          </div>

          <div class="form-field full">
            <label for="enquiry-description">Items or job details</label>
            <textarea id="enquiry-description" name="description" minlength="10" maxlength="600" required placeholder="Tell us what needs cleaning, approximate quantity/size, or what pest concern you have."></textarea>
            <span class="form-error" data-error-for="description"></span>
          </div>

          <div class="form-field">
            <label for="enquiry-date">Preferred date <span aria-hidden="true">(optional)</span></label>
            <input id="enquiry-date" name="date" type="date">
            <span class="form-error" data-error-for="date"></span>
          </div>
        </div>

        <p class="form-context" id="enquiry-context" aria-live="polite"></p>

        <div class="modal-actions">
          <button class="btn btn-primary" type="submit">Review message</button>
          <a class="btn btn-secondary" href="https://wa.me/254723791323" target="_blank" rel="noopener noreferrer">Open direct chat</a>
        </div>
      </form>

      <div id="enquiry-review" hidden>
        <h3>Review your message</h3>
        <p>You can edit the form or copy this message before opening WhatsApp.</p>
        <div class="review-box" id="enquiry-message" tabindex="0"></div>
        <div class="modal-actions">
          <button class="btn btn-secondary" type="button" id="edit-enquiry">Edit</button>
          <button class="btn btn-secondary" type="button" id="copy-enquiry">Copy message</button>
          <a class="btn btn-primary" id="continue-whatsapp" href="#" target="_blank" rel="noopener noreferrer">Continue to WhatsApp</a>
          <a class="btn btn-secondary" href="tel:+254723791323">Call instead</a>
        </div>
        <p id="copy-status" aria-live="polite"></p>
      </div>
    </section>
  `;
  document.body.appendChild(modal);

  const form = modal.querySelector('#enquiry-form');
  const review = modal.querySelector('#enquiry-review');
  const category = modal.querySelector('#enquiry-category');
  const service = modal.querySelector('#enquiry-service');
  const area = modal.querySelector('#enquiry-area');
  const neighbourhood = modal.querySelector('#enquiry-neighbourhood');
  const description = modal.querySelector('#enquiry-description');
  const date = modal.querySelector('#enquiry-date');
  const name = modal.querySelector('#enquiry-name');
  const quantity = modal.querySelector('#enquiry-quantity');
  const quantityField = modal.querySelector('#quantity-field');
  const property = modal.querySelector('#enquiry-property');
  const propertyField = modal.querySelector('#property-field');
  const context = modal.querySelector('#enquiry-context');
  const messageBox = modal.querySelector('#enquiry-message');
  const continueLink = modal.querySelector('#continue-whatsapp');
  const copyStatus = modal.querySelector('#copy-status');
  let lastTrigger = null;

  function nairobiToday() {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Nairobi',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(new Date());

    const values = Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  const today = nairobiToday();
  date.min = today;

  function renderServices(selected = '') {
    const options = category.value ? SERVICES[category.value] : [];
    service.innerHTML = '<option value="">Choose a service</option>' +
      options.map(item => `<option${item === selected ? ' selected' : ''}>${item}</option>`).join('');
  }

  function updateConditionalFields(announce = false) {
    const type = category.value;
    const showQuantity = type === 'laundry' || type === 'cleaning';
    const showProperty = type === 'cleaning' || type === 'fumigation';

    quantityField.hidden = !showQuantity;
    propertyField.hidden = !showProperty;

    if (!showQuantity) quantity.value = '';
    if (!showProperty) property.value = '';

    if (type === 'laundry') {
      description.placeholder = 'Describe the items, care concerns and anything useful about pickup.';
    } else if (type === 'cleaning') {
      description.placeholder = 'Describe the rooms, furniture, carpet area or cleaning scope.';
    } else if (type === 'fumigation') {
      description.placeholder = 'Describe the pest concern, affected areas or what you are seeing.';
    } else {
      description.placeholder = 'Tell us what needs cleaning, approximate quantity/size, or what pest concern you have.';
    }

    if (announce && type) {
      context.textContent = 'The fields have been adjusted for this service category.';
    } else {
      context.textContent = '';
    }
  }

  function openModal(trigger) {
    lastTrigger = trigger;
    const focusAreaOnOpen = trigger?.dataset.focusArea === 'true';
    const selectedCategory = trigger?.dataset.category || '';
    const selectedService = trigger?.dataset.service || '';

    if (selectedCategory) category.value = selectedCategory;
    renderServices(selectedService);
    updateConditionalFields(false);

    review.hidden = true;
    form.hidden = false;
    copyStatus.textContent = '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    document.querySelector('.mobile-action-bar')?.setAttribute('hidden', '');

    setTimeout(() => {
      if (focusAreaOnOpen) area.focus();
      else if (selectedCategory) service.focus();
      else category.focus();
    }, 0);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    document.querySelector('.mobile-action-bar')?.removeAttribute('hidden');
    lastTrigger?.focus();
  }

  category.addEventListener('change', () => {
    renderServices();
    updateConditionalFields(true);
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-enquiry]');
    if (trigger) openModal(trigger);
    if (event.target.closest('[data-close-modal]')) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  modal.querySelector('.enquiry-dialog').addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll('button:not([disabled]),a[href],input,select,textarea,[tabindex="0"]')]
      .filter(el => !el.hidden && el.offsetParent !== null);

    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  function setError(field, message) {
    const error = modal.querySelector(`[data-error-for="${field}"]`);
    if (error) error.textContent = message || '';
  }

  function validate() {
    let ok = true;
    ['category', 'service', 'area', 'description', 'date', 'name', 'neighbourhood', 'quantity']
      .forEach(key => setError(key, ''));

    if (!category.value) { setError('category', 'Choose a category.'); ok = false; }
    if (!service.value) { setError('service', 'Choose a service or “Not sure”.'); ok = false; }
    if (!area.value) { setError('area', 'Choose an area.'); ok = false; }

    const desc = description.value.trim();
    if (!desc) { setError('description', 'Tell us briefly what you need.'); ok = false; }
    else if (desc.length < 10) { setError('description', 'Please add a little more detail (at least 10 characters).'); ok = false; }
    else if (desc.length > 600) { setError('description', 'Keep the description within 600 characters.'); ok = false; }

    if (name.value.trim().length > 80) { setError('name', 'Keep the name within 80 characters.'); ok = false; }
    if (neighbourhood.value.trim().length > 120) { setError('neighbourhood', 'Keep the neighbourhood within 120 characters.'); ok = false; }

    if (!quantityField.hidden && quantity.value) {
      const qty = Number(quantity.value);
      if (!Number.isInteger(qty) || qty < 1) {
        setError('quantity', 'Use a positive whole number.');
        ok = false;
      }
    }

    if (date.value && date.value < today) {
      setError('date', 'Choose today or a future date.');
      ok = false;
    }

    return ok;
  }

  function buildMessage() {
    const areaLine = neighbourhood.value.trim()
      ? `${area.value} - ${neighbourhood.value.trim()}`
      : area.value;

    const lines = [
      'Hello Clean Bubbles, I would like a quote.',
      `Service: ${category.options[category.selectedIndex].text} - ${service.value}`
    ];

    if (name.value.trim()) lines.push(`Name: ${name.value.trim()}`);
    lines.push(`Area: ${areaLine}`);
    if (!quantityField.hidden && quantity.value) lines.push(`Approx. quantity: ${quantity.value}`);
    if (!propertyField.hidden && property.value) lines.push(`Property: ${property.value}`);
    lines.push(`Items or job: ${description.value.trim()}`);
    if (date.value) lines.push(`Preferred date: ${date.value}`);
    lines.push('Please confirm availability, price and pickup or service arrangements.');

    return lines.join('\n');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validate()) {
      const errorField = modal.querySelector('.form-error:not(:empty)');
      errorField?.closest('.form-field')?.querySelector('input,select,textarea')?.focus();
      return;
    }

    const message = buildMessage();

    if (message.length > 1400) {
      setError('description', 'The prepared WhatsApp message is too long. Shorten the job description.');
      description.focus();
      return;
    }

    messageBox.textContent = message;
    continueLink.href = `https://wa.me/254723791323?text=${encodeURIComponent(message)}`;
    form.hidden = true;
    review.hidden = false;
    messageBox.focus();
  });

  modal.querySelector('#edit-enquiry').addEventListener('click', () => {
    review.hidden = true;
    form.hidden = false;
    description.focus();
  });

  modal.querySelector('#copy-enquiry').addEventListener('click', async () => {
    const text = messageBox.textContent;

    try {
      await navigator.clipboard.writeText(text);
      copyStatus.textContent = 'Message copied.';
    } catch {
      copyStatus.textContent = 'Copy did not work. Select the message above and copy it manually.';
    }
  });
})();