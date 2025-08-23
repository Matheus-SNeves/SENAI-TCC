let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

function addToCart(product, supermarket) {
    const existingItem = cart.find(item => item.id === product.id && item.supermarket.id === supermarket.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1, supermarket: { id: supermarket.id, nome: supermarket.nome } });
    }
    saveCart();
    updateCartCount();
    showFeedback(`${product.nome} adicionado ao carrinho!`);
}

function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        if (totalItems > 0) {
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

function showFeedback(message) {
    if (!document.getElementById('feedback-styles')) {
        const style = document.createElement('style');
        style.id = 'feedback-styles';
        style.innerHTML = `
        .feedback-popup {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #2c2c2c;
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            z-index: 5000;
            font-size: 14px;
            animation: fadeInOut 2.5s forwards;
        }
        @keyframes fadeInOut {
            0% { opacity: 0; bottom: 0px; }
            20% { opacity: 1; bottom: 20px; }
            80% { opacity: 1; bottom: 20px; }
            100% { opacity: 0; bottom: 0px; }
        }`;
        document.head.appendChild(style);
    }

    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'feedback-popup';
    feedbackDiv.textContent = message;
    document.body.appendChild(feedbackDiv);
    setTimeout(() => {
        feedbackDiv.remove();
    }, 2500);
}

document.addEventListener('DOMContentLoaded', updateCartCount);