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

        if (user.status === 'Inativo') {
            const err = new Error("Credenciais inválidas");
            err.statusCode = 401;
            throw err;
        }

        const token = jwt.sign(
            { id: user._id.toString(), email: user.email, role: user.role, departamento: user.departamento },
            process.env.JWT_SECRET,
            { expiresIn: '20m' }
        );

        return token;
    }
}

export default AuthService;
