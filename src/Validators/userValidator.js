import { body } from 'express-validator';
import { validateRequest } from '../Middlewares/errorMiddleware.js';
import { UNIDADES_POLICIAIS_VALIDAS } from '../Constants/unidades.js';
import { cpf } from 'cpf-cnpj-validator';

export const createUserValidator = [
    body('nome')
        .notEmpty().withMessage('Nome é obrigatório')
        .bail()
        .isString().withMessage('Nome deve ser um texto')
        .bail()
        .trim()
        .isLength({ min: 6, max: 100 }).withMessage('O nome deve ter entre 6 e 100 carateres')
        .isAlpha('pt-BR', { ignore: ' ' }).withMessage('O nome deve conter apenas letras'),

    body('email')
        .notEmpty().withMessage('O email é obrigatório')
        .bail()
        .isString().withMessage('E-mail deve ser um texto')
        .bail()
        .trim()
        .isEmail().withMessage('E-mail inválido')
        .bail()
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Senha é obrigatória')
        .bail()
        .isString().withMessage('Formato de senha inválido')
        .bail()
        .trim()
        .isLength({ min: 6, max: 32 }).withMessage('A senha deve ter entre 6 e 32 carateres')
        .matches(/[A-Z]/).withMessage('A senha precisa conter pelo menos uma letra maiúscula')
        .matches(/[a-z]/).withMessage('A senha precisa conter pelo menos uma letra minúscula')
        .matches(/\d/).withMessage('A senha precisa conter pelo menos um número')
        .matches(/[^A-Za-z0-9]/).withMessage('A senha deve conter pelo menos um caractere especial (!, @, #, $, etc.)'),

    body('cpf')
        .notEmpty().withMessage('CPF é obrigatório')
        .bail()
        .isString().withMessage('O CPF deve ser enviado em formato de texto')
        .bail()
        .trim()
        .custom((value) => cpf.isValid(value)).withMessage('CPF inválido.')
        .customSanitizer((value) => cpf.strip(value)),

    body('matricula')
        .notEmpty().withMessage('Matrícula é obrigatória')
        .bail()
        .isString().withMessage('Formato de matrícula inválido')
        .bail()
        .trim()
        .matches(/^(\d{3}\.\d{3}-\d{1}|\d{7})$/).withMessage('A matrícula deve ter 7 números')
        .customSanitizer((value) => value.replace(/\D/g, '')),

    body('cargo')
        .notEmpty().withMessage('Cargo é obrigatório')
        .bail()
        .isString().withMessage('Formato de cargo inválido')
        .bail()
        .trim()
        .isIn(['Delegado', 'Agente', 'Escrivão']).withMessage('Cargo inválido. Escolha entre: Delegado, Agente ou Escrivão'),

    body('role')
        .optional()
        .isString().withMessage('Role deve ser um texto')
        .bail()
        .trim()
        .isIn(['Administrador', 'Usuário']).withMessage('Role inválida. Valores permitidos: Administrador, Usuário.'),

    body('departamento')
        .notEmpty().withMessage('Departamento é obrigatório')
        .bail()
        .isString().withMessage('Departamento deve ser um texto')
        .bail()
        .isIn(UNIDADES_POLICIAIS_VALIDAS).withMessage('Departamento inválido.'),

    body('status')
        .optional()
        .isString().withMessage('Formato de status inválido')
        .bail()
        .trim()
        .isIn(['Ativo', 'Inativo']).withMessage('Status deve ser Ativo ou Inativo'),

    validateRequest,
];

export const updateUserValidator = [
    body('nome')
        .optional()
        .isString().withMessage('Nome deve ser um texto')
        .bail()
        .trim()
        .isLength({ min: 6, max: 100 }).withMessage('O nome deve ter entre 6 e 100 carateres')
        .isAlpha('pt-BR', { ignore: ' ' }).withMessage('O nome deve conter apenas letras'),

    body('email')
        .optional()
        .isString().withMessage('E-mail deve ser um texto')
        .bail()
        .trim()
        .isEmail().withMessage('E-mail inválido')
        .bail()
        .normalizeEmail(),

    body('password')
        .optional()
        .isString().withMessage('Formato de senha inválido')
        .bail()
        .trim()
        .isLength({ min: 6, max: 32 }).withMessage('A senha deve ter entre 6 e 32 carateres')
        .matches(/[A-Z]/).withMessage('A senha precisa conter pelo menos uma letra maiúscula')
        .matches(/[a-z]/).withMessage('A senha precisa conter pelo menos uma letra minúscula')
        .matches(/\d/).withMessage('A senha precisa conter pelo menos um número')
        .matches(/[^A-Za-z0-9]/).withMessage('A senha deve conter pelo menos um caractere especial (!, @, #, $, etc.)'),

    body('cpf')
        .not().exists()
        .withMessage('O CPF não pode ser alterado após o cadastro'),

    body('matricula')
        .not().exists()
        .withMessage('A matrícula não pode ser alterada após o cadastro'),

    body('cargo')
        .optional()
        .isString().withMessage('Formato de cargo inválido')
        .bail()
        .trim()
        .isIn(['Delegado', 'Agente', 'Escrivão']).withMessage('Cargo inválido. Escolha entre: Delegado, Agente ou Escrivão'),

    body('role')
        .optional()
        .isString().withMessage('Role deve ser um texto')
        .bail()
        .trim()
        .isIn(['Administrador', 'Usuário']).withMessage('Role inválida. Valores permitidos: Administrador, Usuário.'),

    body('departamento')
        .optional()
        .isString().withMessage('Departamento deve ser um texto')
        .bail()
        .isIn(UNIDADES_POLICIAIS_VALIDAS).withMessage('Departamento inválido.'),

    body('status')
        .optional()
        .isString().withMessage('Formato de status inválido')
        .bail()
        .trim()
        .isIn(['Ativo', 'Inativo']).withMessage('Status deve ser Ativo ou Inativo'),

    validateRequest
];
