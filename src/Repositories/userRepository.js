import User from '../Models/userModel.js';

class UserRepository {
    async findAll(page, searchTerm = '', departamento = '') {
        const limit = 50;
        const skip = (page - 1) * limit;

        const query = {};
        
        if (departamento) {
            query.departamento = departamento;
        }

        if (searchTerm) {
            query.$or = [
                { nome: { $regex: searchTerm, $options: 'i' } },
                { cpf: { $regex: searchTerm, $options: 'i' } },
                { matricula: { $regex: searchTerm, $options: 'i' } }
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

    async findById(id) {
        return await User.findById(id);
    }

    async findByCpf(cpf) {
        return await User.findOne({ cpf });
    }

    async findByNome(nome) {
        // Usa regex para ignorar case sensitivity
        return await User.findOne({ nome: new RegExp(`^${nome}$`, 'i') });
    }

    async findByMatricula(matricula) {
        return await User.findOne({ matricula: String(matricula) });
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async create(userData) {
        return await User.create(userData);
    }

    async update(id, userData) {
        return await User.findByIdAndUpdate(id, userData, { new: true });
    }

    async delete(id) {
        return await User.findByIdAndUpdate(
            id,
            { status: "INATIVO" },
            { new: true }
        );
    }
}

export default new UserRepository();
