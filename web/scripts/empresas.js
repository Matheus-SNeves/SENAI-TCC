document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    const API_URL = 'http://localhost:1243'; // Mude para a URL do seu backend online

    if (!token || !user || user.role !== 'ADMIN') {
        alert('Acesso negado. Faça login como administrador.');
        window.location.href = '../pages/login.html';
        return;
    }

    const currentPage = 'empresas';
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

    const renderEmpresas = async () => {
        const container = document.getElementById('empresas-content');
        const empresas = await fetchData('empresas');
        
        if (empresas && empresas.length > 0) {
            let tableHTML = '<table><thead><tr><th>ID</th><th>Nome</th><th>CNPJ</th><th>Email</th></tr></thead><tbody>';
            empresas.forEach(e => {
                tableHTML += `<tr><td>${e.id}</td><td>${e.nome}</td><td>${e.cnpj}</td><td>${e.email}</td></tr>`;
            });
            tableHTML += '</tbody></table>';
            container.innerHTML = tableHTML;
        } else {
            container.innerHTML = '<p>Nenhuma empresa encontrada.</p>';
        }
    };

    renderEmpresas();
});