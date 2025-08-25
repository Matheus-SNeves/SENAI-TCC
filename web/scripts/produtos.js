document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('category');
    const storeId = parseInt(urlParams.get('storeId'));

    const titleElement = document.getElementById('page-title');
    const container = document.getElementById('products-container');
    const modal = document.getElementById('product-action-modal');

    if (!categoryName || !storeId) {
        titleElement.textContent = 'Informações inválidas';
        return;
    }

    try {
        const [productsResponse, supermarketsResponse] = await Promise.all([
            fetch(`../mockups/${categoryName}.json`),
            fetch('../mockups/supermercados.json')
        ]);
        
        const productsData = await productsResponse.json();
        const supermarketsData = await supermarketsResponse.json();
        
        const store = supermarketsData.supermercado.find(s => s.id === storeId);
        const categoryData = productsData[categoryName];
        
        titleElement.textContent = `Produtos em ${store.nome}`;

        if (!categoryData || categoryData.length === 0) {
            container.innerHTML = '<p>Nenhum produto encontrado nesta categoria.</p>';
            return;
        }

        container.innerHTML = '';
        categoryData.forEach(item => {
            const priceEntry = item.precos.find(p => p.supermercado_id === storeId);
            if (!priceEntry) return;

            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            
            const priceText = `R$ ${priceEntry.preco.toFixed(2).replace('.', ',')}`;
            
            productItem.innerHTML = `
                <img src="${item.imagem}" alt="${item.nome}">
                <h4>${item.nome}</h4>
                <p>${priceText}</p>
            `;

            productItem.addEventListener('click', () => {
                showProductActionModal(item, store, priceText);
            });
            container.appendChild(productItem);
        });

    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        titleElement.textContent = 'Erro ao Carregar';
        container.innerHTML = '<p>Não foi possível carregar os produtos.</p>';
    }

    function showProductActionModal(product, store, priceText) {
        modal.classList.remove('hidden');
        modal.innerHTML = `
            <div class="action-modal-content">
                <div class="action-modal-header">
                    <h3>${product.nome}</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="action-modal-body">
                    <img src="${product.imagem}" alt="${product.nome}">
                    <p>${priceText}</p>
                </div>
                <div class="action-modal-footer">
                    <button class="action-btn" id="modal-add-to-cart">Adicionar no Carrinho</button>
                    <button class="action-btn-secondary" id="modal-compare-prices">Comparar Preços</button>
                </div>
            </div>
        `;
        
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.classList.add('hidden');
        });
        
        document.getElementById('modal-add-to-cart').addEventListener('click', () => {
            addToCart(product, store);
            modal.classList.add('hidden');
        });

        document.getElementById('modal-compare-prices').addEventListener('click', () => {
            window.location.href = `comparar.html?category=${categoryName}&productId=${product.id}`;
        });
    }
});