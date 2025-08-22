document.addEventListener('DOMContentLoaded', () => {
    // Objeto para armazenar todos os dados carregados e evitar múltiplas buscas na rede
    let allData = {};

    /**
     * Função principal que busca todos os arquivos JSON de uma vez só
     * e armazena os dados para uso em toda a aplicação.
     */
    const fetchAllData = async () => {
        try {
            const categories = ['hortifruti', 'acougue', 'bebidas', 'frios', 'higiene', 'laticinios', 'limpeza', 'padaria'];
            const promises = [
                fetch('../mockups/icons.json'),
                fetch('../mockups/supermercados.json'),
                ...categories.map(cat => fetch(`../mockups/${cat}.json`))
            ];

            const responses = await Promise.all(promises.map(p => p.catch(e => e)));
            
            const successfulResponses = responses.filter(res => res instanceof Response && res.ok);
            if (successfulResponses.length !== promises.length) {
                console.error("Falha ao carregar um ou mais arquivos JSON.");
                return;
            }

            const jsonData = await Promise.all(successfulResponses.map(res => res.json()));

            allData.icons = jsonData[0].icons;
            allData.supermercados = jsonData[1].supermercado;
            
            // Mapeia o nome do ícone para o nome do arquivo JSON e armazena os dados dos produtos
            allData.categoryMap = {};
            allData.icons.forEach((icon, index) => {
                const categoryKey = categories[index];
                const categoryData = jsonData[index + 2][categoryKey];
                allData.categoryMap[icon.nome] = { data: categoryData, file: categoryKey };
            });

            // Após carregar todos os dados, inicia a construção da página e a funcionalidade de busca
            setupHomePage();
            setupSearch();

        } catch (error) {
            console.error("Erro fatal ao carregar os dados:", error);
        }
    };

    /**
     * Configura os elementos iniciais da página Home.
     */
    const setupHomePage = () => {
        createCategoryCards(allData.icons, allData.categoryMap);
        createStoreCards(allData.supermercados, allData.icons);
        
        document.getElementById('see-all-stores-btn').addEventListener('click', () => {
            window.location.href = 'supermercados.html';
        });
    };

    // --- LÓGICA DO MODAL DE SELEÇÕES ---
    const createCategoryCards = (icons, categoryMap) => {
        const selecoesDiv = document.querySelector('.selecoes');
        selecoesDiv.innerHTML = '';
        icons.forEach(icon => {
            const cardItem = document.createElement('div');
            cardItem.className = 'card-item';
            cardItem.innerHTML = `<img src="${icon.imagem}" alt="${icon.nome}"><h3>${icon.nome}</h3>`;
            selecoesDiv.appendChild(cardItem);

            cardItem.addEventListener('click', () => {
                const modal = document.getElementById('productsModal');
                const modalTitle = modal.querySelector('.modal-title');
                const modalLogo = modal.querySelector('.modal-logo');
                const modalBody = modal.querySelector('.modal-body');

                modalBody.innerHTML = ''; 

                const categoryInfo = categoryMap[icon.nome];
                if (!categoryInfo) return;

                modalTitle.textContent = icon.nome;
                modalLogo.src = icon.imagem;

                const maxItems = 6;
                const itemsToDisplay = categoryInfo.data.slice(0, maxItems);
                
                const productGrid = document.createElement('div');
                productGrid.className = 'modal-products'; // Usando a classe de layout de produtos

                itemsToDisplay.forEach(item => {
                    const productLink = document.createElement('a');
                    productLink.href = `comparar.html?category=${categoryInfo.file}&productId=${item.id}`;

                    const referencePrice = item.precos?.[0]?.preco;
                    const priceText = referencePrice ? `A partir de R$ ${referencePrice.toFixed(2).replace('.', ',')}` : 'Preço indisponível';
                    
                    productLink.innerHTML = `
                        <div class="product-item">
                            <img src="${item.imagem}" alt="${item.nome}">
                            <h4>${item.nome}</h4>
                            <p>${priceText}</p>
                        </div>
                    `;
                    productGrid.appendChild(productLink);
                });
                modalBody.appendChild(productGrid);

                if (categoryInfo.data.length > maxItems) {
                    const verMaisBtn = document.createElement('button');
                    verMaisBtn.textContent = 'Ver Todos os Produtos';
                    verMaisBtn.className = 'ver-mais-btn';
                    verMaisBtn.onclick = () => window.location.href = `produtos.html?category=${categoryInfo.file}`;
                    modalBody.appendChild(verMaisBtn);
                }

                modal.style.display = 'flex';
            });
        });
    };

    // --- LÓGICA DO MODAL DE SUPERMERCADOS (COM NAVEGAÇÃO INTERNA) ---
    const createStoreCards = (supermercados, icons) => {
        const ultLojasDiv = document.querySelector('.ultLojas');
        ultLojasDiv.innerHTML = '';
        supermercados.slice(0, 5).forEach(store => {
            const storeItem = document.createElement('div');
            storeItem.className = 'store-item';
            storeItem.innerHTML = `
                <img src="${store.imagem}" alt="${store.nome}">
                <h3>${store.nome}</h3>
                <p>${store.endereco}</p>`;
            ultLojasDiv.appendChild(storeItem);

            storeItem.addEventListener('click', () => showCategoriesForStore(store, icons));
        });
    };

    const showCategoriesForStore = (store, icons) => {
        const modal = document.getElementById('categoriesModal');
        const modalHeader = modal.querySelector('.modal-header');
        const modalTitle = modal.querySelector('.modal-title');
        const modalLogo = modal.querySelector('.modal-logo');
        const modalBody = modal.querySelector('.modal-body');

        // Limpa o header de possíveis botões "voltar"
        const existingBackButton = modalHeader.querySelector('.modal-back-btn');
        if (existingBackButton) {
            modalHeader.removeChild(existingBackButton);
        }

        modalTitle.textContent = store.nome;
        modalLogo.src = store.imagem;
        modalLogo.style.display = 'block';
        modalBody.innerHTML = ''; 

        const categoryGrid = document.createElement('div');
        categoryGrid.className = 'modal-categories';

        icons.forEach(icon => {
            const iconItem = document.createElement('div');
            iconItem.className = 'card-item';
            iconItem.innerHTML = `<img src="${icon.imagem}" alt="${icon.nome}"><h3>${icon.nome}</h3>`;
            categoryGrid.appendChild(iconItem);
            
            iconItem.addEventListener('click', () => showProductsForStore(store, icon));
        });
        modalBody.appendChild(categoryGrid);
        modal.style.display = 'flex';
    };
    
    const showProductsForStore = (store, icon) => {
        const modal = document.getElementById('categoriesModal');
        const modalHeader = modal.querySelector('.modal-header');
        const modalTitle = modal.querySelector('.modal-title');
        const modalLogo = modal.querySelector('.modal-logo');
        const modalBody = modal.querySelector('.modal-body');
        
        modalBody.innerHTML = '<p>Carregando produtos...</p>';
        modalLogo.style.display = 'none'; // Esconde o logo do mercado para dar espaço ao título

        // Adiciona um botão de voltar, se não existir
        if (!modalHeader.querySelector('.modal-back-btn')) {
            const backButton = document.createElement('button');
            backButton.innerHTML = '&larr;';
            backButton.className = 'modal-back-btn';
            backButton.onclick = () => showCategoriesForStore(store, allData.icons);
            modalHeader.insertBefore(backButton, modalTitle);
        }

        const categoryInfo = allData.categoryMap[icon.nome];
        if (!categoryInfo) {
            modalBody.innerHTML = '<p>Categoria não encontrada.</p>';
            return;
        }

        modalTitle.textContent = `${icon.nome}`;
        
        const productGrid = document.createElement('div');
        productGrid.className = 'modal-products';

        categoryInfo.data.forEach(product => {
            const priceEntry = product.precos.find(p => p.supermercado_id === store.id);
            const priceText = priceEntry ? `R$ ${priceEntry.preco.toFixed(2).replace('.', ',')}` : 'Indisponível nesta loja';

            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <img src="${product.imagem}" alt="${product.nome}">
                <h4>${product.nome}</h4>
                <p>${priceText}</p>
                <button class="add-to-cart-btn">Adicionar</button>
            `;
            productGrid.appendChild(productItem);
        });
        
        modalBody.innerHTML = ''; // Limpa o "Carregando"
        modalBody.appendChild(productGrid);
    };

    // --- LÓGICA DA BARRA DE PESQUISA ---
    const setupSearch = () => {
        const searchInput = document.getElementById('search-input');
        const clearSearchBtn = document.getElementById('clear-search-btn');

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            if (searchTerm.length > 2) {
                performSearch(searchTerm);
            } else {
                document.getElementById('searchModal').style.display = 'none';
            }
        });

        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            document.getElementById('searchModal').style.display = 'none';
        });
    };

    const performSearch = (searchTerm) => {
        const modal = document.getElementById('searchModal');
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = '';
        
        const results = [];
        for (const categoryName in allData.categoryMap) {
            const categoryInfo = allData.categoryMap[categoryName];
            categoryInfo.data.forEach(product => {
                if (product.nome.toLowerCase().includes(searchTerm)) {
                    results.push({ ...product, categoryFile: categoryInfo.file });
                }
            });
        }
        
        const productGrid = document.createElement('div');
        productGrid.className = 'modal-products';

        if (results.length > 0) {
            results.forEach(item => {
                const productLink = document.createElement('a');
                productLink.href = `comparar.html?category=${item.categoryFile}&productId=${item.id}`;
                const referencePrice = item.precos?.[0]?.preco;
                const priceText = referencePrice ? `A partir de R$ ${referencePrice.toFixed(2).replace('.', ',')}` : 'Preço indisponível';
                
                productLink.innerHTML = `
                    <div class="product-item">
                        <img src="${item.imagem}" alt="${item.nome}">
                        <h4>${item.nome}</h4>
                        <p>${priceText}</p>
                    </div>
                `;
                productGrid.appendChild(productLink);
            });
            modalBody.appendChild(productGrid);
        } else {
            modalBody.innerHTML = '<p style="text-align: center; width: 100%;">Nenhum produto encontrado.</p>';
        }

        modal.style.display = 'flex';
    };

    // --- FUNÇÕES GERAIS DE CONTROLE DOS MODAIS ---
    document.querySelectorAll('.modal-overlay .close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            modal.style.display = 'none';

            // Limpa o botão de voltar do modal de categorias ao fechar
            if (modal.id === 'categoriesModal') {
                const backButton = modal.querySelector('.modal-back-btn');
                if (backButton) {
                    backButton.remove();
                }
            }
        });
    });

    // Inicia o carregamento de todos os dados necessários
    fetchAllData();
});