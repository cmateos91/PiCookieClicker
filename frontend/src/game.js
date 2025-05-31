// Variables del juego
let cookies = 0;
let cookiesPerClick = 1;
let cookiesPerSecond = 0;
let clickUpgradeCost = 10;
let autoUpgradeCost = 50;

// Variables de Pi
let user = null;
let accessToken = null;

// Referencias DOM
const cookieCount = document.getElementById('cookie-count');
const perClick = document.getElementById('per-click');
const perSecond = document.getElementById('per-second');
const cookieButton = document.getElementById('cookie-button');
const upgradeClickBtn = document.getElementById('upgrade-click');
const upgradeAutoBtn = document.getElementById('upgrade-auto');
const upgradePiBtn = document.getElementById('upgrade-pi');
const clickCostSpan = document.getElementById('click-cost');
const autoCostSpan = document.getElementById('auto-cost');
const userSection = document.getElementById('user-section');
const usernameSpan = document.getElementById('username');
const piBalanceSpan = document.getElementById('pi-balance');

// Función para actualizar la interfaz
function updateUI() {
    cookieCount.textContent = Math.floor(cookies);
    perClick.textContent = cookiesPerClick;
    perSecond.textContent = cookiesPerSecond;
    
    // Habilitar/deshabilitar botones según cookies disponibles
    upgradeClickBtn.disabled = cookies < clickUpgradeCost;
    upgradeAutoBtn.disabled = cookies < autoUpgradeCost;
}

// Autenticación con Pi Network
async function authenticateUser() {
    try {
        const scopes = ['payments', 'username'];
        const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
        
        console.log('Autenticación exitosa:', auth);
        user = auth.user;
        accessToken = auth.accessToken;
        
        // Mostrar información del usuario
        if (user) {
            usernameSpan.textContent = user.username || 'Pioneer';
            userSection.style.display = 'block';
            upgradePiBtn.style.display = 'block';
        }
        
        // Guardar progreso en el servidor
        saveProgress();
        
    } catch (error) {
        console.error('Error de autenticación:', error);
    }
}

// Callback para pagos incompletos
function onIncompletePaymentFound(payment) {
    console.log('Pago incompleto encontrado:', payment);
    // Aquí manejarías pagos incompletos
}

// Click en la cookie
cookieButton.addEventListener('click', () => {
    cookies += cookiesPerClick;
    updateUI();
    
    // Animación visual
    cookieButton.style.transform = 'scale(0.95)';
    setTimeout(() => {
        cookieButton.style.transform = 'scale(1)';
    }, 100);
    
    // Guardar progreso periódicamente
    if (cookies % 10 === 0) {
        saveProgress();
    }
});

// Comprar mejora de click
upgradeClickBtn.addEventListener('click', () => {
    if (cookies >= clickUpgradeCost) {
        cookies -= clickUpgradeCost;
        cookiesPerClick += 1;
        clickUpgradeCost = Math.floor(clickUpgradeCost * 1.5);
        clickCostSpan.textContent = clickUpgradeCost;
        updateUI();
        saveProgress();
    }
});

// Comprar auto-clicker
upgradeAutoBtn.addEventListener('click', () => {
    if (cookies >= autoUpgradeCost) {
        cookies -= autoUpgradeCost;
        cookiesPerSecond += 1;
        autoUpgradeCost = Math.floor(autoUpgradeCost * 1.5);
        autoCostSpan.textContent = autoUpgradeCost;
        updateUI();
        saveProgress();
    }
});

// Comprar mejora con Pi
upgradePiBtn.addEventListener('click', async () => {
    if (!user) return;
    
    try {
        const payment = Pi.createPayment({
            amount: 0.1,
            memo: 'Mega Upgrade - Cookie Clicker',
            metadata: { upgradeType: 'mega' }
        }, {
            onReadyForServerApproval: (paymentId) => {
                console.log('Pago listo para aprobación:', paymentId);
                // Aquí enviarías el paymentId a tu servidor
            },
            onReadyForServerCompletion: (paymentId, txid) => {
                console.log('Pago completado:', paymentId, txid);
                // Aplicar la mejora
                cookiesPerClick *= 10;
                cookiesPerSecond *= 5;
                updateUI();
                saveProgress();
            },
            onCancel: (paymentId) => {
                console.log('Pago cancelado:', paymentId);
            },
            onError: (error, payment) => {
                console.error('Error en el pago:', error);
            }
        });
    } catch (error) {
        console.error('Error al crear pago:', error);
    }
});

// Guardar progreso (simulado - en producción sería al servidor)
function saveProgress() {
    if (user) {
        const gameState = {
            cookies,
            cookiesPerClick,
            cookiesPerSecond,
            clickUpgradeCost,
            autoUpgradeCost,
            userId: user.uid
        };
        localStorage.setItem('piCookieClicker_' + user.uid, JSON.stringify(gameState));
    }
}

// Cargar progreso
function loadProgress() {
    if (user) {
        const saved = localStorage.getItem('piCookieClicker_' + user.uid);
        if (saved) {
            const gameState = JSON.parse(saved);
            cookies = gameState.cookies || 0;
            cookiesPerClick = gameState.cookiesPerClick || 1;
            cookiesPerSecond = gameState.cookiesPerSecond || 0;
            clickUpgradeCost = gameState.clickUpgradeCost || 10;
            autoUpgradeCost = gameState.autoUpgradeCost || 50;
            
            clickCostSpan.textContent = clickUpgradeCost;
            autoCostSpan.textContent = autoUpgradeCost;
            updateUI();
        }
    }
}

// Generación automática de cookies
setInterval(() => {
    if (cookiesPerSecond > 0) {
        cookies += cookiesPerSecond / 10;
        updateUI();
    }
}, 100);

// Inicializar
window.addEventListener('load', () => {
    updateUI();
    authenticateUser();
});