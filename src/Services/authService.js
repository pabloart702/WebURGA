import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserService from './userService.js';

class AuthService {
    static async login(email, password) {
        const user = await UserService.findByEmail(email);
        
        const isMatch = user ? await bcrypt.compare(password, user.password) : false;
        
        if (!isMatch) {
            const err = new Error("Credenciais inválidas");
            err.statusCode = 401;
            throw err;
        }

        if (user.status === 'INATIVO') {
            const err = new Error("Acesso negado. O seu usuário está inativo no sistema.");
            err.statusCode = 403; // 403 Forbidden
            throw err;
        }

        const token = jwt.sign(
            { id: user._id.toString(), email: user.email, role: user.role, departamento: user.departamento },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return token;
    }
}

export default AuthService;
