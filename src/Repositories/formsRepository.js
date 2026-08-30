import Forms from '../Models/formsModel.js';

class FormsRepository {
    async create(formsData) {
        const form = new Forms(formsData);
        return await form.save();
    }

    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        
        // We populate 'criador' to get basic info of the user who created it
        const forms = await Forms.find()
            .populate('criador', 'nome cpf')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
            
        const total = await Forms.countDocuments();
        
        return {
            forms,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async findById(id) {
        return await Forms.findById(id).populate('criador', 'nome cpf');
    }

    async update(id, updateData) {
        // new: true retorna o documento atualizado
        return await Forms.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    async remove(id) {
        // Soft delete: apenas mudamos o status para cancelado
        return await Forms.findByIdAndUpdate(id, { status: 'cancelado' }, { new: true });
    }
}

export default new FormsRepository();
