import { body } from 'express-validator';

export const loginValidator = [
    body('email')
        .exists().withMessage('O email é obrigatório.')
        .isString().withMessage('O email deve ser uma string.')
        .isLength({ max: 100 }).withMessage('O email excede o tamanho máximo permitido.'),
    body('password')
        .exists().withMessage('A senha é obrigatória.')
        .isString().withMessage('A senha deve ser uma string.')
        .isLength({ max: 128 }).withMessage('A senha excede o tamanho máximo permitido.')
];
