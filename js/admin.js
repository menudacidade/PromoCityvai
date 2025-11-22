/* --- JS DO ADMIN (CRUD COMPLETO) --- */

let editingLojaId = null;
let editingPromoId = null;

// 1. Login Simples
function checkLogin() {
  const pass = document.getElementById('adminPass').value;
  if (pass === "admin123") {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminContent').style.display = 'block';
    loadAdminData(); // Carrega as listas ao entrar
  } else {
    alert("Senha incorreta!");
  }
}

function showTab(tabName) {
  document.getElementById('tab-loja').classList.add('d-none');
  document.getElementById('tab-promo').classList.add('d-none');
  document.getElementById(`tab-${tabName}`).classList.remove('d-none');
}

// 2. Carregar Listas (Realtime Listener)
function loadAdminData() {
  if(!db) return;

  // Listen Lojas
  db.ref('comercios').on('value', (snapshot) => {
    const div = document.getElementById('listaLojas');
    div.innerHTML = '';
    
    if(!snapshot.exists()) {
      div.innerHTML = '<p>Nenhuma loja cadastrada.</p>';
      return;
    }

    snapshot.forEach((child) => {
      const key = child.key;
      const data = child.val();
      
      const item = document.createElement('div');
      item.className = 'admin-item';
      item.innerHTML = `
        <div class="admin-item-info">
          <strong>${data.nome}</strong>
          <span>${data.categoria} | ID: ${data.id}</span>
        </div>
        <div class="admin-actions">
          <button class="btn-sm btn-edit" onclick="editLoja('${key}')"><i class='bx bx-pencil'></i></button>
          <button class="btn-sm btn-delete" onclick="deleteItem('comercios', '${key}')"><i class='bx bx-trash'></i></button>
        </div>
      `;
      div.appendChild(item);
    });
  });

  // Listen Promos
  db.ref('promocoes').on('value', (snapshot) => {
    const div = document.getElementById('listaPromos');
    div.innerHTML = '';
    
    if(!snapshot.exists()) {
      div.innerHTML = '<p>Nenhuma promoção cadastrada.</p>';
      return;
    }

    snapshot.forEach((child) => {
      const key = child.key;
      const data = child.val();
      
      const item = document.createElement('div');
      item.className = 'admin-item';
      item.innerHTML = `
        <div class="admin-item-info">
          <strong>${data.titulo}</strong>
          <span>Loja ID: ${data.commerceId} | R$ ${data.preco}</span>
        </div>
        <div class="admin-actions">
          <button class="btn-sm btn-edit" onclick="editPromo('${key}')"><i class='bx bx-pencil'></i></button>
          <button class="btn-sm btn-delete" onclick="deleteItem('promocoes', '${key}')"><i class='bx bx-trash'></i></button>
        </div>
      `;
      div.appendChild(item);
    });
  });
}

// 3. Funções de Ação
window.deleteItem = (type, key) => {
  if(confirm("Tem certeza que deseja excluir este item?")) {
    db.ref(type + '/' + key).remove();
  }
}

window.editLoja = (key) => {
  db.ref('comercios/' + key).once('value').then(snap => {
    const data = snap.val();
    const form = document.getElementById('formLoja');
    
    form.nome.value = data.nome;
    form.categoria.value = data.categoria;
    form.plano.value = data.plano;
    form.telefone.value = data.telefone;
    
    editingLojaId = key;
    document.getElementById('btnCancelLoja').style.display = 'block';
    window.scrollTo(0,0);
  });
}

window.editPromo = (key) => {
  db.ref('promocoes/' + key).once('value').then(snap => {
    const data = snap.val();
    const form = document.getElementById('formPromo');
    
    form.commerceId.value = data.commerceId;
    form.titulo.value = data.titulo;
    form.preco.value = data.preco;
    form.precoOriginal.value = data.precoOriginal;
    
    editingPromoId = key;
    document.getElementById('btnCancelPromo').style.display = 'block';
    window.scrollTo(0,0);
  });
}

window.cancelEdit = (type) => {
  if(type === 'loja') {
    editingLojaId = null;
    document.getElementById('formLoja').reset();
    document.getElementById('btnCancelLoja').style.display = 'none';
  } else {
    editingPromoId = null;
    document.getElementById('formPromo').reset();
    document.getElementById('btnCancelPromo').style.display = 'none';
  }
}

// 4. Salvar/Editar LOJA
document.getElementById('formLoja').addEventListener('submit', (e) => {
  e.preventDefault();
  if(!db) { alert("Firebase não configurado!"); return; }

  const formData = new FormData(e.target);
  const logoFile = formData.get('logoFile');
  const capaFile = formData.get('capaFile');

  // Se for edição, precisamos manter a imagem antiga se não enviou nova
  db.ref('comercios/' + (editingLojaId || 'temp')).once('value').then(snap => {
    const oldData = snap.val() || {};
    
    let logoPath = oldData.logo || "https://placehold.co/200";
    if(logoFile && logoFile.name) logoPath = "assets/img/" + logoFile.name;

    let capaPath = oldData.capa || "https://placehold.co/800";
    if(capaFile && capaFile.name) capaPath = "assets/img/" + capaFile.name;

    const payload = {
      id: oldData.id || Date.now(),
      nome: formData.get('nome'),
      slug: formData.get('nome').toLowerCase().replace(/ /g, '-'),
      categoria: formData.get('categoria'),
      descricao: "Descrição padrão.",
      logo: logoPath,
      capa: capaPath,
      endereco: "Endereço a definir",
      telefone: formData.get('telefone'),
      mapa: "#",
      horario: "09h às 18h",
      plano: formData.get('plano'),
      views: oldData.views || 0,
      likes: oldData.likes || 0
    };

    if (editingLojaId) {
      // Update
      db.ref('comercios/' + editingLojaId).update(payload).then(() => {
        alert("Loja atualizada!");
        cancelEdit('loja');
      });
    } else {
      // Create
      const newRef = db.ref('comercios').push();
      newRef.set(payload).then(() => {
        alert("Loja criada!");
        e.target.reset();
      });
    }
  });
});

// 5. Salvar/Editar PROMO
document.getElementById('formPromo').addEventListener('submit', (e) => {
  e.preventDefault();
  if(!db) return;

  const formData = new FormData(e.target);
  const imgFile = formData.get('imagemFile');

  db.ref('promocoes/' + (editingPromoId || 'temp')).once('value').then(snap => {
    const oldData = snap.val() || {};
    
    let imgPath = oldData.imagem || "https://placehold.co/600";
    if(imgFile && imgFile.name) imgPath = "assets/img/" + imgFile.name;

    const payload = {
      id: oldData.id || `promo_${Date.now()}`,
      commerceId: parseInt(formData.get('commerceId')),
      titulo: formData.get('titulo'),
      descricao: "",
      preco: formData.get('preco'),
      precoOriginal: formData.get('precoOriginal'),
      imagem: imgPath,
      inicio: new Date().toISOString().split('T')[0],
      fim: "2025-12-31",
      ativa: true,
      destaque: true
    };

    if (editingPromoId) {
      db.ref('promocoes/' + editingPromoId).update(payload).then(() => {
        alert("Promoção atualizada!");
        cancelEdit('promo');
      });
    } else {
      const newRef = db.ref('promocoes').push();
      newRef.set(payload).then(() => {
        alert("Promoção criada!");
        e.target.reset();
      });
    }
  });
});
