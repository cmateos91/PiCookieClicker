const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Estado del juego en memoria (en producción usarías una base de datos)
const gameStates = {};

// Rutas
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Pi Cookie Clicker Backend Running' });
});

// Guardar estado del juego
app.post('/api/save-game', (req, res) => {
    const { userId, gameState } = req.body;
    
    if (!userId) {
        return res.status(400).json({ error: 'userId required' });
    }
    
    gameStates[userId] = {
        ...gameState,
        lastSaved: new Date()
    };
    
    res.json({ success: true, message: 'Game saved' });
});

// Cargar estado del juego
app.get('/api/load-game/:userId', (req, res) => {
    const { userId } = req.params;
    const gameState = gameStates[userId];
    
    if (!gameState) {
        return res.status(404).json({ error: 'No saved game found' });
    }
    
    res.json({ gameState });
});

// Aprobar pago de Pi
app.post('/api/payments/approve', async (req, res) => {
    const { paymentId } = req.body;
    
    try {
        // Aquí aprobarías el pago con la API de Pi
        // const response = await axios.post(
        //     `https://api.mainnet.pi/v2/payments/${paymentId}/approve`,
        //     {},
        //     {
        //         headers: {
        //             'Authorization': `Key ${process.env.PI_API_KEY}`
        //         }
        //     }
        // );
        
        // Por ahora simulamos la aprobación
        console.log('Aprobando pago:', paymentId);
        
        res.json({ 
            success: true, 
            message: 'Payment approved',
            paymentId 
        });
        
    } catch (error) {
        console.error('Error aprobando pago:', error);
        res.status(500).json({ error: 'Payment approval failed' });
    }
});

// Completar pago de Pi
app.post('/api/payments/complete', async (req, res) => {
    const { paymentId, txid } = req.body;
    
    try {
        // Aquí completarías el pago con la API de Pi
        // const response = await axios.post(
        //     `https://api.mainnet.pi/v2/payments/${paymentId}/complete`,
        //     { txid },
        //     {
        //         headers: {
        //             'Authorization': `Key ${process.env.PI_API_KEY}`
        //         }
        //     }
        // );
        
        console.log('Completando pago:', paymentId, txid);
        
        res.json({ 
            success: true, 
            message: 'Payment completed',
            paymentId,
            txid 
        });
        
    } catch (error) {
        console.error('Error completando pago:', error);
        res.status(500).json({ error: 'Payment completion failed' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Pi Cookie Clicker Backend running on port ${PORT}`);
});