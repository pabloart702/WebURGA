import jwt from 'jsonwebtoken';

// Intercepta e verifica o JWT
export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            const err = new Error("Token não fornecido.");
            err.statusCode = 401;
            throw err;
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            const err = new Error("Erro no formato do Token.");
            err.statusCode = 401;
            throw err;
        }

        const token = parts[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Salva o payload na requisição para ser usado depois
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            error.message = "Token inválido ou expirado.";
            error.statusCode = 401;
        }
        next(error);
    }
};
