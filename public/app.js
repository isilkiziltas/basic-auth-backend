const apiUrl = 'http://localhost:3000';  
let token = '';  

document.getElementById('signup-btn').addEventListener('click', () => {
    document.getElementById('signup-modal').style.display = 'block';
});


document.getElementById('signup-submit-btn').addEventListener('click', async () => {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    const response = await fetch(`${apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    document.getElementById('signup-message').textContent = data.message;
    if (data.success) {
        document.getElementById('signup-modal').style.display = 'none';
    }
});

document.getElementById('login-btn').addEventListener('click', () => {
    document.getElementById('login-modal').style.display = 'block';
});

document.getElementById('login-submit-btn').addEventListener('click', async () => {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.token) {
        token = data.token;
        document.getElementById('login-message').textContent = 'Giriş Başarılı!';
        document.getElementById('logout-btn').style.display = 'block';
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('private-container').style.display = 'block';
        document.getElementById('login-container').style.display = 'none';
    } else {
        document.getElementById('login-message').textContent = data.message;
    }
});


document.getElementById('get-private-data').addEventListener('click', async () => {
    const response = await fetch(`${apiUrl}/api/auth/private_route`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    document.getElementById('private-message').textContent = data.message;
});

document.getElementById('logout-btn').addEventListener('click', async () => {
    const response = await fetch(`${apiUrl}/api/auth/logout`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    token = '';  
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('private-container').style.display = 'none';
    document.getElementById('login-message').textContent = data.message;
});


document.getElementById('reset-password-btn').addEventListener('click', () => {
    document.getElementById('reset-password-modal').style.display = 'block';
});


document.getElementById('reset-password-submit-btn').addEventListener('click', async () => {
    const email = document.getElementById('reset-password-email').value;

    const response = await fetch(`${apiUrl}/api/auth/reset_password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    const data = await response.json();
    document.getElementById('reset-password-message').textContent = data.message;
    if (data.success) {
        document.getElementById('reset-password-modal').style.display = 'none';
    }
});

document.getElementById('close-login-btn').addEventListener('click', function() {
    document.getElementById('login-modal').style.display = 'none';
});

document.getElementById('close-signup-btn').addEventListener('click', function() {
    document.getElementById('signup-modal').style.display = 'none';
});

document.getElementById('close-reset-password-btn').addEventListener('click', function() {
    document.getElementById('reset-password-modal').style.display = 'none';
});