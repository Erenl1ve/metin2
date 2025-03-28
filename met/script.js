const products = [
    {
        id: 1,
        name: "10.000 GB Won",
        price: 1000,
        image: "https://i.imgur.com/8kPsX0i.png",
        category: "GB Won"
    },
    {
        id: 2,
        name: "25.000 EP Won",
        price: 2500,
        image: "https://i.imgur.com/8kPsX0i.png",
        category: "EP Won"
    },
    {
        id: 3,
        name: "100M Yang",
        price: 150,
        image: "https://i.imgur.com/8kPsX0i.png",
        category: "Yang"
    },
    {
        id: 4,
        name: "Ejder Kılıcı",
        price: 5000,
        image: "https://i.imgur.com/8kPsX0i.png",
        category: "Item"
    }
];

let cart = [];
let isLoggedIn = false;
let currentUser = null;

// Kullanıcı veritabanı simülasyonu
const users = [];

function validatePassword(password) {
    return password.length >= 6;
}

function validateEmail(email) {
    return email.includes('@') && email.includes('.');
}

function displayProducts(category = 'all') {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        if (category === 'all' || product.category === category) {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="content">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price} TL</p>
                    <button onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Satın Al
                    </button>
                </div>
            `;
            productGrid.appendChild(productCard);
        }
    });
}

function addToCart(productId) {
    if (!isLoggedIn) {
        showModal('loginModal');
        return;
    }

    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCartCount();
    updateCartDisplay();
    showNotification(`${product.name} sepete eklendi!`);
}

function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        isLoggedIn = true;
        currentUser = user;
        return true;
    }
    return false;
}

function register(username, email, password) {
    if (!validateEmail(email)) {
        showNotification('Geçerli bir email adresi giriniz!');
        return false;
    }

    if (!validatePassword(password)) {
        showNotification('Şifre en az 6 karakter olmalıdır!');
        return false;
    }

    if (users.some(u => u.email === email)) {
        showNotification('Bu email adresi zaten kayıtlı!');
        return false;
    }

    users.push({ username, email, password });
    return true;
}


function updateNavigation() {
    const navLinks = document.querySelector('.nav-links');
    if (isLoggedIn) {
        navLinks.innerHTML = `
            <a href="#" id="profileBtn"><i class="fas fa-user"></i> ${currentUser.username}</a>
            <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Çıkış</a>
            <a href="#" id="cartBtn"><i class="fas fa-shopping-cart"></i> <span id="cartCount">0</span></a>
        `;

        document.getElementById('logoutBtn').addEventListener('click', logout);
    }
}

function logout() {
    isLoggedIn = false;
    currentUser = null;
    cart = [];
    updateCartCount();
    location.reload();
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    let total = 0;

    if (cartItems) {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            total += item.price;
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <span>${item.name}</span>
                <span>${item.price} TL</span>
            `;
            cartItems.appendChild(itemElement);
        });

        if (cartTotal) {
            cartTotal.textContent = total.toFixed(2) + ' TL';
        }
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function showNotification(message) {
    alert(message); // Basit bildirim için alert kullanıyoruz
}


// Sepet düğmesi için event listener
const cartBtn = document.getElementById('cartBtn');
if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        showModal('cartModal');
        updateCartDisplay();
    });
}

// Initialize
displayProducts();
updateCartCount();

// Category filtering
document.querySelectorAll('.categories a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.categories a.active').classList.remove('active');
        e.target.classList.add('active');
        displayProducts(e.target.textContent === 'Tüm Paketler' ? 'all' : e.target.textContent);
    });
});