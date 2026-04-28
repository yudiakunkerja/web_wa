// src/aiService.js
const OpenAI = require('openai');
const config = require('./config');

class AIService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: config.openai.apiKey
        });
        
        // Menyimpan konteks percakapan per user
        this.conversationHistory = new Map();
        this.maxHistoryLength = 10; // Simpan 10 pesan terakhir per user
    }

    /**
     * Mendapatkan respons AI berdasarkan pesan
     */
    async getResponse(userId, userName, message) {
        try {
            // Ambil history percakapan user
            if (!this.conversationHistory.has(userId)) {
                this.conversationHistory.set(userId, []);
            }
            
            const history = this.conversationHistory.get(userId);
            
            // Tambahkan pesan user ke history
            history.push({
                role: 'user',
                content: message
            });

            // Batasi history
            if (history.length > this.maxHistoryLength * 2) {
                history.splice(0, history.length - this.maxHistoryLength * 2);
            }

            // Buat request ke OpenAI
            const completion = await this.openai.chat.completions.create({
                model: config.openai.model,
                messages: [
                    {
                        role: 'system',
                        content: `${config.openai.systemPrompt}\n\nNama pengirim pesan: ${userName}`
                    },
                    ...history
                ],
                max_tokens: config.openai.maxTokens,
                temperature: 0.7,
                presence_penalty: 0.6,
                frequency_penalty: 0.5
            });

            const aiResponse = completion.choices[0].message.content.trim();

            // Simpan respons AI ke history
            history.push({
                role: 'assistant',
                content: aiResponse
            });

            return {
                success: true,
                response: aiResponse,
                tokensUsed: completion.usage.total_tokens
            };

        } catch (error) {
            console.error('❌ AI Service Error:', error.message);
            
            if (error.code === 'insufficient_quota') {
                return {
                    success: false,
                    response: '⚠️ Maaf, kuota AI sedang habis. Silakan coba lagi nanti.',
                    error: 'insufficient_quota'
                };
            }
            
            if (error.code === 'invalid_api_key') {
                return {
                    success: false,
                    response: '⚠️ Konfigurasi AI belum benar. Hubungi admin.',
                    error: 'invalid_api_key'
                };
            }

            return {
                success: false,
                response: '⚠️ Maaf, terjadi kesalahan. Silakan coba lagi.',
                error: error.message
            };
        }
    }

    /**
     * Reset history percakapan user tertentu
     */
    clearHistory(userId) {
        this.conversationHistory.delete(userId);
    }

    /**
     * Reset semua history
     */
    clearAllHistory() {
        this.conversationHistory.clear();
    }

    /**
     * Mendapatkan statistik
     */
    getStats() {
        return {
            activeConversations: this.conversationHistory.size,
            model: config.openai.model
        };
    }
}

module.exports = new AIService();
