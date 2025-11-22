/* 
  ========================================
  PROMOCITY VAÍ - CORE JS
  Handles data fetching, routing, and rendering
  ========================================
*/

// Estado global da aplicação
const state = {
  comercios: [],
  promocoes: [],
  stories: [],
  categorias: []
};

let activeCategory = null; // Variável global para controlar categoria ativa

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Só inicia o carregamento global se estiver na home
  if (document.getElementById('storiesContainer')) {
    initApp();
  }
});

async function initApp() {
  await loadData();
  renderStories();
  renderCategories();
  renderPromotions();
  renderStores();
  setupSearch();
  renderNotifications(); // Chama a renderização das notificações reais
  setupNotifications();
}

/* --- DATA FETCHING --- */
// ... existing code ...
/* --- DATA FETCHING --- */
async function loadData() {
  try {
    // 1. Tenta carregar do Firebase (Se configurado)
    if (typeof db !== 'undefined') {
      console.log("Tentando carregar do Firebase...");
      try {
        // Carrega todos os dados do Firebase
        const comSnap = await db.ref('comercios').once('value');
        const promSnap = await db.ref('promocoes').once('value');
        const storSnap = await db.ref('stories').once('value');
        const catSnap = await db.ref('categorias').once('value');
        
        if (comSnap.exists()) {
          const dataObj = comSnap.val();
          state.comercios = Object.keys(dataObj).map(key => dataObj[key]);
          console.log("Comercios carregados do Firebase!", state.comercios.length);
        }
        
        if (promSnap.exists()) {
          const dataObj = promSnap.val();
          state.promocoes = Object.keys(dataObj).map(key => dataObj[key]);
          console.log("Promoções carregadas do Firebase!");
        }
        
        if (storSnap.exists()) {
          const dataObj = storSnap.val();
          state.stories = Object.keys(dataObj).map(key => dataObj[key]);
          console.log("Stories carregados do Firebase!");
        }

        if (catSnap.exists()) {
            const dataObj = catSnap.val();
            state.categorias = Object.keys(dataObj).map(key => dataObj[key]);
            console.log("Categorias carregadas do Firebase!");
        }

      } catch (e) {
        console.log("Firebase não configurado ou vazio. Usando local.", e);
      }
    }

    // 2. Se não carregou do Firebase (ou se ele estiver vazio), carrega do JSON local
    if (state.comercios.length === 0) {
      console.log("Carregando do JSON Local...");
      const [comRes, promRes, storRes, catRes] = await Promise.all([
        fetch('data/comercios.json'),
        fetch('data/promocoes.json'),
        fetch('data/stories.json'),
        fetch('data/categorias.json')
      ]);

      if (comRes.ok) state.comercios = await comRes.json();
      if (promRes.ok) state.promocoes = await promRes.json();
      if (storRes.ok) state.stories = await storRes.json();
      if (catRes.ok) state.categorias = await catRes.json();
    }

    console.log('Dados finais carregados:', state);

  } catch (error) {
    console.warn('Erro ao carregar dados (Offline ou Erro). Carregando backup.', error);
    loadFallbackData();
  }
}

/* --- RENDERING FUNCTIONS --- */
// ... existing code ...

    // 2. Se não carregou do Firebase (ou se ele estiver vazio), carrega do JSON local
    if (state.comercios.length === 0) {
      console.log("Carregando do JSON Local...");
      const [comRes, promRes, storRes, catRes] = await Promise.all([
        fetch('data/comercios.json'),
        fetch('data/promocoes.json'),
        fetch('data/stories.json'),
        fetch('data/categorias.json')
      ]);

      if (comRes.ok) state.comercios = await comRes.json();
      if (promRes.ok) state.promocoes = await promRes.json();
      if (storRes.ok) state.stories = await storRes.json();
      if (catRes.ok) state.categorias = await catRes.json();
    }

    console.log('Dados finais carregados:', state);

  } catch (error) {
    console.warn('Erro ao carregar dados (Offline ou Erro). Carregando backup.', error);
    loadFallbackData();
  }
}

