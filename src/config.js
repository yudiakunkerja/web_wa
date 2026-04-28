// src/config.js
require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.AI_MODEL || 'gpt-3.5-turbo',
        maxTokens: parseInt(process.env.MAX_TOKENS) || 500,
        systemPrompt: process.env.AI_SYSTEM_PROMPT || 
            'Kamu adalah asisten virtual yang ramah. Jawab dengan singkat dan jelas.'
    },
    whatsapp: {
        autoReplyEnabled: process.env.AUTO_REPLY_ENABLED === 'true',
        replyToGroups: process.env.REPLY_TO_GROUPS === 'true',
        ignoredNumbers: process.env.IGNORED_NUMBERS ? 
            process.env.IGNORED_NUMBERS.split(',').map(n => n.trim()) : [],
        replyDelay: parseInt(process.env.REPLY_DELAY) || 2000
    }
};

module.exports = config;
