document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    const API_URL = 'http://localhost:1243';

    if (!token || !user || user.role !== 'ADMIN') {
        alert('Acesso negado. Faça login como administrador.');
        window.location.href = 'admin.html';
        return;
    }

    document.querySelector(`.nav-item[data-page=produtos]`).classList.add('active');
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = 'admin.html';
    });

    const renderProdutos = async () => {
        const container = document.getElementById('produtos-content');
        try {
            const response = await fetch(`${API_URL}/produtos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao buscar produtos.');
            
            const produtos = await response.json();
            
            if (produtos && produtos.length > 0) {
                let tableHTML = '<table><thead><tr><th>ID</th><th>Nome</th><th>Preço</th><th>Supermercado</th><th>Ações</th></tr></thead><tbody>';
                produtos.forEach(p => {
                    const precoFormatado = `R$ ${p.preco.toFixed(2).replace('.', ',')}`;
                    tableHTML += `
                        <tr>
                            <td>${p.id}</td>
                            <td>${p.nome}</td>
                            <td>${precoFormatado}</td>
                            <td>${p.supermercado ? p.supermercado.nome : 'N/A'}</td>
                            <td>
                                <button class="btn-edit" data-id="${p.id}">Editar</button>
                                <button class="btn-delete" data-id="${p.id}">Excluir</button>
                            </td>
                        </tr>`;
                });
                tableHTML += '</tbody></table>';
                container.innerHTML = tableHTML;

                container.querySelectorAll('.btn-edit').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.dataset.id;
                        window.location.href = `produto-form.html?id=${id}`;
                    });
                });
            } else {
                container.innerHTML = '<p>Nenhum produto encontrado.</p>';
            }
        } catch (error) {
            container.innerHTML = `<p>Erro ao carregar produtos: ${error.message}</p>`;
        }
    };

    renderProdutos();
});