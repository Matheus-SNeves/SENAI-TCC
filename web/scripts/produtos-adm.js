document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    const API_URL = 'http://localhost:1243'; // Mude para a URL do seu backend online

    if (!token || !user || user.role !== 'ADMIN') {
        alert('Acesso negado. Faça login como administrador.');
        window.location.href = '../pages/login.html';
        return;
    }

    const currentPage = 'produtos';
    document.querySelector(`.nav-item[data-page=${currentPage}]`).classList.add('active');

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '../pages/login.html';
    });

    const fetchData = async (endpoint) => {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar dados.');
            return await response.json();
        } catch (error) {
            console.error(`Erro em ${endpoint}:`, error);
            return null;
        }
    };

    const renderProdutos = async () => {
        const container = document.getElementById('produtos-content');
        const produtos = await fetchData('produtos');
        
        if (produtos && produtos.length > 0) {
            let tableHTML = '<table><thead><tr><th>ID</th><th>Nome</th><th>Preço</th><th>Supermercado</th><th>Ações</th></tr></thead><tbody>';
            produtos.forEach(p => {
                const precoFormatado = `R$ ${p.preco.toFixed(2).replace('.', ',')}`;
                tableHTML += `<tr><td>${p.id}</td><td>${p.nome}</td><td>${precoFormatado}</td><td>${p.supermercado.nome}</td><td><button>Editar</button> <button>Excluir</button></td></tr>`;
            });
            tableHTML += '</tbody></table>';
            container.innerHTML = tableHTML;
        } else {
            container.innerHTML = '<p>Nenhum produto encontrado.</p>';
        }
    };

    renderProdutos();
});