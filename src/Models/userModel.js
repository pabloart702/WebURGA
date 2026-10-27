import mongoose from 'mongoose';
import { formatNomeProprio } from '../Utils/sanitizers.js';

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O campo nome é obrigatório.'],
        set: formatNomeProprio
    },
    email: {
        type: String,
        required: [true, 'O campo email é obrigatório.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'O campo password é obrigatório.']
    },
    cpf: {
        type: String,
        required: [true, 'O campo CPF é obrigatório.'],
        unique: true
    },
    matricula: {
        type: String,
        required: [true, 'O campo matrícula é obrigatório.'],
        unique: true
    },
    cargo: {
        type: String,
        required: [true, 'O campo cargo é obrigatório.']
    },
    role: {
        type: String,
        default: "Usuário"
    },
    departamento: {
        type: String,
        required: [true, 'O campo departamento é obrigatório.']
    },
    status: {
        type: String,
        default: "Ativo"
    },
    profilePicture: {
        type: String,
        default: null
    }
}, {
    timestamps: true // Cria createdAt e updatedAt automaticamente
});

userSchema.index({ nome: 1 });

// Exporta o Model compilado
export default mongoose.model('User', userSchema);
