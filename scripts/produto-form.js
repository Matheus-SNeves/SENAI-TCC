document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    const API_URL = 'http://localhost:1243';

    if (!token || !user || user.role !== 'ADMIN') {
        alert('Acesso negado.');
        window.location.href = 'admin.html';
        return;
    }

    const form = document.getElementById('produto-form');
    const formTitle = document.getElementById('form-title');
    const produtoIdInput = document.getElementById('produto-id');
    const supermercadoSelect = document.getElementById('supermercado');

    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get('id');

    const loadSupermercados = async () => {
        try {
            const response = await fetch(`${API_URL}/empresas`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const supermercados = await response.json();
            supermercadoSelect.innerHTML = '<option value="">Selecione um supermercado</option>';
            supermercados.forEach(s => {
                supermercadoSelect.innerHTML += `<option value="${s.id}">${s.nome}</option>`;
            });
        } catch (error) {
            console.error('Erro ao carregar supermercados:', error);
        }
    };

    const loadProdutoData = async () => {
        if (produtoId) {
            formTitle.textContent = 'Editar Produto';
            try {
                const response = await fetch(`${API_URL}/produtos/${produtoId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const produto = await response.json();
                
                produtoIdInput.value = produto.id;
                document.getElementById('nome').value = produto.nome;
                document.getElementById('descricao').value = produto.descricao;
                document.getElementById('preco').value = produto.preco;
                document.getElementById('quantidade').value = produto.quantidade;
                supermercadoSelect.value = produto.id_supermercado;

            } catch (error) {
                console.error('Erro ao carregar dados do produto:', error);
            }
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            nome: document.getElementById('nome').value,
            descricao: document.getElementById('descricao').value,
            preco: parseFloat(document.getElementById('preco').value),
            quantidade: parseInt(document.getElementById('quantidade').value),
            id_supermercado: parseInt(supermercadoSelect.value),
        };

        const method = produtoId ? 'PUT' : 'POST';
        const endpoint = produtoId ? `${API_URL}/produtos/${produtoId}` : `${API_URL}/produtos`;

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao salvar produto.');
            }

            alert(`Produto ${produtoId ? 'atualizado' : 'criado'} com sucesso!`);
            window.location.href = 'produtos.html';

        } catch (error) {
            alert(error.message);
        }
    });

    const init = async () => {
        await loadSupermercados();
        if (produtoId) {
            await loadProdutoData();
        }
    };

    init();
});