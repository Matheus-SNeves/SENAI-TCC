document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('category');
    const productId = urlParams.get('productId');

    if (!categoryName || !productId) {
        document.body.innerHTML = '<h1>Erro: Categoria ou produto não especificado.</h1>';
        return;
    }

    const productContainer = document.querySelector('.product-details-container');
    const pricesContainer = document.querySelector('.prices-list-container');

    try {
        // 1. Busca os dados dos produtos e dos supermercados ao mesmo tempo
        const [productsResponse, supermarketsResponse] = await Promise.all([
            fetch(`../mockups/${categoryName}.json`),
            fetch('../mockups/supermercados.json')
        ]);

        const productsData = await productsResponse.json();
        const supermarketsData = await supermarketsResponse.json();

        // 2. Encontra o produto específico que queremos comparar
        const product = productsData[categoryName].find(p => p.id == productId);

        if (!product) {
            throw new Error('Produto não encontrado');
        }

        // 3. Exibe as informações do produto no container da esquerda
        productContainer.innerHTML = `
            <img src="${product.imagem}" alt="${product.nome}">
            <h2>${product.nome}</h2>
        `;

        // 4. Mapeia os dados dos supermercados para fácil acesso (ID -> Nome, Imagem)
        const supermarketMap = new Map();
        supermarketsData.supermercado.forEach(store => {
            supermarketMap.set(store.id, { nome: store.nome, imagem: store.imagem });
        });

        // 5. Cria os cards de preço para cada supermercado
        product.precos
            .sort((a, b) => a.preco - b.preco) // Opcional: ordena do mais barato para o mais caro
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
                    pricesContainer.appendChild(priceCard);
                }
            });

    } catch (error) {
        console.error('Erro ao carregar dados para comparação:', error);
        document.body.innerHTML = '<h1>Erro ao carregar os dados do produto.</h1>';
    }
});