import User from '../Models/userModel.js';
import { escapeRegex } from '../Utils/sanitizers.js';

class UserRepository {
    static async findAll(page, searchTerm = '', departamento = '') {
        const limit = 50;
        const skip = (page - 1) * limit;

        const query = {};

        if (departamento && typeof departamento === 'string') {
            query.departamento = departamento;
        }

        if (searchTerm && typeof searchTerm === 'string') {
            const sanitizedSearch = escapeRegex(searchTerm);
            query.$or = [
                { nome: { $regex: sanitizedSearch, $options: 'i' } },
                { cpf: { $regex: sanitizedSearch, $options: 'i' } },
                { matricula: { $regex: sanitizedSearch, $options: 'i' } }
            ];
        }

        const data = await User.find(query).skip(skip).limit(limit);
        const totalItems = await User.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        return {
            data,
            totalItems,
            totalPages,
            currentPage: page
        };
    }

    static async findById(id) {
        return await User.findById(id);
    }

    static async findByCpf(cpf) {
        return await User.findOne({ cpf });
    }

    static async findByNome(nome) {
        // Usa regex para ignorar case sensitivity e previne ReDoS/Injection
        const sanitizedNome = escapeRegex(nome);
        return await User.findOne({ nome: new RegExp(`^${sanitizedNome}$`, 'i') });
    }

    static async findByMatricula(matricula) {
        return await User.findOne({ matricula: String(matricula) });
    }

    static async findByEmail(email) {
        return await User.findOne({ email });
    }

    static async create(userData) {
        return await User.create(userData);
    }

    static async update(id, userData) {
        return await User.findByIdAndUpdate(id, userData, { new: true });
    }

    static async delete(id) {
        return await User.findByIdAndUpdate(
            id,
            { status: "Inativo" },
            { new: true }
        );
    }

    static async activate(id) {
        return await User.findByIdAndUpdate(
            id,
            { status: "Ativo" },
            { new: true }
        );
    }
}

export default UserRepository;
