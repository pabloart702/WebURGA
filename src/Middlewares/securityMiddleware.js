import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Limite de requisições excedido. Tente novamente mais tarde." }
});

export const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutos
    max: 5, // Limita cada IP a 5 requisições por `window` (por 5 minutos)
    message: {
        mensagem: "Muitas tentativas de login a partir deste IP, por favor tente novamente após 5 minutos."
    },
    statusCode: 429,
    standardHeaders: true, // Retorna as informações de rate limit nos cabeçalhos `RateLimit-*`
    legacyHeaders: false, // Desabilita os cabeçalhos `X-RateLimit-*`
    skip: (req) => req.method === 'OPTIONS', // Ignora requisições preflight do CORS
});

export const downloadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 30, // Limita cada IP a 30 downloads por window (por 15 minutos)
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

export const securityHeadersMiddleware = (req, res, next) => {
    // Cabeçalhos de segurança essenciais para impedir XSS e Sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    res.setHeader('Content-Disposition', 'inline');
    next();
};
