import mongoose from 'mongoose';

const formsSchema = new mongoose.Schema({
    departamento: {
        type: String,
        required: [true, 'O campo departamento é obrigatório.']
    },
    operacao: {
        type: String,
        required: [true, 'O campo operacao é obrigatório.']
    },
    data_operacao: {
        type: Date
    },
    numero_processo: {
        type: String
    },
    medida_cautelar: {
        type: String,
        required: [true, 'O campo medida_cautelar é obrigatório.']
    },
    numero_cautelar: {
        type: String
    },
    resultados: {
        type: [String],
        required: [true, 'O campo resultados é obrigatório.']
    },
    tipos_apreendidos: {
        type: [String],
        required: [true, 'O campo tipos_apreendidos é obrigatório.']
    },
    descricao_operacao: {
        type: String
    },
    valor_estimado: {
        type: Number,
        required: [true, 'O campo valor_estimado é obrigatório.']
    },
    status: {
        type: String,
        default: 'pendente'
    },
    dataCiente: {
        type: Date
    },
    dataRealizado: {
        type: Date
    },
    criador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'O criador do formulário é obrigatório.']
    }
}, {
    timestamps: true
});

// Índices para otimização das consultas (Dashboard e Listagens)
formsSchema.index({ departamento: 1 });
formsSchema.index({ status: 1 });
formsSchema.index({ createdAt: -1 });

export default mongoose.model('Forms', formsSchema);
