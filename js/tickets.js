// Funcionalidad para la página de tickets

// Variables globales
let cart = [];
let cartTotal = 0;

// Productos disponibles
const products = {
    'general': { name: 'Entrada General', price: 500 },
    'taller': { name: 'Entrada + 1 Taller', price: 800 },
    'familiar': { name: 'Pase Familiar', price: 1200 },
    'compostaje': { name: 'Taller de Compostaje Casero', price: 300 },
    'huerta': { name: 'Taller de Huerta Urbana', price: 400 },
    'reciclaje': { name: 'Taller de Reciclaje Creativo', price: 350 },
    'eco-arte': { name: 'Taller para Niños: Eco-Arte', price: 200 }
};

// Función para agregar productos al carrito
function addToCart(productId, price) {
    const product = products[productId];
    if (!product) return;

    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`${product.name} agregado al carrito`);
}

// Función para remover productos del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Producto removido del carrito');
}

// Función para actualizar la cantidad de un producto
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCart();
        }
    }
}

// Función para actualizar la visualización del carrito
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        cartTotal = 0;
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = '';
        cartTotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            cartTotal += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price} x ${item.quantity}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" class="qty-btn">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" class="qty-btn">+</button>
                    </div>
                    <div class="cart-item-total">$${itemTotal}</div>
                    <button onclick="removeFromCart('${item.id}')" class="cart-item-remove" title="Remover">×</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        checkoutBtn.disabled = false;
    }

    cartTotalElement.textContent = cartTotal;
}

// Función para proceder al checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }

    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.style.display = 'block';
    
    // Scroll suave hacia el formulario
    checkoutForm.scrollIntoView({ behavior: 'smooth' });
}

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;

    // Agregar estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remover notificación después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Función para manejar el envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const formObject = {};
    
    for (let [key, value] of formData.entries()) {
        formObject[key] = value;
    }

    // Validar que todos los campos estén completos
    const requiredFields = ['nombre', 'email', 'telefono', 'evento', 'metodo-pago'];
    const missingFields = requiredFields.filter(field => !formObject[field]);
    
    if (missingFields.length > 0) {
        showNotification('Por favor completa todos los campos requeridos', 'error');
        return;
    }

    // Simular procesamiento de pago
    showNotification('Procesando tu compra...', 'success');
    
    setTimeout(() => {
        // Mostrar resumen de la compra
        const summary = `
            ¡Compra exitosa!
            
            Resumen de tu compra:
            - Total: $${cartTotal}
            - Evento: ${formObject.evento}
            - Método de pago: ${formObject.metodo-pago}
            
            Recibirás un email de confirmación en: ${formObject.email}
        `;
        
        alert(summary);
        
        // Limpiar carrito y formulario
        cart = [];
        updateCart();
        event.target.reset();
        document.getElementById('checkout-form').style.display = 'none';
        
        showNotification('¡Compra realizada con éxito!', 'success');
    }, 2000);
}

// Función para calcular descuentos (funcionalidad adicional)
function calculateDiscount(total) {
    let discount = 0;
    let discountType = '';
    
    if (total >= 2000) {
        discount = total * 0.15; // 15% de descuento
        discountType = '15%';
    } else if (total >= 1000) {
        discount = total * 0.10; // 10% de descuento
        discountType = '10%';
    } else if (total >= 500) {
        discount = total * 0.05; // 5% de descuento
        discountType = '5%';
    }
    
    return { discount, discountType };
}

// Función para aplicar descuentos
function applyDiscount() {
    const discountInfo = calculateDiscount(cartTotal);
    
    if (discountInfo.discount > 0) {
        const finalTotal = cartTotal - discountInfo.discount;
        document.getElementById('cart-total').textContent = finalTotal;
        
        // Mostrar información del descuento
        const discountElement = document.createElement('div');
        discountElement.className = 'discount-info';
        discountElement.innerHTML = `
            <p>¡Descuento aplicado: ${discountInfo.discountType}!</p>
            <p>Total con descuento: $${finalTotal}</p>
        `;
        
        const cartSummary = document.querySelector('.cart-summary');
        const existingDiscount = cartSummary.querySelector('.discount-info');
        if (existingDiscount) {
            existingDiscount.remove();
        }
        cartSummary.insertBefore(discountElement, cartSummary.firstChild);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrito
    updateCart();
    
    // Event listener para el formulario de pago
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Event listener para aplicar descuentos automáticamente
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', applyDiscount);
    }
    
    // Agregar estilos adicionales para controles de cantidad
    const additionalStyles = `
        .quantity-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .qty-btn {
            background-color: var(--color-primary);
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-weight: bold;
        }
        
        .qty-btn:hover {
            background-color: var(--color-secondary);
        }
        
        .qty-display {
            font-weight: 500;
            min-width: 20px;
            text-align: center;
        }
        
        .cart-item-actions {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .cart-item-total {
            font-weight: 600;
            color: var(--color-primary);
        }
        
        .discount-info {
            background-color: #e8f5e8;
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
            border-left: 4px solid var(--color-primary);
        }
        
        .discount-info p {
            margin: 0.25rem 0;
            color: var(--color-secondary);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
}); 