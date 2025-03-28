
let users = [];

function validatePassword(password) {
    return password.length >= 6;
}

function validateEmail(email) {
    return email.includes('@') && email.includes('.');
}

document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value;
    const password = e.target.elements[1].value;
    
    if (login(email, password)) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({email: email}));
        window.location.href = 'index.html';
    } else {
        alert('Email veya şifre hatalı!');
    }
});

document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target.elements[0].value;
    const email = e.target.elements[1].value;
    const password = e.target.elements[2].value;
    const passwordConfirm = e.target.elements[3].value;
    
    if (password !== passwordConfirm) {
        alert('Şifreler eşleşmiyor!');
        return;
    }
    
    if (register(username, email, password)) {
        alert('Kayıt başarılı! Giriş yapabilirsiniz.');
        window.location.href = 'login.html';
    }
});

function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(u => u.email === email && u.password === password);
}

function register(username, email, password) {
    if (!validateEmail(email)) {
        alert('Geçerli bir email adresi giriniz!');
        return false;
    }
    
    if (!validatePassword(password)) {
        alert('Şifre en az 6 karakter olmalıdır!');
        return false;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === email)) {
        alert('Bu email adresi zaten kayıtlı!');
        return false;
    }
    
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}
