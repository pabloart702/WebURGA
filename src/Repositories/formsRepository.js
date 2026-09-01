import Forms from '../Models/formsModel.js';

class FormsRepository {
    async create(formsData) {
        const form = new Forms(formsData);
        return await form.save();
    }

    async findAll(page = 1, limit = 10, filter = {}) {
        const skip = (page - 1) * limit;

        const forms = await Forms.find(filter)
            .populate('criador', 'nome cpf')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Forms.countDocuments(filter);

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
        return await Forms.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }

    async remove(id) {
        return await Forms.findByIdAndUpdate(id, { status: 'cancelado' }, { new: true });
    }
}

export default new FormsRepository();
