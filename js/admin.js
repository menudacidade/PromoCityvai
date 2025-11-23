/* --- JS DO ADMIN (CRUD COMPLETO COM UPLOAD) --- */

// Variáveis de estado para controlar a edição
let editingLojaId = null;
let editingPromoId = null;
let editingStoryId = null;

// Referência ao Firebase Storage
const storage = firebase.storage();

// 1. Login Simples
function checkLogin() {
  const pass = document.getElementById('adminPass').value;
  if (pass === "admin123") {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminContent').style.display = 'block';
    loadAdminData(); // Carrega todas as listas ao entrar
  } else {
    alert("Senha incorreta!");
  }
}

// 2. Navegação por Abas
function showTab(tabName) {
  // Esconde todas as abas
  document.querySelectorAll('.admin-tab-content').forEach(tab => tab.classList.add('d-none'));
  // Mostra a aba clicada
  document.getElementById(`tab-${tabName}`).classList.remove('d-none');
}

// 3. Carregar Listas (Lojas, Promoções, Stories)
function loadAdminData() {
  if (!db) return;

  // Carrega Lojas
  db.ref('comercios').on('value', (snapshot) => {
    const container = document.getElementById('listaLojas');
    container.innerHTML = '';
    if (!snapshot.exists()) {
      container.innerHTML = '<p>Nenhuma loja cadastrada.</p>';
      return;
    }
    snapshot.forEach(child => {
      const key = child.key;
      const data = child.val();
      container.innerHTML += `
        <div class="admin-item">
          <img src="${data.logo}" class="admin-item-img">
          <div class="admin-item-info">
            <strong>${data.nome}</strong>
            <span>ID: ${data.id} | ${data.categoria}</span>
          </div>
          <div class="admin-actions">
            <button class="btn-sm btn-edit" onclick="editLoja('${key}')"><i class='bx bx-pencil'></i></button>
            <button class="btn-sm btn-delete" onclick="deleteItem('comercios', '${key}')"><i class='bx bx-trash'></i></button>
          </div>
        </div>`;
    });
  });

  // Carrega Promoções
  db.ref('promocoes').on('value', (snapshot) => {
    const container = document.getElementById('listaPromos');
    container.innerHTML = '';
    if (!snapshot.exists()) {
      container.innerHTML = '<p>Nenhuma promoção cadastrada.</p>';
      return;
    }
    snapshot.forEach(child => {
      const key = child.key;
      const data = child.val();
      container.innerHTML += `
        <div class="admin-item">
          <img src="${data.imagem}" class="admin-item-img">
          <div class="admin-item-info">
            <strong>${data.titulo}</strong>
            <span>Loja ID: ${data.commerceId} | R$ ${data.preco}</span>
          </div>
          <div class="admin-actions">
            <button class="btn-sm btn-edit" onclick="editPromo('${key}')"><i class='bx bx-pencil'></i></button>
            <button class="btn-sm btn-delete" onclick="deleteItem('promocoes', '${key}')"><i class='bx bx-trash'></i></button>
          </div>
        </div>`;
    });
  });

  // Carrega Stories
  db.ref('stories').on('value', (snapshot) => {
    const container = document.getElementById('listaStories');
    container.innerHTML = '';
    if (!snapshot.exists()) {
      container.innerHTML = '<p>Nenhum story cadastrado.</p>';
      return;
    }
    snapshot.forEach(child => {
      const key = child.key;
      const data = child.val();
      container.innerHTML += `
        <div class="admin-item">
          <img src="${data.imagem}" class="admin-item-img">
          <div class="admin-item-info">
            <strong>${data.titulo}</strong>
            <span>Loja ID: ${data.commerceId}</span>
          </div>
          <div class="admin-actions">
            <button class="btn-sm btn-edit" onclick="editStory('${key}')"><i class='bx bx-pencil'></i></button>
            <button class="btn-sm btn-delete" onclick="deleteItem('stories', '${key}')"><i class='bx bx-trash'></i></button>
          </div>
        </div>`;
    });
  });
}

