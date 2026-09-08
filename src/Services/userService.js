import UserRepository from "../Repositories/userRepository.js";
import bcrypt from 'bcrypt';

class UserService {
    static async findAll(page, searchTerm, departamento) {
        if (!page || page < 1) page = 1;
        const users = await UserRepository.findAll(page, searchTerm, departamento);
        return users;
    }

    static async findById(id) {
        const user = await UserRepository.findById(id);
        if (!user) {
            const err = new Error("Usuário não encontrado.");
            err.statusCode = 404;
            throw err;
        }
        return user;
    }

    static async findByEmail(email) {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            const err = new Error("Email não encontrado.");
            err.statusCode = 404;
            throw err;
        }
        return user;
    }

    static async create(userData) {
        // Regras de negócio
        const userByCpf = await UserRepository.findByCpf(userData.cpf);
        if (userByCpf) {
            const err = new Error("Já existe um usuário cadastrado com este CPF.");
            err.statusCode = 400;
            throw err;
        }

        const userByNome = await UserRepository.findByNome(userData.nome);
        if (userByNome) {
            const err = new Error("Já existe um usuário cadastrado com este Nome.");
            err.statusCode = 400;
            throw err;
        }

        const userByMatricula = await UserRepository.findByMatricula(userData.matricula);
        if (userByMatricula) {
            const err = new Error("Já existe um usuário cadastrado com esta Matrícula.");
            err.statusCode = 400;
            throw err;
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
        userData.password = await bcrypt.hash(userData.password, saltRounds);

        return await UserRepository.create(userData);
    }

    static async update(id, userData) {

        if (Object.keys(userData).length === 0) {
            const err = new Error("Nenhum dado para atualizar.");
            err.statusCode = 400;
            throw err;
        }

        const currentUser = await this.findById(id);

        if (userData.nome && userData.nome.toLowerCase() !== currentUser.nome.toLowerCase()) {
            const userByNome = await UserRepository.findByNome(userData.nome);
            if (userByNome) {
                const err = new Error("Já existe um usuário cadastrado com este Nome.");
                err.statusCode = 400;
                throw err;
            }
        }

        if (userData.email && userData.email.toLowerCase() !== currentUser.email.toLowerCase()) {
            const userByEmail = await UserRepository.findByEmail(userData.email);
            if (userByEmail) {
                const err = new Error("Já existe um usuário cadastrado com este E-mail.");
                err.statusCode = 400;
                throw err;
            }
        }

        if (userData.cpf && userData.cpf !== currentUser.cpf) {
            const userByCpf = await UserRepository.findByCpf(userData.cpf);
            if (userByCpf) {
                const err = new Error("Já existe um usuário cadastrado com este CPF.");
                err.statusCode = 400;
                throw err;
            }
        }

        if (userData.matricula && userData.matricula !== currentUser.matricula) {
            const userByMatricula = await UserRepository.findByMatricula(userData.matricula);
            if (userByMatricula) {
                const err = new Error("Já existe um usuário cadastrado com esta Matrícula.");
                err.statusCode = 400;
                throw err;
            }
        }

        if (userData.password) {
            const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
            userData.password = await bcrypt.hash(userData.password, saltRounds);
        }

        return await UserRepository.update(id, userData);
    }

    static async delete(id) {
        await this.findById(id);

        return await UserRepository.delete(id);
    }
}

export default UserService;
