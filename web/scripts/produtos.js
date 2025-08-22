document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('category');

    if (!categoryName) {
        document.querySelector('#category-title').textContent = 'Categoria não encontrada';
        return;
    }

    const titleElement = document.getElementById('category-title');
    const container = document.querySelector('.products-container');

    try {
        const response = await fetch(`../mockups/${categoryName}.json`);
        if (!response.ok) {
            throw new Error('JSON não encontrado para a categoria');
        }
        const data = await response.json();

        titleElement.textContent = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

        const categoryData = data[categoryName];

        if (!categoryData || categoryData.length === 0) {
            container.innerHTML = '<p>Nenhum produto encontrado nesta categoria.</p>';
            return;
        }

        categoryData.forEach(item => {
        // Cria um link <a> que envolve todo o card do produto
        const productLink = document.createElement('a');
        productLink.href = `comparar.html?category=${categoryName}&productId=${item.id}`;
        productLink.className = 'product-link'; // Adicionamos uma classe para estilização

        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        const productImg = document.createElement('img');
        productImg.src = item.imagem;
        productImg.alt = item.nome;

        const productName = document.createElement('h4');
        productName.textContent = item.nome;

        const productPrice = document.createElement('p');
        // Mostra o preço do primeiro supermercado na lista como referência
        // Usamos ?. para evitar erro se o array de preços estiver vazio
        const referencePrice = item.precos?.[0]?.preco;
        productPrice.textContent = referencePrice ? `A partir de R$ ${referencePrice.toFixed(2).replace('.', ',')}` : 'Preço indisponível';

        productItem.appendChild(productImg);
        productItem.appendChild(productName);
        productItem.appendChild(productPrice);

        // Adiciona o item dentro do link
        productLink.appendChild(productItem);

        // Adiciona o link ao container principal
        container.appendChild(productLink);
    });

    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        titleElement.textContent = 'Erro ao carregar a categoria';
        container.innerHTML = '<p>Não foi possível carregar os produtos. Tente novamente mais tarde.</p>';
    }
});