// 4. Ações CRUD (Create, Read, Update, Delete)

// Função genérica para Deletar
window.deleteItem = (type, key) => {
  if (confirm("Tem certeza que deseja excluir este item? A ação não pode ser desfeita.")) {
    db.ref(`${type}/${key}`).remove()
      .then(() => alert("Item excluído com sucesso!"))
      .catch(err => alert("Erro ao excluir: " + err.message));
  }
}

// Funções para popular o formulário para Edição
window.editLoja = (key) => {
  db.ref(`comercios/${key}`).once('value').then(snap => {
    const data = snap.val();
    const form = document.getElementById('formLoja');
    form.nome.value = data.nome;
    form.categoria.value = data.categoria;
    form.plano.value = data.plano;
    form.telefone.value = data.telefone;
    
    editingLojaId = key;
    document.getElementById('formLojaTitle').innerText = "Editando Comércio";
    document.getElementById('btnCancelLoja').style.display = 'block';
    window.scrollTo(0, 0);
  });
}

window.editPromo = (key) => {
  db.ref(`promocoes/${key}`).once('value').then(snap => {
    const data = snap.val();
    const form = document.getElementById('formPromo');
    form.commerceId.value = data.commerceId;
    form.titulo.value = data.titulo;
    form.preco.value = data.preco;
    form.precoOriginal.value = data.precoOriginal;
    
    editingPromoId = key;
    document.getElementById('formPromoTitle').innerText = "Editando Promoção";
    document.getElementById('btnCancelPromo').style.display = 'block';
    window.scrollTo(0, 0);
  });
}

window.editStory = (key) => {
  db.ref(`stories/${key}`).once('value').then(snap => {
    const data = snap.val();
    const form = document.getElementById('formStory');
    form.commerceId.value = data.commerceId;
    form.titulo.value = data.titulo;
    
    editingStoryId = key;
    document.getElementById('formStoryTitle').innerText = "Editando Story";
    document.getElementById('btnCancelStory').style.display = 'block';
    window.scrollTo(0, 0);
  });
}

// Função genérica para Cancelar Edição
window.cancelEdit = (type) => {
  if (type === 'loja') {
    editingLojaId = null;
    document.getElementById('formLoja').reset();
    document.getElementById('formLojaTitle').innerText = "Cadastrar Novo Comércio";
    document.getElementById('btnCancelLoja').style.display = 'none';
  } else if (type === 'promo') {
    editingPromoId = null;
    document.getElementById('formPromo').reset();
    document.getElementById('formPromoTitle').innerText = "Cadastrar Nova Promoção";
    document.getElementById('btnCancelPromo').style.display = 'none';
  } else if (type === 'story') {
    editingStoryId = null;
    document.getElementById('formStory').reset();
    document.getElementById('formStoryTitle').innerText = "Adicionar Novo Story";
    document.getElementById('btnCancelStory').style.display = 'none';
  }
}

// 5. Lógica de Upload e Salvamento

// Helper para fazer upload de arquivo e retornar a URL
async function uploadFile(file) {
  if (!file) return null;
  const ref = storage.ref(`images/${Date.now()}_${file.name}`);
  const snapshot = await ref.put(file);
  return snapshot.ref.getDownloadURL();
}

