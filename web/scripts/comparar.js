document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('category');
    const productId = urlParams.get('productId');

    const productContainer = document.querySelector('.product-details-container');
    const pricesContainer = document.querySelector('.prices-list-container');
    const actionModal = document.getElementById('action-modal');

    if (!categoryName || !productId) {
        document.body.innerHTML = '<h1>Erro: Categoria ou produto não especificado.</h1>';
        return;
    }

    try {
        const [productsResponse, supermarketsResponse] = await Promise.all([
            fetch(`../mockups/${categoryName}.json`),
            fetch('../mockups/supermercados.json')
        ]);

        const productsData = await productsResponse.json();
        const supermarketsData = await supermarketsResponse.json();

        const product = productsData[categoryName].find(p => p.id == productId);
        
        if (!product) {
            throw new Error('Produto não encontrado');
        }

        productContainer.innerHTML = `
            <img src="${product.imagem}" alt="${product.nome}">
            <h2>${product.nome}</h2>
        `;

        const supermarketMap = new Map();
        supermarketsData.supermercado.forEach(store => {
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
        confirmBtn.onclick = () => {
            addToCart(product, store);
            actionModal.classList.add('hidden');
        };

        actionModal.classList.remove('hidden');
    }

    document.getElementById('action-modal-cancel').addEventListener('click', () => {
        actionModal.classList.add('hidden');
    });
});