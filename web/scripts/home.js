document.addEventListener('DOMContentLoaded', () => {
    const fetchAllData = async () => {
        const [
            iconsResponse,
            supermercadosResponse,
            hortifrutiResponse,
            acougueResponse,
            bebidasResponse,
            friosResponse,
            higieneResponse,
            laticiniosResponse,
            limpezaResponse,
            padariaResponse
        ] = await Promise.all([
            fetch('../mockups/icons.json'),
            fetch('../mockups/supermercados.json'),
            fetch('../mockups/hortifruti.json'),
            fetch('../mockups/acougue.json'),
            fetch('../mockups/bebidas.json'),
            fetch('../mockups/frios.json'),
            fetch('../mockups/higiene.json'),
            fetch('../mockups/laticinios.json'),
            fetch('../mockups/limpeza.json'),
            fetch('../mockups/padaria.json')
        ]);

        const iconsData = await iconsResponse.json();
        const supermercadosData = await supermercadosResponse.json();
        const hortifrutiData = await hortifrutiResponse.json();
        const acougueData = await acougueResponse.json();
        const bebidasData = await bebidasResponse.json();
        const friosData = await friosResponse.json();
        const higieneData = await higieneResponse.json();
        const laticiniosData = await laticiniosResponse.json();
        const limpezaData = await limpezaResponse.json();
        const padariaData = await padariaResponse.json();

        // Mapeia o nome do ícone para o nome do arquivo JSON
        const categoryMap = {
            'Hortifrúti': { data: hortifrutiData.hortifruti, file: 'hortifruti' },
            'Açougue': { data: acougueData.acougue, file: 'acougue' },
            'Bebidas': { data: bebidasData.bebidas, file: 'bebidas' },
            'Frios': { data: friosData.frios, file: 'frios' },
            'Higiene': { data: higieneData.higiene, file: 'higiene' },
            'Laticínios': { data: laticiniosData.laticinios, file: 'laticinios' },
            'Limpeza': { data: limpezaData.limpeza, file: 'limpeza' },
            'Padaria': { data: padariaData.padaria, file: 'padaria' }
        };

        createCards(iconsData.icons, categoryMap);
        createStoreSection(supermercadosData.supermercado, iconsData.icons);
        
        // Adiciona evento de clique para o novo botão de ver todos os supermercados
        document.getElementById('see-all-stores-btn').addEventListener('click', () => {
            window.location.href = 'supermercados.html';
        });
    };

    const searchInput = document.querySelector('input[type="text"]');
    const searchBtn = document.querySelector('.search-btn');

    searchBtn.addEventListener('click', () => {
        searchInput.value = '';
    });

    // Função para criar os cards de categorias (Seleções) e abrir o modal de produtos
    function createCards(icons, categoryMap) {
        const selecoesDiv = document.querySelector('.selecoes');
        selecoesDiv.innerHTML = '';
        icons.forEach(icon => {
            const cardItem = document.createElement('div');
            cardItem.className = 'card-item';
            const cardImg = document.createElement('img');
            cardImg.src = icon.imagem;
            cardImg.alt = icon.nome;
            const cardName = document.createElement('h3');
            cardName.textContent = icon.nome;
            cardItem.appendChild(cardImg);
            cardItem.appendChild(cardName);
            selecoesDiv.appendChild(cardItem);

            cardItem.addEventListener('click', () => {
                const modal = document.getElementById('productsModal');
                const modalTitle = document.querySelector('#productsModal .modal-title');
                const modalLogo = document.querySelector('#productsModal .modal-logo');
                const modalSections = document.querySelector('#productsModal .modal-products');

                modalSections.innerHTML = '';

                const categoryInfo = categoryMap[icon.nome];
                const data = categoryInfo ? categoryInfo.data : [];
                const maxItems = 4;
                const itemsToDisplay = data.slice(0, maxItems);

                modalTitle.textContent = icon.nome;
                modalLogo.src = icon.imagem;
                
                itemsToDisplay.forEach(item => {
                    const productItem = document.createElement('div');
                    productItem.className = 'product-item';
                    const productImg = document.createElement('img');
                    productImg.src = item.imagem;
                    productImg.alt = item.nome;
                    const productName = document.createElement('h4');
                    productName.textContent = item.nome;
                    const productPrice = document.createElement('p');
                    productPrice.textContent = `R$ ${item.preco.toFixed(2)}`;
                    productItem.appendChild(productImg);
                    productItem.appendChild(productName);
                    productItem.appendChild(productPrice);
                    modalSections.appendChild(productItem);
                });

                // Adiciona o botão "Ver Mais" se houver mais de 4 produtos
                if (data.length > maxItems) {
                    const verMaisBtn = document.createElement('button');
                    verMaisBtn.textContent = 'Ver Mais';
                    verMaisBtn.className = 'ver-mais-btn';
                    verMaisBtn.addEventListener('click', () => {
                        window.location.href = `produtos.html?category=${categoryInfo.file}`;
                    });
                    modalSections.appendChild(verMaisBtn);
                }

                modal.style.display = 'flex';
            });
        });
    }

    // Função para criar os cards das lojas e abrir o modal de categorias
    function createStoreSection(supermercados, icons) {
        const ultLojasDiv = document.querySelector('.ultLojas');
        if (ultLojasDiv) {
            ultLojasDiv.innerHTML = '';
            supermercados.slice(0, 5).forEach(store => {
                const storeItem = document.createElement('div');
                storeItem.className = 'store-item';
                const storeImg = document.createElement('img');
                storeImg.src = store.imagem;
                storeImg.alt = store.nome;
                const storeName = document.createElement('h3');
                storeName.textContent = store.nome;
                const storeAddress = document.createElement('p');
                storeAddress.textContent = store.endereco;
                storeItem.appendChild(storeImg);
                storeItem.appendChild(storeName);
                storeItem.appendChild(storeAddress);
                ultLojasDiv.appendChild(storeItem);

                // Evento de clique para abrir o modal de categorias
                storeItem.addEventListener('click', () => {
                    const modal = document.getElementById('categoriesModal');
                    const modalTitle = document.querySelector('#categoriesModal .modal-title');
                    const modalLogo = document.querySelector('#categoriesModal .modal-logo');
                    const modalSections = document.querySelector('#categoriesModal .modal-categories');

                    modalSections.innerHTML = '';

                    modalTitle.textContent = store.nome;
                    modalLogo.src = store.imagem;

                    icons.forEach(icon => {
                        const iconItem = document.createElement('div');
                        iconItem.className = 'card-item';
                        const iconImg = document.createElement('img');
                        iconImg.src = icon.imagem;
                        iconImg.alt = icon.nome;
                        const iconName = document.createElement('h3');
                        iconName.textContent = icon.nome;
                        iconItem.appendChild(iconImg);
                        iconItem.appendChild(iconName);
                        modalSections.appendChild(iconItem);
                    });
                    modal.style.display = 'flex';
                });
            });
        }
    }

    // Fecha o modal de categorias
    document.querySelector('#categoriesModal .close-btn').addEventListener('click', () => {
        document.getElementById('categoriesModal').style.display = 'none';
    });

    // Fecha o modal de produtos
    document.querySelector('#productsModal .close-btn').addEventListener('click', () => {
        document.getElementById('productsModal').style.display = 'none';
    });

    fetchAllData();
});