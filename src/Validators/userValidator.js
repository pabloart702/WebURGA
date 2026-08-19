import { body } from 'express-validator';
import { validateRequest } from '../Middlewares/errorMiddleware.js';
const { cpf } = require('cpf-cnpj-validator');

export const userValidator = [
    body('nome')
        .trim()
        .isString().withMessage('Nome deve ser um texto').bail()
        .notEmpty().withMessage('Nome é obrigatório').bail()
        .isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres').bail()
        .isAlpha('pt-BR', { ignore: ' ' }).withMessage('O nome deve conter apenas letras').bail()
        .escape(),

    body('email')
        .trim()
        .notEmpty().withMessage('O email é obrigatório').bail()
        .isEmail().withMessage('E-mail inválido').bail(),

    body('password')
        .trim()
        .notEmpty().withMessage('Senha é obrigatória').bail()
        .isString().withMessage('Formato de senha inválido').bail()
        .isLength({ min: 6, max: 32 }).withMessage('A senha deve ter no mínimo 6 caracteres').bail()
        .matches(/[A-Z]/).withMessage('A senha precisa conter pelo menos uma letra maiúscula').bail()
        .matches(/[a-z]/).withMessage('A senha precisa conter pelo menos uma letra minúscula').bail()
        .matches(/\d/).withMessage('A senha precisa conter pelo menos um número').bail()
        .matches(/[^A-Za-z0-9]/).withMessage('A senha deve conter pelo menos um caractere especial (!, @, #, $, etc.)'),

    body('cpf')
        .trim()
        .notEmpty().withMessage('CPF é obrigatório').bail()
        .custom((value) => {
            if (!cpf.isValid(value)) {
                throw new Error('CPF inválido.');
            }
            return true;
        })
        .customSanitizer((value) => cpf.strip(value)),

    body('matricula')
        .trim()
        .notEmpty().withMessage('Matrícula é obrigatória').bail()
        .isString().withMessage('Formato de matrícula inválido').bail()
        .matches(/^(\d{3}\.\d{3}-\d{1}|\d{7})$/).withMessage('Formato de matrícula inválido').bail()
        .customSanitizer((value) => value.replace(/\D/g, '')),

    body('cargo')
        .trim()
        .notEmpty().withMessage('Cargo é obrigatório').bail()
        .isString().withMessage('Formato de cargo inválido').bail()
        .toUpperCase()
        .isIn(['DELEGADO', 'AGENTE', 'ESCRIVÃO']).withMessage('Cargo inválido. Escolha entre: Delegado, Agente ou Escrivão'),

    body('role')
        .trim()
        .notEmpty().withMessage('Papel é obrigatório').bail()
        .isString().withMessage('Formato de papel inválido').bail()
        .toUpperCase()
        .isIn(['ADMINISTRADOR', 'USUÁRIO']).withMessage('Papel inválido. Escolha entre: Administrador ou Usuário').bail(),

    body('departamento')
        .trim()
        .notEmpty().withMessage('Departamento é obrigatório').bail()
        .isString().withMessage('Departamento deve ser um texto').bail(),

    body('status')
        .trim()
        .notEmpty().withMessage('Status é obrigatório').bail()
        .toUpperCase()
        .isIn(['ATIVO', 'INATIVO']).withMessage('Status deve ser Ativo ou Inativo'),

    validateRequest,
];

export const userUpdateValidator = [
    body('nome')
        .trim()
        .isString().withMessage('Nome deve ser um texto').bail()
        .notEmpty().withMessage('Nome é obrigatório').bail()
        .isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres').bail()
        .isAlpha('pt-BR', { ignore: ' ' }).withMessage('O nome deve conter apenas letras').bail()
        .escape(),

    body('email')
        .trim()
        .notEmpty().withMessage('O email é obrigatório').bail()
        .isEmail().withMessage('E-mail inválido').bail(),

    body('password')
        .trim()
        .notEmpty().withMessage('Senha é obrigatória').bail()
        .isString().withMessage('Formato de senha inválido').bail()
        .isLength({ min: 6, max: 32 }).withMessage('A senha deve ter no mínimo 6 caracteres').bail()
        .matches(/[A-Z]/).withMessage('A senha precisa conter pelo menos uma letra maiúscula').bail()
        .matches(/[a-z]/).withMessage('A senha precisa conter pelo menos uma letra minúscula').bail()
        .matches(/\d/).withMessage('A senha precisa conter pelo menos um número').bail()
        .matches(/[^A-Za-z0-9]/).withMessage('A senha deve conter pelo menos um caractere especial (!, @, #, $, etc.)'),

    body('cpf')
        .trim()
        .notEmpty().withMessage('CPF é obrigatório').bail()
        .custom((value) => {
            if (!cpf.isValid(value)) {
                throw new Error('CPF inválido.');
            }
            return true;
        })
        .customSanitizer((value) => cpf.strip(value)),

    body('matricula')
        .trim()
        .notEmpty().withMessage('Matrícula é obrigatória').bail()
        .isString().withMessage('Formato de matrícula inválido').bail()
        .matches(/^(\d{3}\.\d{3}-\d{1}|\d{7})$/).withMessage('Formato de matrícula inválido').bail()
        .customSanitizer((value) => value.replace(/\D/g, '')),

    body('cargo')
        .trim()
        .notEmpty().withMessage('Cargo é obrigatório').bail()
        .isString().withMessage('Formato de cargo inválido').bail()
        .toUpperCase()
        .isIn(['DELEGADO', 'AGENTE', 'ESCRIVÃO']).withMessage('Cargo inválido. Escolha entre: Delegado, Agente ou Escrivão'),

    body('role')
        .trim()
        .notEmpty().withMessage('Papel é obrigatório').bail()
        .isString().withMessage('Formato de papel inválido').bail()
        .toUpperCase()
        .isIn(['ADMINISTRADOR', 'USUÁRIO']).withMessage('Papel inválido. Escolha entre: Administrador ou Usuário').bail(),

    body('departamento')
        .trim()
        .notEmpty().withMessage('Departamento é obrigatório').bail()
        .isString().withMessage('Departamento deve ser um texto').bail(),

    body('status')
        .trim()
        .notEmpty().withMessage('Status é obrigatório').bail()
        .toUpperCase()
        .isIn(['ATIVO', 'INATIVO']).withMessage('Status deve ser Ativo ou Inativo'),
    validateRequest
];
