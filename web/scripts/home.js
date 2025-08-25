document.addEventListener('DOMContentLoaded', () => {
    let allData = {};
    const mainContent = document.getElementById('main-content');
    const searchResultsContainer = document.getElementById('search-results-container');
    const searchInput = document.getElementById('search-input');
    
    const cartButton = document.getElementById('cart-button');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const genericModalOverlay = document.getElementById('generic-modal-overlay');

    const initializeApp = async () => {
        try {
            const categories = ['hortifruti', 'acougue', 'bebidas', 'frios', 'higiene', 'laticinios', 'limpeza', 'padaria'];
            const promises = [
                fetch('../mockups/icons.json'),
                fetch('../mockups/supermercados.json'),
                ...categories.map(cat => fetch(`../mockups/${cat}.json`))
            ];
            const responses = await Promise.all(promises);
            const jsonData = await Promise.all(responses.map(res => res.json()));

            allData.icons = jsonData[0].icons;
            allData.supermercados = jsonData[1].supermercado;
            allData.categoryMap = {};
            allData.allProducts = [];

            categories.forEach((catKey, index) => {
                const categoryData = jsonData[index + 2][catKey];
                allData.categoryMap[catKey] = {
                    data: categoryData,
                    icon: allData.icons[index].imagem,
                    name: allData.icons[index].nome
                };
                categoryData.forEach(p => allData.allProducts.push({ ...p, category: catKey }));
            });

            setupHomePage();
            setupEventListeners();
            updateCartUI();

        } catch (error) {
            console.error("Erro ao inicializar a aplicação:", error);
            mainContent.innerHTML = "<h1>Erro ao carregar os dados. Tente recarregar a página.</h1>";
        }
    };

    const setupHomePage = () => {
        const selecoesDiv = document.querySelector('.selecoes');
        selecoesDiv.innerHTML = Object.entries(allData.categoryMap).map(([key, value]) => `
            <div class="card-item" data-category-key="${key}">
                <img src="${value.icon}" alt="${value.name}">
                <h3>${value.name}</h3>
            </div>
        `).join('');

        const ultLojasDiv = document.querySelector('.ultLojas');
        ultLojasDiv.innerHTML = allData.supermercados.slice(0, 8).map(store => `
            <div class="store-item" data-store-id="${store.id}">
                <img src="${store.imagem}" alt="${store.nome}">
                <div class="store-info">
                    <h3>${store.nome}</h3>
                    <p>${store.endereco}</p>
                </div>
            </div>
        `).join('');
    };
    
    const setupEventListeners = () => {
        searchInput.addEventListener('input', handleSearch);
        document.getElementById('clear-search-btn').addEventListener('click', clearSearch);

        document.body.addEventListener('click', (e) => {
            const categoryCard = e.target.closest('.card-item');
            const storeCard = e.target.closest('.store-item');

            if (categoryCard && categoryCard.dataset.categoryKey) {
<<<<<<< HEAD
                showProductsModal(categoryCard.dataset.categoryKey);
=======
                showStoreCategoriesModal(null, categoryCard.dataset.categoryKey);
>>>>>>> efa47ff8736db59a86fb5827275cc5527fd1d8fd
            }
            if (storeCard && storeCard.dataset.storeId) {
                showStoreCategoriesModal(parseInt(storeCard.dataset.storeId));
            }
        });

        cartButton.addEventListener('click', toggleCart);
        closeCartBtn.addEventListener('click', toggleCart);
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) toggleCart();
        });
    };

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        if (searchTerm.length > 1) {
            const results = allData.allProducts.filter(p => p.nome.toLowerCase().includes(searchTerm));
            mainContent.classList.add('hidden');
            searchResultsContainer.classList.remove('hidden');
            document.getElementById('search-results-title').textContent = `Resultados para "${searchTerm}"`;
            
            const grid = document.getElementById('search-results-grid');
            if (results.length > 0) {
                grid.innerHTML = results.map(product => `
                    <div class="product-item" onclick="window.location.href='comparar.html?category=${product.category}&productId=${product.id}'">
                        <img src="${product.imagem}" alt="${product.nome}">
                        <h4>${product.nome}</h4>
                        <p>A partir de R$ ${product.precos[0].preco.toFixed(2).replace('.', ',')}</p>
                    </div>
                `).join('');
            } else {
                grid.innerHTML = '<p>Nenhum produto encontrado.</p>';
            }
        } else {
            clearSearch();
        }
    };

    const clearSearch = () => {
        searchInput.value = '';
        mainContent.classList.remove('hidden');
        searchResultsContainer.classList.add('hidden');
    };
    
