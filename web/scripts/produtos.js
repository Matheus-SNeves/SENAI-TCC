const icons = {
    "hortifruti": "https://cdn-icons-png.flaticon.com/512/5346/5346400.png",
    "acougue": "https://cdn-icons-png.flaticon.com/512/1534/1534825.png",
    "padaria": "https://cdn-icons-png.flaticon.com/512/7547/7547106.png",
    "laticinios": "https://cdn-icons-png.flaticon.com/512/3070/3070925.png",
    "bebidas": "https://cdn-icons-png.freepik.com/256/2405/2405451.png",
    "frios": "https://cdn-icons-png.flaticon.com/512/869/869664.png",
    "limpeza": "https://cdn-icons-png.freepik.com/512/994/994928.png",
    "higiene": "https://cdn-icons-png.flaticon.com/512/11264/11264253.png"
};

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryKey = urlParams.get('category');
    const storeId = parseInt(urlParams.get('storeId'));

    const titleElement = document.getElementById('page-title');
    const container = document.getElementById('products-container');
    const modal = document.getElementById('product-action-modal');

    // MODIFICADO: URL da API
    const API_URL = 'https://tcc-senai-tawny.vercel.app';

    if (!categoryKey || !storeId) {
        titleElement.textContent = 'Informações inválidas';
        return;
    }

    try {
        // MODIFICADO: Busca produtos da categoria e os supermercados da API.
        // O endpoint de produtos pode ser otimizado no futuro para aceitar storeId.
        const [productsResponse, supermarketsResponse] = await Promise.all([
            fetch(`${API_URL}/produtos?categoria=${categoryKey}`),
            fetch(`${API_URL}/supermercados`)
        ]);
        
        const categoryProducts = await productsResponse.json();
        const allSupermarkets = await supermarketsResponse.json();
        
        const store = allSupermarkets.find(s => s.id === storeId);
        
        titleElement.textContent = `Produtos em ${store.nome}`;

        if (!categoryProducts || categoryProducts.length === 0) {
            container.innerHTML = '<p>Nenhum produto encontrado nesta categoria.</p>';
            return;
        }

        container.innerHTML = '';
        categoryProducts.forEach(item => {
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
            window.location.href = `comparar.html?category=${categoryKey}&productId=${product.id}`;
        });
    }
});