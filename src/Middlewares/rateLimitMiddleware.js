import rateLimit from 'express-rate-limit';

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
