import AuthService from '../Services/authService.js';

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
            res.status(200).json({ token });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
