document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('.supermarkets-container');
    const genericModalOverlay = document.getElementById('generic-modal-overlay');
    let allData = {};

    // MODIFICADO: URL da API.
    const API_URL = 'https://tcc-senai-tawny.vercel.app';

    try {
        // MODIFICADO: Busca dados dos endpoints da API.
        const [supermercadosResponse, categoriasResponse] = await Promise.all([
            fetch(`${API_URL}/supermercados`),
            fetch(`${API_URL}/categorias`)
        ]);
        
        // MODIFICADO: Adaptação para a resposta da API (sem .supermercado ou .icons).
        allData.supermercados = await supermercadosResponse.json();
        allData.categorias = await categoriasResponse.json();

        if (!allData.supermercados || allData.supermercados.length === 0) {
            container.innerHTML = '<p>Nenhum supermercado encontrado.</p>';
            return;
        }

        container.innerHTML = allData.supermercados.map(store => `
            <div class="store-item" data-store-id="${store.id}">
                <img src="${store.imagem}" alt="${store.nome}">
                <div class="store-info">
                    <h3>${store.nome}</h3>
                    <p>${store.endereco}</p>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.store-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const storeId = parseInt(e.currentTarget.dataset.storeId);
                showStoreCategoriesModal(storeId);
            });
        });

    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        container.innerHTML = '<p>Não foi possível carregar os supermercados.</p>';
    }

    const showStoreCategoriesModal = (storeId) => {
        const store = allData.supermercados.find(s => s.id === storeId);
        genericModalOverlay.classList.remove('hidden');
        genericModalOverlay.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <img src="${store.imagem}" alt="${store.nome}" class="modal-logo">
                    <h2 class="modal-title">${store.nome}</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-categories">
                        ${allData.categorias.map(cat => `
                            <div class="card-item" onclick="window.location.href='produtos.html?category=${cat.chave}&storeId=${store.id}'">
                                <img src="${cat.imagem}" alt="${cat.nome}">
                                <h3>${cat.nome}</h3>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>`;
        genericModalOverlay.querySelector('.close-btn').addEventListener('click', () => {
            genericModalOverlay.classList.add('hidden');
        });
    };
});