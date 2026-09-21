import AuthService from '../Services/authService.js';

// Configuração do cookie — Secure apenas em produção (dev usa http://localhost)
const cookieOptions = {
    httpOnly: true,                                          // Inacessível ao JavaScript do browser
    secure: process.env.NODE_ENV === 'production',           // HTTPS obrigatório apenas em prod
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // 'lax' permite dev cross-origin
    path: '/',
    maxAge: 60 * 60 * 1000,                                 // 1 hora (em ms)
};

class AuthController {
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                const err = new Error("Email e senha são obrigatórios");
                err.statusCode = 400;
                throw err;
            }

            const token = await AuthService.login(email, password);

            res.cookie('token', token, cookieOptions);

            res.status(200).json({ message: "Login realizado com sucesso." });
        } catch (error) {
            next(error);
        }
    }

    static async logout(req, res) {
        // Sobrescreve o cookie com maxAge=0 para forçar a expiração imediata
        res.cookie('token', '', { ...cookieOptions, maxAge: 0 });
        res.status(200).json({ message: "Logout realizado com sucesso." });
    }
}

export default AuthController;
