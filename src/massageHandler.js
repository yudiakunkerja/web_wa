// src/messageHandler.js
const aiService = require('./aiService');
const config = require('./config');

class MessageHandler {
    constructor() {
        this.stats = {
            totalMessages: 0,
            totalReplies: 0,
            totalErrors: 0,
            startTime: new Date()
        };
        this.messageLog = [];
    }

    /**
     * Handle pesan masuk
     */
    async handleMessage(message, client) {
        try {
            this.stats.totalMessages++;

            // Dapatkan info chat
            const chat = await message.getChat();
            const contact = await message.getContact();
            
            const messageInfo = {
                from: message.from,
                name: contact.pushname || contact.name || 'Unknown',
                body: message.body,
                isGroup: chat.isGroup,
                groupName: chat.isGroup ? chat.name : null,
                timestamp: new Date(),
                type: message.type
            };

            console.log(`\n📨 Pesan masuk dari: ${messageInfo.name} (${messageInfo.from})`);
            console.log(`   Isi: ${messageInfo.body}`);

            // Filter - Skip jika auto-reply dimatikan
            if (!config.whatsapp.autoReplyEnabled) {
                console.log('   ⏸️ Auto-reply dimatikan');
                this.logMessage(messageInfo, null, 'skipped_disabled');
                return;
            }

            // Filter - Skip pesan dari diri sendiri
            if (message.fromMe) {
                return;
            }

            // Filter - Skip pesan group jika tidak diizinkan
            if (chat.isGroup && !config.whatsapp.replyToGroups) {
                console.log('   ⏸️ Pesan grup diabaikan');
                this.logMessage(messageInfo, null, 'skipped_group');
                return;
            }

            // Filter - Skip nomor yang diabaikan
            if (config.whatsapp.ignoredNumbers.includes(message.from)) {
                console.log('   ⏸️ Nomor diabaikan');
                this.logMessage(messageInfo, null, 'skipped_ignored');
                return;
            }

            // Filter - Hanya proses pesan teks
            if (message.type !== 'chat') {
                const nonTextReply = '📎 Maaf, saat ini saya hanya bisa memproses pesan teks. Silakan kirim pesan dalam bentuk tulisan ya!';
                await this.sendReply(message, nonTextReply, chat);
                this.logMessage(messageInfo, nonTextReply, 'non_text');
                return;
            }

            // Filter - Skip pesan kosong
            if (!message.body || message.body.trim() === '') {
                return;
            }

            // Cek command khusus
            const command = this.checkCommand(message.body.trim().toLowerCase());
            if (command) {
                await this.handleCommand(command, message, chat, messageInfo);
                return;
            }

            // Simulasi "mengetik..."
            await chat.sendStateTyping();

            // Kirim ke AI
            console.log('   🤖 Memproses dengan AI...');
            const aiResult = await aiService.getResponse(
                message.from,
                messageInfo.name,
                message.body
            );

            // Delay agar terlihat natural
            await this.delay(config.whatsapp.replyDelay);

            // Kirim balasan
            await this.sendReply(message, aiResult.response, chat);
            
            this.stats.totalReplies++;
            
            if (aiResult.tokensUsed) {
                console.log(`   📊 Token digunakan: ${aiResult.tokensUsed}`);
            }
            
            this.logMessage(messageInfo, aiResult.response, 
                aiResult.success ? 'replied' : 'error');

        } catch (error) {
            console.error('❌ Error handling message:', error);
            this.stats.totalErrors++;
        }
    }

    /**
     * Kirim balasan
     */
    async sendReply(message, text, chat) {
        try {
            await chat.clearState();
            await message.reply(text);
            console.log(`   ✅ Balasan terkirim`);
        } catch (error) {
            console.error('   ❌ Gagal mengirim balasan:', error.message);
            // Coba kirim tanpa reply
            try {
                await chat.sendMessage(text);
                console.log(`   ✅ Balasan terkirim (tanpa quote)`);
            } catch (err) {
                console.error('   ❌ Gagal total mengirim pesan:', err.message);
            }
        }
    }

    /**
     * Cek apakah pesan adalah command
     */
    checkCommand(text) {
        const commands = {
            '!help': 'help',
            '!reset': 'reset',
            '!ping': 'ping',
            '!info': 'info'
        };
        return commands[text] || null;
    }

    /**
     * Handle command khusus
     */
    async handleCommand(command, message, chat, messageInfo) {
        let reply = '';

        switch (command) {
            case 'help':
                reply = `🤖 *WhatsApp AI Bot - Bantuan*\n\n` +
                    `Saya adalah asisten AI yang akan membalas pesan Anda secara otomatis.\n\n` +
                    `*Command tersedia:*\n` +
                    `• !help - Menampilkan bantuan\n` +
                    `• !reset - Reset percakapan\n` +
                    `• !ping - Cek apakah bot aktif\n` +
                    `• !info - Info bot\n\n` +
                    `Kirim pesan biasa untuk berbicara dengan AI 🚀`;
                break;

            case 'reset':
                aiService.clearHistory(message.from);
                reply = '🔄 Percakapan telah direset. Mulai percakapan baru!';
                break;

            case 'ping':
                reply = '🏓 Pong! Bot aktif dan siap melayani.';
                break;

            case 'info':
                const uptime = this.getUptime();
                const aiStats = aiService.getStats();
                reply = `ℹ️ *Info Bot*\n\n` +
                    `📊 Total pesan: ${this.stats.totalMessages}\n` +
                    `💬 Total balasan: ${this.stats.totalReplies}\n` +
                    `❌ Total error: ${this.stats.totalErrors}\n` +
                    `🧠 Model AI: ${aiStats.model}\n` +
                    `👥 Percakapan aktif: ${aiStats.activeConversations}\n` +
                    `⏱️ Uptime: ${uptime}`;
                break;
        }

        await this.sendReply(message, reply, chat);
        this.logMessage(messageInfo, reply, 'command');
    }

    /**
     * Log pesan untuk dashboard
     */
    logMessage(messageInfo, reply, status) {
        const log = {
            ...messageInfo,
            reply,
            status,
            timestamp: new Date().toISOString()
        };
        
        this.messageLog.unshift(log);
        
        // Batasi log 100 pesan terakhir
        if (this.messageLog.length > 100) {
            this.messageLog = this.messageLog.slice(0, 100);
        }

        return log;
    }

    /**
     * Hitung uptime
     */
    getUptime() {
        const diff = Date.now() - this.stats.startTime.getTime();
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `${hours}j ${minutes}m ${seconds}d`;
    }

    /**
     * Helper delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Dapatkan statistik
     */
    getStats() {
        return {
            ...this.stats,
            uptime: this.getUptime(),
            ai: aiService.getStats()
        };
    }

    /**
     * Dapatkan log pesan
     */
    getMessageLog() {
        return this.messageLog;
    }
}

module.exports = new MessageHandler();
