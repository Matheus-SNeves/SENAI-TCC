document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const registerSuccess = document.getElementById('register-success');
    
    const API_URL = 'http://localhost:1243';

    const setupPasswordToggle = (inputId, iconId, openEyeSrc, closedEyeSrc) => {
        const passwordInput = document.getElementById(inputId);
        const eyeIcon = document.getElementById(iconId);

        eyeIcon.addEventListener('click', () => {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.src = openEyeSrc;
            } else {
                passwordInput.type = 'password';
                eyeIcon.src = closedEyeSrc;
            }
        });
    };

    setupPasswordToggle('login-senha', 'login-eye-icon', '../assets/olhoAberto.png', '../assets/olhoFechado.png');
    setupPasswordToggle('register-senha', 'register-eye-icon', '../assets/olhoAberto.png', '../assets/olhoFechado.png');

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('form-visible');
        loginForm.classList.add('form-hidden');
        registerForm.classList.remove('form-hidden');
        registerForm.classList.add('form-visible');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.remove('form-visible');
        registerForm.classList.add('form-hidden');
        loginForm.classList.remove('form-hidden');
        loginForm.classList.add('form-visible');
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';
        const email = document.getElementById('login-email').value;
        const senha = document.getElementById('login-senha').value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao fazer login.');
            }

            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userName', data.usuario.nome);
            window.location.href = 'home.html';

        } catch (error) {
            loginError.textContent = error.message;
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        registerError.textContent = '';
        registerSuccess.textContent = '';
        const nome = document.getElementById('register-nome').value;
        const email = document.getElementById('register-email').value;
        const senha = document.getElementById('register-senha').value;

        try {
            const response = await fetch(`${API_URL}/cadastro/cliente`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha, cpf: "00000000000", telefone: "00000000000" }) // CPF e Telefone provisórios
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao cadastrar.');
            }

            registerSuccess.textContent = 'Cadastro realizado com sucesso! Você já pode fazer o login.';
            registerForm.reset();

        } catch (error) {
            registerError.textContent = error.message;
        }
    });
});