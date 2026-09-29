import { body } from 'express-validator';

export const loginValidator = [
    body('email')
        .exists().withMessage('O email é obrigatório.')
        .isString().withMessage('O email deve ser um texto.')
        .trim()
        .isEmail().withMessage('Formato de e-mail inválido.')
        .isLength({ max: 60 }).withMessage('O email excede o tamanho máximo.'),

    body('password')
        .exists().withMessage('A senha é obrigatória.')
        .isString().withMessage('A senha deve ser um texto.')
        .isLength({ max: 50 }).withMessage('A senha excede o tamanho máximo.')
];
