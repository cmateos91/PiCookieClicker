# Pi Cookie Clicker

Un juego clicker integrado con la blockchain de Pi Network.

## Características

- 🍪 Click para ganar cookies
- 📈 Sistema de mejoras con cookies
- 💰 Mejoras premium con Pi cryptocurrency
- 👤 Autenticación con Pi Network
- 💾 Guardado de progreso por usuario
- 🎮 Interfaz simple y adictiva

## Estructura del Proyecto

```
PiCookieClicker/
├── frontend/          # Aplicación frontend
│   ├── index.html    # Página principal
│   ├── src/
│   │   ├── game.js   # Lógica del juego + Pi SDK
│   │   └── styles.css # Estilos
│   └── package.json
├── backend/           # Servidor Node.js
│   ├── server.js     # API para pagos Pi
│   ├── package.json
│   └── .env.example
└── README.md
```

## Requisitos

- Node.js v14+
- Cuenta de desarrollador en Pi Network
- Pi Browser (para testing)

## Instalación

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edita .env con tu PI_API_KEY
npm start
```

### Frontend
```bash
cd frontend
# Opción 1: Python
python3 -m http.server 8080

# Opción 2: Node.js
npx http-server -p 8080
```

## Configuración en Pi Developer Portal

1. Abre `develop.pi` en el Pi Browser
2. Registra una nueva app
3. Configura:
   - Tipo de hosting: Self hosted
   - Development URL: http://localhost:8080
   - Crea un Pi Wallet para la app

## Integración con Pi Network

### Autenticación
```javascript
const scopes = ['payments', 'username'];
const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
```

### Pagos
```javascript
Pi.createPayment({
    amount: 0.1,
    memo: 'Mega Upgrade',
    metadata: { upgradeType: 'mega' }
}, callbacks);
```

## Próximos Pasos

- [ ] Implementar base de datos real
- [ ] Añadir más tipos de mejoras
- [ ] Sistema de logros
- [ ] Tabla de líderes global
- [ ] Sonidos y efectos visuales
- [ ] Integración completa con Pi API

## Testing

1. Abre el Pi Browser
2. Ve a la URL de desarrollo de tu app
3. El juego se autenticará automáticamente
4. ¡Empieza a clickear cookies!

## Notas de Seguridad

- Nunca expongas tu PI_API_KEY en el frontend
- Valida todos los pagos en el servidor
- Implementa rate limiting para prevenir abuso# PiCookieClicker