function loadFallbackData() {
  state.categorias = [
    { "id": "cat_1", "nome": "Alimentação", "slug": "alimentacao", "icone": "🍔" },
    { "id": "cat_2", "nome": "Moda", "slug": "moda", "icone": "👗" },
    { "id": "cat_3", "nome": "Serviços", "slug": "servicos", "icone": "🛠️" },
    { "id": "cat_4", "nome": "Tecnologia", "slug": "tecnologia", "icone": "📱" }
  ];
  
  state.comercios = [
    {
      "id": 99,
      "nome": "Samuray Burguer ⚔️",
      "slug": "samuray-burguer",
      "categoria": "alimentacao",
      "descricao": "O hambúrguer mais honrado da cidade. Ingredientes premium e molho secreto.",
      "logo": "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=200",
      "capa": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
      "endereco": "Av. dos Comerciantes, 1000",
      "telefone": "5542999067042", 
      "horario": "18h às 02h",
      "plano": "pro", 
      "views": 5400
    },
    {
      "id": 1,
      "nome": "Burger King da Praça",
      "slug": "burger-king-praca",
      "categoria": "alimentacao",
      "descricao": "O melhor hambúrguer artesanal da cidade. Aberto todos os dias.",
      "logo": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=200",
      "capa": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
      "endereco": "Rua das Flores, 123 - Centro",
      "telefone": "5542999999999",
      "horario": "18h às 23h",
      "plano": "pro",
      "views": 1250
    },
    {
      "id": 2,
      "nome": "Fashion Style",
      "slug": "fashion-style",
      "categoria": "moda",
      "descricao": "Moda feminina e masculina.",
      "logo": "https://images.unsplash.com/photo-1529139574466-a302c27560a0?w=200",
      "capa": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      "endereco": "Av. Brasil, 500",
      "telefone": "5542988888888",
      "horario": "09h às 18h",
      "plano": "pro",
      "views": 980
    },
    {
      "id": 10,
      "nome": "TechZone Info",
      "slug": "techzone",
      "categoria": "tecnologia",
      "descricao": "Assistência técnica especializada.",
      "logo": "https://images.unsplash.com/photo-1531297461136-82af022f1b28?w=200",
      "capa": "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800",
      "endereco": "Centro",
      "telefone": "5542966666666",
      "horario": "09h às 18h",
      "plano": "free",
      "views": 890
    }
  ];

  state.promocoes = [
    {
      "id": "promo_99",
      "commerceId": 99,
      "titulo": "Combo Shogun (X-Tudo)",
      "preco": "35,90",
      "precoOriginal": "49,90",
      "imagem": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
      "ativa": true
    },
    {
      "id": "promo_1",
      "commerceId": 1,
      "titulo": "Combo Duplo Bacon",
      "preco": "29,90",
      "precoOriginal": "45,90",
      "imagem": "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600",
      "ativa": true
    },
    {
      "id": "promo_2",
      "commerceId": 2,
      "titulo": "Vestidos de Verão",
      "preco": "79,90",
      "precoOriginal": "159,90",
      "imagem": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600",
      "ativa": true
    }
  ];

  state.stories = [
    { "commerceId": 99, "titulo": "PROMOÇÃO ⚔️", "imagem": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500" },
    { "commerceId": 1, "titulo": "Promoção!", "imagem": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80" },
    { "commerceId": 2, "titulo": "Novidade", "imagem": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80" }
  ];
}

/* --- RENDERING FUNCTIONS --- */

function renderStories() {
  const container = document.getElementById('storiesContainer');
  if (!container) return;

  // Filtrar apenas stories válidos ou de lojas PRO
  const storiesList = state.stories.map(story => {
    const loja = state.comercios.find(c => c.id == story.commerceId);
    return { ...story, lojaName: loja ? loja.nome : 'Loja' };
  });

  container.innerHTML = storiesList.map(story => `
    <div class="story-item" onclick="window.location.href='comercio.html?id=${story.commerceId}'">
      <div class="story-preview ${story.commerceId === 1 ? 'pro' : ''}">
        <img src="${story.imagem}" alt="${story.titulo}">
        <span class="story-badge">NOVO</span>
      </div>
      <span class="story-name">${story.lojaName}</span>
    </div>
  `).join('');
}

function renderCategories() {
  const container = document.getElementById('categoriesContainer');
  if (!container) return;

  // Botão "Todas" no início
  const allActive = activeCategory === null ? 'active' : '';
  let html = `
    <div class="cat-pill ${allActive}" onclick="filterByCategory(null)">
      <span>🏠</span> Todas
    </div>
  `;

  html += state.categorias.map(cat => {
    const isActive = activeCategory === cat.slug ? 'active' : '';
    return `
      <div class="cat-pill ${isActive}" onclick="filterByCategory('${cat.slug}')">
        <span>${cat.icone}</span> ${cat.nome}
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

function renderPromotions(filterTerm = '') {
  const container = document.getElementById('promosContainer');
  if (!container) return;

  let promos = state.promocoes.filter(p => p.ativa);

  // Filtro por categoria ativa
  if (activeCategory) {
    promos = promos.filter(p => {
      const loja = state.comercios.find(c => c.id == p.commerceId);
      return loja && loja.categoria === activeCategory;
    });
  }

  // Filtro de busca (texto)
  if (filterTerm) {
    promos = promos.filter(p => 
      p.titulo.toLowerCase().includes(filterTerm) || 
      state.comercios.find(c => c.id == p.commerceId)?.nome.toLowerCase().includes(filterTerm)
    );
  }

  if (promos.length === 0) {
    container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:20px;">Nenhuma oferta encontrada nesta categoria.</p>';
    return;
  }

  container.innerHTML = promos.map(p => {
    const loja = state.comercios.find(c => c.id == p.commerceId);
    return `
      <article class="promo-card">
        <div class="promo-tag">-${calculateDiscount(p.preco, p.precoOriginal)}%</div>
        <img src="${p.imagem}" class="promo-img" alt="${p.titulo}">
        <div class="promo-content">
          <div class="promo-store">
            <i class='bx bxs-store'></i> ${loja ? loja.nome : 'Loja Parceira'}
          </div>
          <h3 class="promo-title">${p.titulo}</h3>
          <div class="promo-price-row">
            <div>
              <span class="price-old">R$ ${p.precoOriginal}</span>
              <div class="price-new">R$ ${p.preco}</div>
            </div>
            <a href="https://wa.me/${loja ? loja.telefone : ''}?text=Vi a oferta ${p.titulo} no app!" target="_blank" class="btn-wa-mini">
              <i class='bx bxl-whatsapp'></i>
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function renderStores() {
  const container = document.getElementById('storesContainer');
  if (!container) return;

  let filteredStores = [...state.comercios];

  // Filtro por categoria
  if (activeCategory) {
    filteredStores = filteredStores.filter(store => store.categoria === activeCategory);
  }

  // Ordenar: PRO primeiro, depois por views
  filteredStores.sort((a, b) => {
    if (a.plano === 'pro' && b.plano !== 'pro') return -1;
    if (a.plano !== 'pro' && b.plano === 'pro') return 1;
    return b.views - a.views;
  });

  if (filteredStores.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:20px;">Nenhuma loja encontrada nesta categoria.</p>';
    return;
  }

  container.innerHTML = filteredStores.map(loja => `
    <div class="store-card" onclick="window.location.href='comercio.html?id=${loja.id}'">
      <img src="${loja.logo}" class="store-logo" alt="${loja.nome}">
      <div class="store-info">
        <div class="store-name">
          ${loja.nome} 
          ${loja.plano === 'pro' ? '<i class="bx bxs-badge-check verified-badge"></i>' : ''}
        </div>
        <div class="store-cat">${formatCatName(loja.categoria)}</div>
        <div class="store-meta">
          <span><i class='bx bxs-star' style="color:#ffc107"></i> 4.8</span>
          <span>• ${loja.horario}</span>
        </div>
      </div>
      <i class='bx bx-chevron-right' style="font-size:1.5rem; color:#ccc;"></i>
    </div>
  `).join('');
}

/* --- PROFILE PAGE LOGIC --- */
async function loadCommerceProfile(id) {
  // Se o estado estiver vazio (acesso direto), carrega tudo
  if (state.comercios.length === 0) await loadData();

  const loja = state.comercios.find(c => c.id == id);
  const container = document.getElementById('profileContainer');
  const promosContainer = document.getElementById('storePromosContainer');

  if (!loja) {
    container.innerHTML = '<p class="text-center">Loja não encontrada.</p>';
    return;
  }

  // Render Profile Header
  container.innerHTML = `
    <div class="profile-header">
      <img src="${loja.capa}" class="cover-img" alt="Capa">
      <div class="profile-logo-wrap">
        <img src="${loja.logo}" alt="Logo">
      </div>
    </div>

    <div class="profile-details">
      <h1 class="profile-name">
        ${loja.nome} 
        ${loja.plano === 'pro' ? '<i class="bx bxs-badge-check verified-badge" title="Verificado"></i>' : ''}
      </h1>
      <span class="profile-cat">${formatCatName(loja.categoria)}</span>
      <p class="profile-desc">${loja.descricao}</p>
      
      <div class="action-buttons">
        <a href="https://wa.me/${loja.telefone}" target="_blank" class="btn btn-wa-full">
          <i class='bx bxl-whatsapp'></i> Chamar no Whats
        </a>
      </div>

      <div class="info-grid">
        <div class="info-card">
          <i class='bx bx-time-five info-icon'></i>
          <span class="info-label">Horário</span>
          <span class="info-value">${loja.horario}</span>
        </div>
        <div class="info-card">
          <i class='bx bx-map info-icon'></i>
          <span class="info-label">Local</span>
          <span class="info-value">Ver no Mapa</span>
        </div>
      </div>
      
      <div style="margin-top: 10px; text-align:left; font-size:0.9rem; color:var(--text-muted);">
        <i class='bx bx-map-pin'></i> ${loja.endereco}
      </div>
    </div>
  `;

  // Render Store Specific Promos
  const lojaPromos = state.promocoes.filter(p => p.commerceId == id && p.ativa);
  
  if (lojaPromos.length > 0) {
    promosContainer.innerHTML = lojaPromos.map(p => `
      <article class="promo-card">
        <div class="promo-tag">-${calculateDiscount(p.preco, p.precoOriginal)}%</div>
        <img src="${p.imagem}" class="promo-img" alt="${p.titulo}">
        <div class="promo-content">
          <h3 class="promo-title">${p.titulo}</h3>
          <div class="promo-price-row">
            <div>
              <span class="price-old">R$ ${p.precoOriginal}</span>
              <div class="price-new">R$ ${p.preco}</div>
            </div>
          </div>
        </div>
      </article>
    `).join('');
  }
}

/* --- HELPERS --- */
function setupSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  input.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    renderPromotions(term);
    
    // Filtra lojas visualmente escondendo as que não batem
    const storeCards = document.querySelectorAll('.store-card');
    storeCards.forEach(card => {
      const name = card.querySelector('.store-name').innerText.toLowerCase();
      if(name.includes(term)) card.style.display = 'flex';
      else card.style.display = 'none';
    });
  });
}

function calculateDiscount(price, original) {
  const p = parseFloat(price.replace(',', '.'));
  const o = parseFloat(original.replace(',', '.'));
  if (!o || !p) return 0;
  return Math.round(((o - p) / o) * 100);
}

function formatCatName(slug) {
  const cat = state.categorias.find(c => c.slug === slug);
  return cat ? cat.nome : slug;
}

function filterByCategory(slug) {
  activeCategory = slug; // Define a categoria ativa (null = todas)
  
  // Re-renderiza as seções afetadas
  renderCategories(); // Para atualizar o botão ativo visualmente
  renderPromotions(); // Filtra promoções
  renderStores();     // Filtra lojas
  
  // Feedback visual opcional (scroll suave para promoções)
  const section = document.getElementById('promosContainer');
  if(section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function setupNotifications() {
  const btn = document.getElementById('btnNotificacoes');
  const modal = document.getElementById('notificacoesModal');
  const close = document.getElementById('fecharNotificacoes');

  if (!btn || !modal || !close) return;

  btn.addEventListener('click', () => {
    modal.classList.remove('d-none');
    // Opcional: Limpar badge
    const badge = btn.querySelector('.notif-badge');
    if(badge) badge.style.display = 'none';
  });

  close.addEventListener('click', () => {
    modal.classList.add('d-none');
  });

  // Fechar ao clicar fora do modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('d-none');
    }
  });
}

/* --- PWA INSTALLATION --- */
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// Lógica do Botão "Baixe o App"
const btnBaixe = document.getElementById('btnBaixeApp');
if(btnBaixe) {
  btnBaixe.addEventListener('click', async () => {
    if (deferredPrompt) {
      // Se o navegador suporta instalação direta (Android/Chrome)
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
    } else {
      // Instruções para todos os celulares
      alert("Para instalar o App:\n\n📱 Android: Toque no menu do navegador (três pontinhos) e escolha 'Instalar aplicativo' ou 'Adicionar à tela inicial'.\n\n🍎 iPhone: Toque no botão 'Compartilhar' e escolha 'Adicionar à Tela de Início'.");
    }
  });
}

// Ocultar botão se já estiver instalado (Standalone)
if (window.matchMedia('(display-mode: standalone)').matches) {
  if(btnBaixe) btnBaixe.style.display = 'none';
}

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registrado!', reg))
      .catch(err => console.log('Falha no SW:', err));
  });
}

