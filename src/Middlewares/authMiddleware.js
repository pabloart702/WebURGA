import jwt from 'jsonwebtoken';

// Intercepta e verifica o JWT — lê do cookie HttpOnly (preferencial) ou Bearer header (fallback Swagger)
export const authMiddleware = (req, res, next) => {
    try {
        // 1ª prioridade: cookie HttpOnly (seguro, inacessível ao JS do browser)
        let token = req.cookies?.token;

        // 2ª prioridade: Bearer header
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const parts = authHeader.split(' ');
                if (parts.length === 2 && parts[0] === 'Bearer') {
                    token = parts[1];
                }
            }
        }

        if (!token) {
            const err = new Error("Não autenticado. Faça login para continuar.");
            err.statusCode = 401;
            throw err;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            error.message = "Sessão expirada ou inválida. Faça login novamente.";
            error.statusCode = 401;
        }
        next(error);
    }
};
