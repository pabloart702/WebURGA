import jwt from 'jsonwebtoken';

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
    maxAge: 20 * 60 * 1000, // 20 minutos
};

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

        // Sliding Session: Atualiza o token se o usuário estiver ativo e faltar menos de 10 minutos para expirar
        if (decoded.exp) {
            const nowUnix = Math.floor(Date.now() / 1000);
            const timeToExpire = decoded.exp - nowUnix;
            
            if (timeToExpire > 0 && timeToExpire < 10 * 60) {
                const newToken = jwt.sign(
                    { id: decoded.id, email: decoded.email, role: decoded.role, departamento: decoded.departamento },
                    process.env.JWT_SECRET,
                    { expiresIn: '20m' }
                );
                
                // Se estamos usando cookies, atualiza o cookie com o novo token
                if (req.cookies?.token && typeof res.cookie === 'function') {
                    res.cookie('token', newToken, cookieOptions);
                }
            }
        }

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

// Verifica permissões com base no role do usuário (RBAC)
export function authorize(...allowedRoles) {
    return (req, res, next) => {
        try {
            const userRole = req.user.role;

            const hasPermission = allowedRoles.includes(userRole);

            if (!hasPermission) {
                const err = new Error("Acesso negado.");
                err.statusCode = 403;
                throw err;
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}
