// Firebase Auth Manager
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.userData = null;
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

        // Следим за изменением состояния аутентификации
        // Эта функция запускается при загрузке страницы и каждый раз, когда пользователь входит или выходит.
        auth.onAuthStateChanged((user) => {
            if (user) {
                // Пользователь вошел в систему
                console.log("Пользователь вошел:", user.email);
                this.currentUser = user;
                this.loadUserData(); // Загружаем данные пользователя из БД
            } else {
                // Пользователь вышел
                console.log("Пользователь вышел");
                this.currentUser = null;
                this.userData = null;
                this.showAuthPage();
            }
        });
    }

    initAuthTabs() {
        // ... (эта функция остается без изменений, как у вас была) ...
        const tabs = document.querySelectorAll('.auth-tab');
        const forms = document.querySelectorAll('.auth-form');

        const activateTab = (tabName) => {
            tabs.forEach(tab => {
                if (tab.dataset.tab === tabName) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            forms.forEach(form => {
                if (form.id === `${tabName}Form`) {
                    form.classList.add('active');
                } else {
                    form.classList.remove('active');
                }
            });
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                activateTab(tabName);
            });
        });
        activateTab('login');
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value; // ! Изменили ID на loginEmail
        const password = document.getElementById('loginPassword').value;
        const errorElement = document.getElementById('loginError');

        try {
            // Пытаемся войти с помощью Firebase Auth
            await auth.signInWithEmailAndPassword(email, password);
            errorElement.textContent = ''; // Очищаем ошибку при успехе
        } catch (error) {
            // Если ошибка, показываем понятное сообщение
            errorElement.textContent = this.getAuthErrorMessage(error.code);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value; // ! Изменили ID на registerEmail
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorElement = document.getElementById('registerError');

        if (password !== confirmPassword) {
            errorElement.textContent = 'Пароли не совпадают';
            return;
        }
        if (password.length < 6) {
            errorElement.textContent = 'Пароль должен содержать не менее 6 символов';
            return;
        }

        try {
            // 1. Создаем пользователя в Firebase Auth
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            // 2. Создаем запись о пользователе в базе данных Firestore
            await db.collection('users').doc(userCredential.user.uid).set({
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Ставим метку времени
                plan: null // Изначально плана нет
            });
            errorElement.textContent = '';
        } catch (error) {
            errorElement.textContent = this.getAuthErrorMessage(error.code);
        }
    }

    async loadUserData() {
        if (!this.currentUser) return;
        try {
            // Получаем документ с данными пользователя из коллекции 'users'
            // docID равен uid пользователя (это уникальный id, который присваивает Firebase Auth)
            const userDoc = await db.collection('users').doc(this.currentUser.uid).get();

            if (userDoc.exists) {
                // Сохраняем данные в память
                this.userData = userDoc.data();
                this.showAppPage();

                // Показываем кнопку "Загрузить план", если план уже есть
                if (this.userData.plan) {
                    this.showSavedPlanSection();
                }
            }
        } catch (error) {
            console.error("Ошибка загрузки данных пользователя:", error);
        }
    }

    async logout() {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Ошибка выхода:", error);
        }
    }

    showAuthPage() {
        document.getElementById('authPage').classList.add('active');
        document.getElementById('appPage').classList.remove('active');
    }

    showAppPage() {
        document.getElementById('authPage').classList.remove('active');
        document.getElementById('appPage').classList.add('active');
        this.updateUserGreeting();
        if (typeof initApp === 'function') {
            initApp();
        }
    }

    showSavedPlanSection() {
        const savedPlanSection = document.getElementById('savedPlanSection');
        if (savedPlanSection) {
            savedPlanSection.style.display =block';
        }
    }

    updateUserGreeting() {
        const greetingElement = document.getElementById('userGreeting');
        if (this.currentUser && greetingElement) {
            greetingElement.innerHTML = `
                <div class="user-info">
                    <span>${this.currentUser.email}, здравствуйте!</span> <!-- Используем email -->
                    <button id="logoutBtn" class="btn-logout">Выйти</button>
                </div>
            `;
            document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        }
    }

    async saveUserPlan(planData) {
        if (!this.currentUser) return;
        try {
            // Обновляем документ пользователя, добавляя в него поле 'plan'
            await db.collection('users').doc(this.currentUser.uid).update({
                plan: planData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("План успешно сохранен в Firebase!");
        } catch (error) {
            console.error("Ошибка сохранения плана:", error);
        }
    }

    async loadSavedPlan() {
        if (this.userData && this.userData.plan) {
            if (typeof loadPlan === 'function') {
                loadPlan(this.userData.plan);
            }
        }
    }

    getAuthErrorMessage(errorCode) {
        switch (errorCode) {
            case 'auth/invalid-email': return 'Неверный формат email';
            case 'auth/user-disabled': return 'Пользователь заблокирован';
            case 'auth/user-not-found': return 'Пользователь с таким email не найден';
            case 'auth/wrong-password': return 'Неверный пароль';
            case 'auth/email-already-in-use': return 'Email уже используется';
            case 'auth/operation-not-allowed': return 'Операция не разрешена';
            case 'auth/weak-password': return 'Пароль слишком простой';
            default: return 'Произошла ошибка при аутентификации';
        }
    }
}

// Инициализация менеджера аутентификации
const authManager = new AuthManager();

// Функция для сохранения плана (будет вызываться из script.js)
async function savePlan(planData) {
    await authManager.saveUserPlan(planData);
}

// Функция для загрузки плана (будет вызываться из script.js)
function loadPlan(planData) {
    if (typeof window.loadPlan === 'function') {
        window.loadPlan(planData);
    }
}