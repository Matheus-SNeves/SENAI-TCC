document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('.supermarkets-container');
    const genericModalOverlay = document.getElementById('generic-modal-overlay');
    let allData = {};

    try {
        const [supermercadosResponse, iconsResponse] = await Promise.all([
            fetch('../mockups/supermercados.json'),
            fetch('../mockups/icons.json')
        ]);
        
        const supermercadosData = await supermercadosResponse.json();
        const iconsData = await iconsResponse.json();

        allData.supermercados = supermercadosData.supermercado;
        allData.icons = iconsData.icons;
        
        const iconsMapResponse = await fetch('../mockups/icons.json');
        const { icons: iconsMap } = await iconsMapResponse.json();
        const categoryKeys = ['hortifruti', 'acougue', 'bebidas', 'frios', 'higiene', 'laticinios', 'limpeza', 'padaria'];
        allData.categoryMap = {};
        iconsMap.forEach((icon, index) => {
            allData.categoryMap[icon.nome] = { file: categoryKeys[index] };
        });


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
                        ${allData.icons.map(icon => {
                            const categoryInfo = Object.values(allData.categoryMap).find(val => val.name === icon.nome) || {};
                            const categoryKey = allData.categoryMap[icon.nome]?.file;
                            return `
                                <div class="card-item" onclick="window.location.href='produtos.html?category=${categoryKey}&storeId=${store.id}'">
                                    <img src="${icon.imagem}" alt="${icon.nome}">
                                    <h3>${icon.nome}</h3>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>`;
        genericModalOverlay.querySelector('.close-btn').addEventListener('click', () => {
            genericModalOverlay.classList.add('hidden');
        });
    };
});