<<<<<<< HEAD
    const showProductsModal = (categoryKey) => {
        const category = allData.categoryMap[categoryKey];
        const maxItems = 5;
        const itemsToDisplay = category.data.slice(0, maxItems);
        
        const modalContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <img src="${category.icon}" alt="${category.name}" class="modal-logo">
                    <h2 class="modal-title">${category.name}</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-products">
                        ${itemsToDisplay.map(p => {
                            const productUrl = `comparar.html?category=${categoryKey}&productId=${p.id}`;
                            return `
                                <div class="product-item" onclick="window.location.href='${productUrl}'">
                                    <img src="${p.imagem}" alt="${p.nome}">
                                    <h4>${p.nome}</h4>
                                    <p>A partir de R$ ${p.precos[0].preco.toFixed(2).replace('.', ',')}</p>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>`;
        
        genericModalOverlay.innerHTML = modalContent;
        genericModalOverlay.classList.remove('hidden');
        genericModalOverlay.querySelector('.close-btn').addEventListener('click', () => genericModalOverlay.classList.add('hidden'));
    };

=======
>>>>>>> efa47ff8736db59a86fb5827275cc5527fd1d8fd
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
                        ${Object.entries(allData.categoryMap).map(([key, value]) => `
                            <div class="card-item" onclick="window.location.href='produtos.html?category=${key}&storeId=${store.id}'">
                                <img src="${value.icon}" alt="${value.name}">
                                <h3>${value.name}</h3>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>`;
        genericModalOverlay.querySelector('.close-btn').addEventListener('click', () => {
            genericModalOverlay.classList.add('hidden');
        });
    };

    const toggleCart = () => {
        cartOverlay.classList.toggle('hidden');
    };

    const updateCartUI = () => {
        updateCartCount();
        const cartItemsContainer = document.getElementById('cart-items-container');
        const cartTotalPrice = document.getElementById('cart-total-price');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; padding: 20px;">Seu carrinho está vazio.</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map((item, index) => {
                const priceEntry = item.precos.find(p => p.supermercado_id === item.supermarket.id);
                const price = priceEntry ? priceEntry.preco : 0;
                return `
                <div class="cart-item">
                    <img src="${item.imagem}" alt="${item.nome}">
                    <div class="cart-item-details">
                        <h4>${item.nome}</h4>
                        <p class="store-name">${item.supermarket.nome}</p>
                        <div class="quantity-controls">
                            <button data-cart-index="${index}" class="decrease-qty">-</button>
                            <span>${item.quantity}</span>
                            <button data-cart-index="${index}" class="increase-qty">+</button>
                        </div>
                    </div>
                    <p class="cart-item-price">R$ ${(price * item.quantity).toFixed(2).replace('.', ',')}</p>
                </div>`;
            }).join('');
        }
        
        cartItemsContainer.querySelectorAll('.increase-qty').forEach(btn => btn.addEventListener('click', () => changeQuantity(btn.dataset.cartIndex, 1)));
        cartItemsContainer.querySelectorAll('.decrease-qty').forEach(btn => btn.addEventListener('click', () => changeQuantity(btn.dataset.cartIndex, -1)));

        const totalPrice = cart.reduce((total, item) => {
            const priceEntry = item.precos.find(p => p.supermercado_id === item.supermarket.id);
            const price = priceEntry ? priceEntry.preco : 0;
            return total + (price * item.quantity);
        }, 0);
        cartTotalPrice.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
        
        const addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
        const currentAddressSpan = document.getElementById('current-address');
        if (addresses.length > 0) {
            const firstAddress = addresses[0];
            currentAddressSpan.textContent = `${firstAddress.street}, ${firstAddress.number}`;
        } else {
            currentAddressSpan.textContent = 'Nenhum endereço cadastrado';
        }
        document.getElementById('change-address-btn').onclick = () => window.location.href = 'conta.html';
        
        if (cart.length > 0 && addresses.length > 0) {
            checkoutBtn.classList.remove('disabled');
            checkoutBtn.onclick = () => {
                localStorage.setItem('checkoutCart', JSON.stringify(cart));
                localStorage.setItem('checkoutAddress', JSON.stringify(addresses[0]));
                window.location.href = 'pagamento.html';
            };
        } else {
            checkoutBtn.classList.add('disabled');
            checkoutBtn.onclick = null;
        }
    };
    
    const changeQuantity = (index, amount) => {
        cart[index].quantity += amount;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        updateCartUI();
    };
    
    initializeApp();
});