// Функции для аутентификации и управления пользователями
class AuthManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('egePlannerUsers')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('egePlannerCurrentUser')) || null;
        this.init();
    }

    init() {
        // Инициализация вкладки аутентификации
        this.initAuthTabs();

        // Обработчики форм
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));

        // Кнопка загрузки плана
        const loadPlanBtn = document.getElementById('loadPlanBtn');
        if (loadPlanBtn) {
            loadPlanBtn.addEventListener('click', () => this.loadSavedPlan());
        }

        // Проверяем, есть ли сохраненный пользователь
        if (this.currentUser) {
            this.showAppPage();
        } else {
            this.showAuthPage();
        }
    }

    initAuthTabs() {
        const tabs = document.querySelectorAll('.auth-tab');
        const forms = document.querySelectorAll('.auth-form');

        // Функция для активации вкладки
        const activateTab = (tabName) => {
            // Активируем выбранную вкладку
            tabs.forEach(tab => {
                if (tab.dataset.tab === tabName) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            // Показываем соответствующую форму
            forms.forEach(form => {
                if (form.id === `${tabName}Form`) {
                    form.classList.add('active');
                } else {
                    form.classList.remove('active');
                }
            });
        };

        // Обработчики кликов по вкладкам
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                activateTab(tabName);
            });
        });

        // Активируем вкладку входа по умолчанию
        activateTab('login');
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const errorElement = document.getElementById('loginError');

        // Поиск пользователя
        const user = this.users.find(u => u.username === username && u.password === password);

        if (user) {
            this.currentUser = user;
            localStorage.setItem('egePlannerCurrentUser', JSON.stringify(user));
            this.showAppPage();
            errorElement.textContent = '';
        } else {
            errorElement.textContent = 'Неверное имя пользователя или пароль';
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorElement = document.getElementById('registerError');

        // Валидация
        if (password !== confirmPassword) {
            errorElement.textContent = 'Пароли не совпадают';
            return;
        }

        if (password.length < 6) {
            errorElement.textContent = 'Пароль должен содержать не менее 6 символов';
            return;
        }

        // Проверка уникальности имени пользователя
        if (this.users.some(u => u.username === username)) {
            errorElement.textContent = 'Имя пользователя уже занято';
            return;
        }

        // Создание нового пользователя
        const newUser = {
            username,
            password,
            savedPlan: null
        };

        this.users.push(newUser);
        this.currentUser = newUser;

        // Сохранение в localStorage
        localStorage.setItem('egePlannerUsers', JSON.stringify(this.users));
        localStorage.setItem('egePlannerCurrentUser', JSON.stringify(newUser));

        this.showAppPage();
        errorElement.textContent = '';
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('egePlannerCurrentUser');
        this.showAuthPage();
    }

    showAuthPage() {
        document.getElementById('authPage').classList.add('active');
        document.getElementById('appPage').classList.remove('active');

        // Проверяем, есть ли у пользователя сохраненный план
        const savedPlanSection = document.getElementById('savedPlanSection');
        if (this.currentUser && this.currentUser.savedPlan && savedPlanSection) {
            savedPlanSection.style.display = 'block';
        } else if (savedPlanSection) {
            savedPlanSection.style.display = 'none';
        }
    }

    showAppPage() {
        document.getElementById('authPage').classList.remove('active');
        document.getElementById('appPage').classList.add('active');

        // Обновляем приветствие
        this.updateUserGreeting();

        // Инициализируем основное приложение
        if (typeof initApp === 'function') {
            initApp();
        }
    }

    updateUserGreeting() {
        const greetingElement = document.getElementById('userGreeting');
        if (this.currentUser && greetingElement) {
            greetingElement.innerHTML = `
                <div class="user-info">
                    <span>${this.currentUser.username}, здравствуйте!</span>
                    <button id="logoutBtn" class="btn-logout">Выйти</button>
                </div>
            `;
            document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        }
    }

    saveUserPlan(planData) {
        if (!this.currentUser) return;

        // Обновляем план текущего пользователя
        this.currentUser.savedPlan = planData;

        // Обновляем в списке пользователей
        const userIndex = this.users.findIndex(u => u.username === this.currentUser.username);
        if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
            localStorage.setItem('egePlannerUsers', JSON.stringify(this.users));
            localStorage.setItem('egePlannerCurrentUser', JSON.stringify(this.currentUser));
        }
    }

    loadSavedPlan() {
        if (this.currentUser && this.currentUser.savedPlan) {
            // Загружаем сохраненный план
            if (typeof loadPlan === 'function') {
                loadPlan(this.currentUser.savedPlan);
                this.showAppPage();
            }
        }
    }

    getUserPlan() {
        return this.currentUser ? this.currentUser.savedPlan : null;
    }
}

// Инициализация менеджера аутентификации
const authManager = new AuthManager();

// Функция для сохранения плана (будет вызываться из script.js)
function savePlan(planData) {
    authManager.saveUserPlan(planData);
}

// Функция для загрузки плана (будет вызываться из script.js)
function loadPlan(planData) {
    // Эта функция будет реализована в script.js
    console.log('Загрузка плана:', planData);
    // Вызываем функцию загрузки плана из script.js
    if (typeof window.loadPlan === 'function') {
        window.loadPlan(planData);
    }
}