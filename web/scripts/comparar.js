document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('category');
    const productId = urlParams.get('productId');

    const productContainer = document.querySelector('.product-details-container');
    const pricesContainer = document.querySelector('.prices-list-container');
    const actionModal = document.getElementById('action-modal');

    // MODIFICADO: URL da API.
    const API_URL = 'https://tcc-senai-tawny.vercel.app';

    if (!categoryName || !productId) {
        document.body.innerHTML = '<h1>Erro: Categoria ou produto não especificado.</h1>';
        return;
    }

    try {
        // MODIFICADO: Busca todos os produtos da categoria e todos os supermercados.
        // Uma API mais otimizada poderia ter um endpoint /produtos/:id
        const [productsResponse, supermarketsResponse] = await Promise.all([
            fetch(`${API_URL}/produtos?categoria=${categoryName}`),
            fetch(`${API_URL}/supermercados`)
        ]);

        const productsData = await productsResponse.json();
        const supermarketsData = await supermarketsResponse.json();

        // MODIFICADO: Encontra o produto na lista retornada pela API.
        const product = productsData.find(p => p.id == productId);
        
        if (!product) {
            throw new Error('Produto não encontrado');
        }

        productContainer.innerHTML = `
            <img src="${product.imagem}" alt="${product.nome}">
            <h2>${product.nome}</h2>
        `;

        const supermarketMap = new Map();
        supermarketsData.forEach(store => {
            supermarketMap.set(store.id, { id: store.id, nome: store.nome, imagem: store.imagem });
        });

        pricesContainer.innerHTML = '';
        product.precos
            .sort((a, b) => a.preco - b.preco)
            .forEach(priceEntry => {
                const storeDetails = supermarketMap.get(priceEntry.supermercado_id);
                if (storeDetails) {
                    const priceCard = document.createElement('div');
                    priceCard.className = 'price-card';
                    priceCard.innerHTML = `
                        <img src="${storeDetails.imagem}" alt="${storeDetails.nome}">
                        <div class="store-info">
                            <h3>${storeDetails.nome}</h3>
                        </div>
                        <div class="price-info">
                            R$ ${priceEntry.preco.toFixed(2).replace('.', ',')}
                        </div>
                    `;
                    priceCard.addEventListener('click', () => {
                        openActionModal(product, storeDetails, priceEntry.preco);
                    });
                    pricesContainer.appendChild(priceCard);
                }
            });

    } catch (error) {
        console.error('Erro ao carregar dados para comparação:', error);
        document.body.innerHTML = '<h1>Erro ao carregar os dados do produto.</h1>';
    }

    function openActionModal(product, store, price) {
        document.getElementById('action-modal-body').innerHTML = `
            <img src="${product.imagem}" alt="${product.nome}">
            <div>
                <p>Adicionar <strong>${product.nome}</strong></p>
                <p>do <strong>${store.nome}</strong></p>
                <p>por <strong>R$ ${price.toFixed(2).replace('.', ',')}</strong>?</p>
            </div>
        `;

        const confirmBtn = document.getElementById('action-modal-confirm');
        
        // Remove listener antigo para evitar múltiplos cliques
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        newConfirmBtn.addEventListener('click', () => {
            addToCart(product, store);
            actionModal.classList.add('hidden');
        });

        actionModal.classList.remove('hidden');
    }

    document.getElementById('action-modal-close').addEventListener('click', () => {
        actionModal.classList.add('hidden');
    });

    // Fechar modal ao clicar fora
    actionModal.addEventListener('click', (e) => {
        if (e.target === actionModal) {
            actionModal.classList.add('hidden');
        }
    });
});