document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('.supermarkets-container');

    try {
        const response = await fetch('../mockups/supermercados.json');
        if (!response.ok) {
            throw new Error('JSON de supermercados não encontrado');
        }
        const data = await response.json();
        
        const supermercadosData = data.supermercado;

        if (!supermercadosData || supermercadosData.length === 0) {
            container.innerHTML = '<p>Nenhum supermercado encontrado.</p>';
            return;
        }

        supermercadosData.forEach(store => {
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
            container.appendChild(storeItem);
        });

    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        document.querySelector('#category-title').textContent = 'Erro';
        container.innerHTML = '<p>Não foi possível carregar os supermercados. Tente novamente mais tarde.</p>';
    }
});