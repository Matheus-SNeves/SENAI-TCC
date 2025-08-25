document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('checkoutCart')) || [];
    const address = JSON.parse(localStorage.getItem('checkoutAddress')) || null;
    
    const summaryItemsDiv = document.getElementById('summary-items');
    const summaryTotalPrice = document.getElementById('summary-total-price');
    const deliveryAddressP = document.getElementById('delivery-address');
    const creditCardForm = document.getElementById('credit-card-form');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');

    if (cart.length === 0 || !address) {
        document.querySelector('.checkout-container').innerHTML = '<h1>Erro: Carrinho ou endereço não encontrados. Volte para a página inicial.</h1>';
        return;
    }

    const renderSummary = () => {
        summaryItemsDiv.innerHTML = cart.map(item => {
            return `
            <div class="summary-item">
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="summary-item-info">
                    <p>${item.quantity}x <strong>${item.nome}</strong></p>
                    <p class="store-name">${item.supermarket.nome}</p>
                </div>
            </div>`;
        }).join('');

        const totalPrice = cart.reduce((total, item) => {
            const priceEntry = item.precos.find(p => p.supermercado_id === item.supermarket.id);
            const price = priceEntry ? priceEntry.preco : 0;
            return total + (price * item.quantity);
        }, 0);

        summaryTotalPrice.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;

        deliveryAddressP.innerHTML = `
            ${address.street}, ${address.number}<br>
            ${address.neighborhood}<br>
            ${address.city}, ${address.state} - ${address.zipcode}
        `;
    };

    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'credit-card') {
                creditCardForm.classList.remove('hidden');
            } else {
                creditCardForm.classList.add('hidden');
            }
        });
    });

    confirmOrderBtn.addEventListener('click', () => {
        alert('Pedido confirmado com sucesso! Obrigado por comprar conosco.');
        
        localStorage.removeItem('checkoutCart');
        localStorage.removeItem('shoppingCart');
        
        window.location.href = 'home.html';
    });
    
    renderSummary();
});