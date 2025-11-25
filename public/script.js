async function fetchProviders() {
  const res = await fetch('/api/providers');
  const data = await res.json();
  return data.providers;
}

function renderProviders(providers) {
  const container = document.getElementById('providers');
  container.innerHTML = '';
  providers.forEach((provider) => {
    const wrapper = document.createElement('label');
    wrapper.className = 'provider';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'providers';
    checkbox.value = provider.id;
    checkbox.checked = provider.available;
    checkbox.disabled = !provider.available;

    const name = document.createElement('span');
    name.textContent = provider.name;

    if (!provider.available) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = 'Configure key';
      wrapper.append(checkbox, name, badge);
    } else {
      wrapper.append(checkbox, name);
    }

    container.appendChild(wrapper);
  });
}

function renderResults(results) {
  const container = document.getElementById('results');
  container.innerHTML = '';

  results.forEach((result) => {
    const card = document.createElement('article');
    card.className = 'response-card';

    const header = document.createElement('header');
    const title = document.createElement('h3');
    title.textContent = result.provider.toUpperCase();
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = result.error ? 'Error' : 'OK';
    header.append(title, badge);

    const body = document.createElement('p');
    body.textContent = result.error ? result.error : result.content;

    card.append(header, body);
    container.appendChild(card);
  });
}

function showLoading() {
  const container = document.getElementById('results');
  container.innerHTML = '<p class="loading">Waiting for responses...</p>';
}

async function setup() {
  const providers = await fetchProviders();
  renderProviders(providers);

  const form = document.getElementById('chat-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const prompt = formData.get('prompt');
    const selectedProviders = formData.getAll('providers');

    showLoading();

    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, providers: selectedProviders })
    });

    const data = await res.json();
    renderResults(data.results || []);
  });
}

setup();
