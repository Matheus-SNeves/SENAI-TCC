document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    const API_URL = 'http://localhost:1243'; // Mude para a URL do seu backend online

    if (!token || !user || user.role !== 'ADMIN') {
        alert('Acesso negado. Faça login como administrador.');
        window.location.href = '../pages/login.html';
        return;
    }

    const currentPage = 'clientes';
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

    const renderClientes = async () => {
        const container = document.getElementById('clientes-content');
        const clientes = await fetchData('clientes');
        
        if (clientes && clientes.length > 0) {
            let tableHTML = '<table><thead><tr><th>ID</th><th>Nome</th><th>Email</th><th>CPF</th><th>Telefone</th></tr></thead><tbody>';
            clientes.forEach(c => {
                tableHTML += `<tr><td>${c.id}</td><td>${c.nome}</td><td>${c.email}</td><td>${c.cpf || 'N/A'}</td><td>${c.telefone || 'N/A'}</td></tr>`;
            });
            tableHTML += '</tbody></table>';
            container.innerHTML = tableHTML;
        } else {
            container.innerHTML = '<p>Nenhum cliente encontrado.</p>';
        }
    };

    renderClientes();
});