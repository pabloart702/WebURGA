import Forms from '../Models/formsModel.js';

class FormsRepository {
    async create(formsData) {
        const form = new Forms(formsData);
        return await form.save();
    }

    async findAll(page = 1, limit = 10, filter = {}, sort = { createdAt: -1 }) {
        const skip = (page - 1) * limit;

        const forms = await Forms.find(filter)
            .populate('criador', 'nome cpf')
            .skip(skip)
            .limit(limit)
            .sort(sort);

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

    async getDashboardMetrics() {
        const apoiosPrestados = await Forms.countDocuments({ status: 'realizado' });
        const apoiosSolicitados = await Forms.countDocuments();
        
        const valorAgg = await Forms.aggregate([
            { $match: { status: 'realizado' } },
            { $group: { _id: null, totalValor: { $sum: '$valor_estimado' } } }
        ]);
        const totalValorEstimado = valorAgg.length > 0 ? valorAgg[0].totalValor : 0;

        const delegaciasMaisSolicitam = await Forms.aggregate([
            { $group: { _id: '$departamento', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 6 }
        ]);

        const tiposMaisApreendidos = await Forms.aggregate([
            { $unwind: '$tipos_apreendidos' },
            { $group: { _id: '$tipos_apreendidos', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 6 }
        ]);

        const resultadosMaisComuns = await Forms.aggregate([
            { $unwind: '$resultados' },
            { $group: { _id: '$resultados', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 6 }
        ]);

        return {
            apoiosPrestados,
            apoiosSolicitados,
            totalValorEstimado,
            delegaciasMaisSolicitam,
            tiposMaisApreendidos,
            resultadosMaisComuns
        };
    }
}

export default new FormsRepository();
