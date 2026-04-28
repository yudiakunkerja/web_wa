// src/whatsappClient.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const messageHandler = require('./messageHandler');

class WhatsAppClient {
    constructor(io) {
        this.io = io;
        this.client = null;
        this.qrCodeData = null;
        this.status = 'disconnected';
        this.clientInfo = null;
        
        this.initialize();
    }

    initialize() {
        console.log('🔄 Menginisialisasi WhatsApp Client...');

        this.client = new Client({
            authStrategy: new LocalAuth({
                dataPath: './sessions'
            }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            },
            webVersionCache: {
                type: 'remote',
                remotePath: 'https://raw.githubusercontent.com/nicedream24/nicedream24/main/AltairWAJS',
            }
        });

        this.setupEventListeners();
        this.client.initialize();
    }

    setupEventListeners() {
        // Event: QR Code diterima
        this.client.on('qr', async (qr) => {
            console.log('📱 QR Code diterima! Scan dengan WhatsApp Anda.');
            this.status = 'waiting_scan';
            
            try {
                this.qrCodeData = await qrcode.toDataURL(qr, {
                    width: 300,
                    margin: 2,
                    color: {
                        dark: '#25D366',
                        light: '#FFFFFF'
                    }
                });
                
                this.emitStatus();
            } catch (err) {
                console.error('Error generating QR code:', err);
            }
        });

        // Event: Loading screen
        this.client.on('loading_screen', (percent, message) => {
            console.log(`⏳ Loading: ${percent}% - ${message}`);
            this.status = 'loading';
            this.emitStatus();
        });

        // Event: Authenticated
        this.client.on('authenticated', () => {
            console.log('✅ Autentikasi berhasil!');
            this.status = 'authenticated';
            this.qrCodeData = null;
            this.emitStatus();
        });

        // Event: Auth failure
        this.client.on('auth_failure', (msg) => {
            console.error('❌ Autentikasi gagal:', msg);
            this.status = 'auth_failure';
            this.emitStatus();
        });

        // Event: Ready
        this.client.on('ready', async () => {
            console.log('🚀 WhatsApp Bot siap digunakan!');
            this.status = 'ready';
            
            this.clientInfo = {
                name: this.client.info.pushname,
                number: this.client.info.wid.user,
                platform: this.client.info.platform
            };
            
            console.log(`📱 Terhubung sebagai: ${this.clientInfo.name} (${this.clientInfo.number})`);
            
            this.emitStatus();
        });

        // Event: Pesan masuk
        this.client.on('message', async (message) => {
            const log = await messageHandler.handleMessage(message, this.client);
            
            // Kirim update ke dashboard
            this.io.emit('new_message', {
                stats: messageHandler.getStats(),
                log: messageHandler.getMessageLog().slice(0, 20)
            });
        });

        // Event: Pesan terkirim
        this.client.on('message_create', async (message) => {
            if (message.fromMe) {
                // Log pesan keluar jika perlu
            }
        });

        // Event: Disconnected
        this.client.on('disconnected', (reason) => {
            console.log('🔌 Terputus:', reason);
            this.status = 'disconnected';
            this.clientInfo = null;
            this.emitStatus();
        });

        // Event: State changed
        this.client.on('change_state', (state) => {
            console.log('🔄 State berubah:', state);
        });
    }

    /**
     * Emit status ke semua client yang terhubung
     */
    emitStatus() {
        this.io.emit('status_update', this.getStatus());
    }

    /**
     * Dapatkan status lengkap
     */
    getStatus() {
        return {
            status: this.status,
            qrCode: this.qrCodeData,
            clientInfo: this.clientInfo,
            stats: messageHandler.getStats(),
            log: messageHandler.getMessageLog().slice(0, 20)
        };
    }

    /**
     * Logout
     */
    async logout() {
        try {
            await this.client.logout();
            this.status = 'disconnected';
            this.clientInfo = null;
            this.qrCodeData = null;
            this.emitStatus();
            return true;
        } catch (error) {
            console.error('Error logout:', error);
            return false;
        }
    }

    /**
     * Restart client
     */
    async restart() {
        try {
            await this.client.destroy();
            this.status = 'disconnected';
            this.clientInfo = null;
            this.qrCodeData = null;
            this.emitStatus();
            
            setTimeout(() => {
                this.initialize();
            }, 3000);
            
            return true;
        } catch (error) {
            console.error('Error restart:', error);
            return false;
        }
    }
}

module.exports = WhatsAppClient;
