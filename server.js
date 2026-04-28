// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const config = require('./src/config');
const WhatsAppClient = require('./src/whatsappClient');
const messageHandler = require('./src/messageHandler');
const aiService = require('./src/aiService');

// Inisialisasi Express
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==================== API ROUTES ====================

// Halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: Status
app.get('/api/status', (req, res) => {
    res.json(waClient.getStatus());
});

// API: Statistics
app.get('/api/stats', (req, res) => {
    res.json(messageHandler.getStats());
});

// API: Message log
app.get('/api/logs', (req, res) => {
    res.json(messageHandler.getMessageLog());
});

// API: Toggle auto-reply
app.post('/api/toggle-autoreply', (req, res) => {
    config.whatsapp.autoReplyEnabled = !config.whatsapp.autoReplyEnabled;
    io.emit('config_update', { autoReplyEnabled: config.whatsapp.autoReplyEnabled });
    res.json({ 
        success: true, 
        autoReplyEnabled: config.whatsapp.autoReplyEnabled 
    });
});

// API: Toggle group reply
app.post('/api/toggle-groups', (req, res) => {
    config.whatsapp.replyToGroups = !config.whatsapp.replyToGroups;
    io.emit('config_update', { replyToGroups: config.whatsapp.replyToGroups });
    res.json({ 
        success: true, 
        replyToGroups: config.whatsapp.replyToGroups 
    });
});

// API: Update system prompt
app.post('/api/update-prompt', (req, res) => {
    const { prompt } = req.body;
    if (prompt) {
        config.openai.systemPrompt = prompt;
        aiService.clearAllHistory();
        res.json({ success: true, prompt });
    } else {
        res.status(400).json({ success: false, error: 'Prompt diperlukan' });
    }
});

// API: Clear AI history
app.post('/api/clear-history', (req, res) => {
    aiService.clearAllHistory();
    res.json({ success: true, message: 'Semua history percakapan telah dihapus' });
});

// API: Logout WhatsApp
app.post('/api/logout', async (req, res) => {
    const result = await waClient.logout();
    res.json({ success: result });
});

// API: Restart bot
app.post('/api/restart', async (req, res) => {
    const result = await waClient.restart();
    res.json({ success: result });
});

// API: Get config
app.get('/api/config', (req, res) => {
    res.json({
        autoReplyEnabled: config.whatsapp.autoReplyEnabled,
        replyToGroups: config.whatsapp.replyToGroups,
        systemPrompt: config.openai.systemPrompt,
        aiModel: config.openai.model,
        replyDelay: config.whatsapp.replyDelay
    });
});

// ==================== SOCKET.IO ====================

io.on('connection', (socket) => {
    console.log('🌐 Dashboard terhubung:', socket.id);
    
    // Kirim status saat ini
    socket.emit('status_update', waClient.getStatus());
    socket.emit('config_update', {
        autoReplyEnabled: config.whatsapp.autoReplyEnabled,
        replyToGroups: config.whatsapp.replyToGroups
    });

    socket.on('disconnect', () => {
        console.log('🔌 Dashboard terputus:', socket.id);
    });

    // Request refresh status
    socket.on('request_status', () => {
        socket.emit('status_update', waClient.getStatus());
    });
});

// ==================== START SERVER ====================

// Validasi API Key
if (!config.openai.apiKey || config.openai.apiKey === 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx') {
    console.warn('\n⚠️  WARNING: OpenAI API Key belum dikonfigurasi!');
    console.warn('   Edit file .env dan masukkan API Key Anda.\n');
}

// Start server
server.listen(config.port, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║     🤖 WhatsApp AI Auto-Reply Bot           ║
║                                              ║
║     Dashboard: http://localhost:${config.port}        ║
║     Status: Starting...                      ║
╚══════════════════════════════════════════════╝
    `);
});

// Inisialisasi WhatsApp Client
const waClient = new WhatsAppClient(io);

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Mematikan bot...');
    try {
        await waClient.client.destroy();
    } catch (e) {}
    process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});