// Salvar/Editar LOJA
document.getElementById('formLoja').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const logoFile = formData.get('logoFile');
  const capaFile = formData.get('capaFile');

  try {
    form.querySelector('button[type="submit"]').disabled = true;
    form.querySelector('button[type="submit"]').innerText = "Salvando...";

    const [logoUrl, capaUrl] = await Promise.all([
      uploadFile(logoFile),
      uploadFile(capaFile)
    ]);

    const oldData = editingLojaId ? (await db.ref(`comercios/${editingLojaId}`).once('value')).val() : {};

    const payload = {
      id: oldData.id || Date.now(),
      nome: formData.get('nome'),
      slug: formData.get('nome').toLowerCase().replace(/ /g, '-'),
      categoria: formData.get('categoria'),
      plano: formData.get('plano'),
      telefone: formData.get('telefone'),
      logo: logoUrl || oldData.logo || '',
      capa: capaUrl || oldData.capa || '',
      // --- Dados padrão ---
      descricao: oldData.descricao || "Descrição padrão.",
      endereco: oldData.endereco || "Endereço a definir",
      mapa: oldData.mapa || "#",
      horario: oldData.horario || "09h às 18h",
      views: oldData.views || 0,
      likes: oldData.likes || 0
    };

    const ref = editingLojaId ? db.ref(`comercios/${editingLojaId}`) : db.ref('comercios').push();
    await ref.set(payload);

    alert(`Loja ${editingLojaId ? 'atualizada' : 'criada'} com sucesso!`);
    cancelEdit('loja');

  } catch (error) {
    console.error("Erro ao salvar loja:", error);
    alert("Erro ao salvar: " + error.message);
  } finally {
    form.querySelector('button[type="submit"]').disabled = false;
    form.querySelector('button[type="submit"]').innerText = "☁️ Salvar Comércio";
  }
});

// Salvar/Editar PROMOÇÃO
document.getElementById('formPromo').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const imagemFile = formData.get('imagemFile');

  try {
    form.querySelector('button[type="submit"]').disabled = true;
    form.querySelector('button[type="submit"]').innerText = "Salvando...";

    const imageUrl = await uploadFile(imagemFile);
    const oldData = editingPromoId ? (await db.ref(`promocoes/${editingPromoId}`).once('value')).val() : {};

    const payload = {
      id: oldData.id || `promo_${Date.now()}`,
      commerceId: parseInt(formData.get('commerceId')),
      titulo: formData.get('titulo'),
      preco: formData.get('preco'),
      precoOriginal: formData.get('precoOriginal'),
      imagem: imageUrl || oldData.imagem || '',
      // --- Dados padrão ---
      descricao: oldData.descricao || "",
      inicio: oldData.inicio || new Date().toISOString().split('T')[0],
      fim: oldData.fim || "2025-12-31",
      ativa: true,
      destaque: true
    };

    const ref = editingPromoId ? db.ref(`promocoes/${editingPromoId}`) : db.ref('promocoes').push();
    await ref.set(payload);

    alert(`Promoção ${editingPromoId ? 'atualizada' : 'criada'} com sucesso!`);
    cancelEdit('promo');

  } catch (error) {
    console.error("Erro ao salvar promoção:", error);
    alert("Erro ao salvar: " + error.message);
  } finally {
    form.querySelector('button[type="submit"]').disabled = false;
    form.querySelector('button[type="submit"]').innerText = "☁️ Salvar Promoção";
  }
});

// Salvar/Editar STORY
document.getElementById('formStory').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const imagemFile = formData.get('imagemFile');

  // Validação: Imagem é obrigatória ao criar
  if (!editingStoryId && !imagemFile) {
    alert("A imagem é obrigatória para criar um novo story.");
    return;
  }

  try {
    form.querySelector('button[type="submit"]').disabled = true;
    form.querySelector('button[type="submit"]').innerText = "Salvando...";

    const imageUrl = await uploadFile(imagemFile);
    const oldData = editingStoryId ? (await db.ref(`stories/${editingStoryId}`).once('value')).val() : {};

    const payload = {
      commerceId: parseInt(formData.get('commerceId')),
      titulo: formData.get('titulo'),
      imagem: imageUrl || oldData.imagem || '',
      // --- Dados padrão ---
      id: oldData.id || `story_${Date.now()}`
    };

    const ref = editingStoryId ? db.ref(`stories/${editingStoryId}`) : db.ref('stories').push();
    await ref.set(payload);

    alert(`Story ${editingStoryId ? 'atualizado' : 'criado'} com sucesso!`);
    cancelEdit('story');

  } catch (error) {
    console.error("Erro ao salvar story:", error);
    alert("Erro ao salvar: " + error.message);
  } finally {
    form.querySelector('button[type="submit"]').disabled = false;
    form.querySelector('button[type="submit"]').innerText = "☁️ Salvar Story";
  }
});