/* --- LIVE COUNTER (Fake Social Proof) --- */
function startLiveCounter() {
  const el = document.getElementById('counterNum');
  if (!el) return;

  let current = 72; // Começa em 72 como você pediu
  const min = 45;
  const max = 289; // Seu limite máximo

  setInterval(() => {
    // Variação aleatória: sobe mais do que desce para dar sensação de crescimento
    const change = Math.floor(Math.random() * 10) - 3; // Entre -3 e +6
    let next = current + change;

    // Mantém dentro dos limites
    if (next > max) next = max - Math.floor(Math.random() * 10);
    if (next < min) next = min + Math.floor(Math.random() * 5);

    current = next;
    el.innerText = current;
    
    // Animaçãozinha visual no número
    el.style.opacity = 0.5;
    setTimeout(() => el.style.opacity = 1, 200);

  }, 4000 + Math.random() * 3000); // Atualiza a cada 4 a 7 segundos
}

// Inicia o contador
document.addEventListener('DOMContentLoaded', startLiveCounter);

/* --- REAL NOTIFICATIONS --- */
function renderNotifications() {
  const notifList = document.querySelector('.notif-list');
  const badge = document.querySelector('.notif-badge');
  
  if (!notifList || state.promocoes.length === 0) return;

  // Pega as últimas 5 promoções (assumindo que a ordem do array é cronológica de inserção)
  // Se tiver timestamp real seria melhor sort, mas reverse funciona bem para arrays simples
  const latestPromos = [...state.promocoes].reverse().slice(0, 5);

  if (badge) {
    badge.innerText = latestPromos.length;
    badge.style.display = 'flex';
  }

  notifList.innerHTML = latestPromos.map(promo => {
    const loja = state.comercios.find(c => c.id == promo.commerceId);
    const lojaNome = loja ? loja.nome : 'Uma Loja';
    
    return `
      <div class="notif-item unread" onclick="window.location.href='comercio.html?id=${promo.commerceId}'">
        <div class="notif-icon bg-blue"><i class='bx bxs-discount'></i></div>
        <div class="notif-text">
          <strong>Nova Oferta: ${promo.titulo}</strong>
          <p>${lojaNome} acabou de postar uma promoção por R$ ${promo.preco}.</p>
          <small>Recentemente</small>
        </div>
      </div>
    `;
  }).join('');
  
  // Adiciona item fixo de boas vindas no final
  notifList.innerHTML += `
    <div class="notif-item">
      <div class="notif-icon bg-green"><i class='bx bxl-whatsapp'></i></div>
      <div class="notif-text">
        <strong>Bem-vindo ao PromoCity!</strong>
        <p>Encontre as melhores ofertas da cidade aqui.</p>
        <small>Sistema</small>
      </div>
    </div>
  `;
}
