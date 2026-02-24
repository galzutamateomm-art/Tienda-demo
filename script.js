// ===== PRODUCTOS =====
const products = [
    {
        id: 1,
        name: 'Auriculares Premium',
        description: 'Sonido cristalino con cancelación de ruido',
        price: 299.99,
        stock: 15,
        emoji: '🎧'
    },
    {
        id: 2,
        name: 'Reloj Inteligente',
        description: 'Monitoreo de salud y notificaciones',
        price: 199.99,
        stock: 8,
        emoji: '⌚'
    },
    {
        id: 3,
        name: 'Cámara Web 4K',
        description: 'Perfecta para streaming y videoconferencias',
        price: 149.99,
        stock: 0,
        emoji: '📷'
    },
    {
        id: 4,
        name: 'Teclado Mecánico',
        description: 'Switches RGB con respuesta rápida',
        price: 129.99,
        stock: 22,
        emoji: '⌨️'
    },
    {
        id: 5,
        name: 'Mouse Gaming',
        description: 'Sensor de precisión 16000 DPI',
        price: 89.99,
        stock: 18,
        emoji: '🖱️'
    },
    {
        id: 6,
        name: 'Cargador Rápido',
        description: 'Carga 80% en 30 minutos',
        price: 49.99,
        stock: 35,
        emoji: '🔌'
    }
];

// ===== RENDERIZAR PRODUCTOS =====
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const stockClass = product.stock === 0 ? 'out-of-stock' : '';
        const stockText = product.stock === 0 ? 'Sin stock' : `Stock: ${product.stock}`;
        const isDisabled = product.stock === 0 ? 'disabled' : '';

        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-content">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <span class="product-stock ${stockClass}">${stockText}</span>
                </div>
                <button class="buy-button" data-product-id="${product.id}" ${isDisabled}>
                    ${product.stock === 0 ? 'Sin stock' : 'Comprar'}
                </button>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });

    attachBuyButtonListeners();
}

// ===== EVENT LISTENERS BOTONES COMPRAR =====
function attachBuyButtonListeners() {
    const buyButtons = document.querySelectorAll('.buy-button:not(:disabled)');
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const product = products.find(p => p.id === productId);
            openPurchaseModal(product);
        });
    });
}

// ===== MODAL DE COMPRA =====
const purchaseModal = document.getElementById('purchaseModal');
const closeButton = document.querySelector('.close');
const purchaseForm = document.getElementById('purchaseForm');
const deliveryMethodSelect = document.getElementById('deliveryMethod');
const deliveryFields = document.getElementById('deliveryFields');

let currentProduct = null;

function openPurchaseModal(product) {
    currentProduct = product;
    document.getElementById('modalProductImage').textContent = product.emoji;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductPrice').textContent = `$${product.price.toFixed(2)}`;
    
    // Reset form
    purchaseForm.reset();
    deliveryFields.classList.add('hidden');
    deliveryMethodSelect.value = '';
    
    purchaseModal.classList.add('active');
}

closeButton.addEventListener('click', function() {
    purchaseModal.classList.remove('active');
});

window.addEventListener('click', function(event) {
    if (event.target === purchaseModal) {
        purchaseModal.classList.remove('active');
    }
});

// Mostrar/Ocultar campos de dirección
deliveryMethodSelect.addEventListener('change', function() {
    if (this.value === 'delivery') {
        deliveryFields.classList.remove('hidden');
        document.getElementById('address').required = true;
        document.getElementById('city').required = true;
        document.getElementById('postalCode').required = true;
    } else if (this.value === 'pickup') {
        deliveryFields.classList.add('hidden');
        document.getElementById('address').required = false;
        document.getElementById('city').required = false;
        document.getElementById('postalCode').required = false;
    }
});

// ===== GENERAR NÚMERO DE ORDEN =====
function generateOrderNumber() {
    const date = new Date();
    const dateStr = date.getFullYear() + 
                    String(date.getMonth() + 1).padStart(2, '0') + 
                    String(date.getDate()).padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 100000);
    return `ORD-${dateStr}${String(randomNum).padStart(6, '0')}`;
}

// ===== ENVIAR FORMULARIO =====
purchaseForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const deliveryMethod = document.getElementById('deliveryMethod').value;
    
    const orderNumber = generateOrderNumber();
    
    // Preparar mensaje para WhatsApp
    let whatsappMessage = `Hola, me gustaría realizar una compra:\n\n`;
    whatsappMessage += `📦 Producto: ${currentProduct.name}\n`;
    whatsappMessage += `💰 Precio: $${currentProduct.price.toFixed(2)}\n`;
    whatsappMessage += `📋 Orden: ${orderNumber}\n`;
    whatsappMessage += `👤 Cliente: ${fullName}\n`;
    whatsappMessage += `📱 Teléfono: ${phone}\n`;
    whatsappMessage += `📧 Email: ${email}\n`;
    whatsappMessage += `🚚 Método: ${deliveryMethod === 'delivery' ? 'Envío a Domicilio' : 'Retiro en Local'}\n`;
    
    if (deliveryMethod === 'delivery') {
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const postalCode = document.getElementById('postalCode').value;
        whatsappMessage += `📍 Dirección: ${address}, ${city} ${postalCode}\n`;
    }

    // Cerrar modal de compra
    purchaseModal.classList.remove('active');

    // Mostrar modal de confirmación
    showConfirmationModal(orderNumber);

    // Enviar a WhatsApp después de 1.5 segundos
    setTimeout(() => {
        const whatsappLink = `https://wa.me/549XXXXXXXXXX?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappLink, '_blank');
    }, 1500);

    // Reducir stock
    currentProduct.stock--;
    renderProducts();
});

// ===== MODAL DE CONFIRMACIÓN =====
const confirmationModal = document.getElementById('confirmationModal');
const closeConfirmationButton = document.getElementById('closeConfirmation');

function showConfirmationModal(orderNumber) {
    document.getElementById('orderNumber').textContent = orderNumber;
    confirmationModal.classList.add('active');
}

closeConfirmationButton.addEventListener('click', function() {
    confirmationModal.classList.remove('active');
});

window.addEventListener('click', function(event) {
    if (event.target === confirmationModal) {
        confirmationModal.classList.remove('active');
    }
});

// ===== MOBILE MENU =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', function() {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    hamburger.classList.toggle('active');
});

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
});