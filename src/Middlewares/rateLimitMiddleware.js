import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Limite de requisições excedido. Tente novamente mais tarde." }
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 15, // Limita cada IP a 15 requisições por `window` (por 15 minutos)
    message: {
        mensagem: "Muitas tentativas de login a partir deste IP, por favor tente novamente após 15 minutos."
    },
    statusCode: 429,
    standardHeaders: true, // Retorna as informações de rate limit nos cabeçalhos `RateLimit-*`
    legacyHeaders: false, // Desabilita os cabeçalhos `X-RateLimit-*`
});

export const downloadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Limita cada IP a 10 downloads por `window` (por 15 minutos)
    message: {
        mensagem: "Muitos downloads recentes a partir deste IP, por favor tente novamente após 15 minutos."
    },
    statusCode: 429,
    standardHeaders: true, 
    legacyHeaders: false, 
});

export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 10, // 10 uploads por hora
    message: {
        mensagem: "Muitas tentativas de upload a partir deste IP, por favor tente novamente após 1 hora."
    },
    statusCode: 429,
    standardHeaders: true,
    legacyHeaders: false,
});

export const createLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 50, // 50 criações por 15 min
    message: {
        mensagem: "Limite de criação de registros excedido a partir deste IP."
    },
    statusCode: 429,
    standardHeaders: true,
    legacyHeaders: false,
});
