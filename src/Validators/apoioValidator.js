import { body } from 'express-validator';
import { validateRequest } from '../Middlewares/errorMiddleware.js';

export const apoioValidator = [
    body('titulo').notEmpty().withMessage('Título é obrigatório').isString(),
    body('descricao').notEmpty().withMessage('Descrição é obrigatória').isString(),
    validateRequest
];

export const apoioUpdateValidator = [
    body('titulo').optional().isString(),
    body('descricao').optional().isString(),
    validateRequest
];
