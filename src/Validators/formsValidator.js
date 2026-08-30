import { body } from 'express-validator';
import { validateRequest } from '../Middlewares/errorMiddleware.js';
import { removerAcentos } from '../Utils/sanitizers.js';
import { UNIDADES_POLICIAIS_VALIDAS } from '../Constants/unidades.js';
import { BENS_VALIDOS } from '../Constants/bens.js';

export const CreateFormsValidator = [
    body('departamento')
        .notEmpty().withMessage('Departamento é obrigatório')
        .isString().withMessage('Departamento deve ser um texto')
        .isLength({ max: 100 }).withMessage('Departamento muito longo')
        .bail()
        .trim()
        .customSanitizer(value => typeof value === 'string' ? removerAcentos(value.trim().toUpperCase()) : value)
        .isIn(UNIDADES_POLICIAIS_VALIDAS).withMessage('Departamento inválido.'),
    body('operacao')
        .notEmpty().withMessage('Operação é obrigatória')
        .isString().withMessage('Operação deve ser um texto')
        .bail()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('A operação deve ter entre 3 e 50 carateres')
        .customSanitizer(removerAcentos)
        .toUpperCase(),
    body('data_operacao')
        .notEmpty().withMessage('Data da operação é obrigatória')
        .matches(/^(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/]\d{4}$/).withMessage('Data da operação deve estar no formato DD/MM/YYYY ou DD-MM-YYYY')
        .customSanitizer(val => val.replace(/\//g, '-')),
    body('numero_processo')
        .notEmpty().withMessage('Número do processo é obrigatório')
        .isString().withMessage('Número do processo deve ser um texto')
        .bail()
        .trim()
        .isLength({ min: 15, max: 30 }).withMessage('O número do processo deve ter entre 15 e 30 carateres')
        .matches(/^\d+$/).withMessage('O número do processo deve conter apenas números'),
    body('medida_cautelar')
        .notEmpty().withMessage('Medida cautelar é obrigatória')
        .isString().withMessage('Medida cautelar deve ser um texto')
        .isLength({ max: 50 }).withMessage('Medida cautelar muito longa')
        .bail()
        .trim()
        .customSanitizer(value => typeof value === 'string' ? removerAcentos(value.trim().toUpperCase()) : value)
        .isIn(["BUSCA E APREENSAO", "AUTO DE PRISAO EM FLAGRANTE", "SEQUESTRO", "BLOQUEIO"]).withMessage('Medida cautelar inválida. Valores aceitos: Busca e Apreensão, Auto de Prisão em Flagrante, Sequestro, Bloqueio.'),
    body('numero_cautelar')
        .notEmpty().withMessage('Número da medida cautelar é obrigatório')
        .isString().withMessage('Número da medida cautelar deve ser um texto')
        .bail()
        .trim()
        .isLength({ max: 30 }).withMessage('O número da medida cautelar deve ter no máximo 30 carateres')
        .matches(/^\d+$/).withMessage('O número da medida cautelar deve conter apenas números'),
    body('resultados')
        .notEmpty().withMessage('Resultados é obrigatório')
        .bail()
        .toArray()
        .isArray({ min: 1, max: 6 }).withMessage('Resultados pode ter no máximo 6 itens')
        .bail()
        .custom((arr) => arr.every(item => typeof item === 'string' && item.length <= 30)).withMessage('Cada resultado deve ser um texto de até 30 caracteres')
        .bail()
        .customSanitizer(arr => arr.map(item => removerAcentos(item.trim().toUpperCase())))
        .custom((arr) => {
            const validos = ["USO", "APREENSAO", "SEQUESTRO", "INDISPONIBILIDADES", "BLOQUEIO", "DEPOSITO"];
            return arr.every(item => validos.includes(item));
        }).withMessage('Resultado inválido. Valores aceitos: Uso, Apreensão, Sequestro, Indisponibilidades, Bloqueio, Depósito.'),
    body('tipos_apreendidos')
        .notEmpty().withMessage('Tipos apreendidos é obrigatório')
        .bail()
        .toArray()
        .isArray({ min: 1, max: 30 }).withMessage('Tipos apreendidos pode ter no máximo 30 itens')
        .bail()
        .custom((arr) => arr.every(item => typeof item === 'string' && item.length <= 100)).withMessage('Cada tipo apreendido deve ser um texto de até 100 caracteres')
        .bail()
        .customSanitizer(arr => arr.map(item => removerAcentos(item.trim().toUpperCase())))
        .custom((arr) => {
            return arr.every(item => {
                if (!BENS_VALIDOS.includes(item)) {
                    return item.length <= 100;
                }
                return true;
            });
        }).withMessage('Tipo apreendido inválido. Tipos customizados não devem exceder 100 caracteres.'),
    body('descricao_operacao')
        .optional()
        .isString().withMessage('Descrição da operação deve ser um texto')
        .trim()
        .isLength({ max: 500 }).withMessage('A descrição da operação deve ter no máximo 500 caracteres'),
    body('valor_estimado')
        .notEmpty().withMessage('O valor estimado total da operação é obrigatório')
        .isNumeric().withMessage('O valor estimado total da operação deve ser um número')
        .toFloat(),
    validateRequest
];

export const UpdateFormsValidator = [
    body('departamento')
        .optional()
        .isString().withMessage('Departamento deve ser um texto')
        .isLength({ max: 100 }).withMessage('Departamento muito longo')
        .bail()
        .trim()
        .customSanitizer(value => typeof value === 'string' ? removerAcentos(value.trim().toUpperCase()) : value)
        .isIn(UNIDADES_POLICIAIS_VALIDAS).withMessage('Departamento inválido.'),
    body('operacao')
        .optional()
        .isString().withMessage('Operação deve ser um texto')
        .bail()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('A operação deve ter entre 3 e 50 carateres')
        .customSanitizer(removerAcentos)
        .toUpperCase(),
    body('data_operacao')
        .optional()
        .matches(/^(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/]\d{4}$/).withMessage('Data da operação deve estar no formato DD/MM/YYYY ou DD-MM-YYYY')
        .customSanitizer(val => val.replace(/\//g, '-')),
    body('numero_processo')
        .optional()
        .isString().withMessage('Número do processo deve ser um texto')
        .bail()
        .trim()
        .isLength({ min: 15, max: 30 }).withMessage('O número do processo deve ter entre 15 e 30 carateres')
        .matches(/^\d+$/).withMessage('O número do processo deve conter apenas números'),
    body('medida_cautelar')
        .optional()
        .isString().withMessage('Medida cautelar deve ser um texto')
        .isLength({ max: 50 }).withMessage('Medida cautelar muito longa')
        .bail()
        .trim()
        .customSanitizer(value => typeof value === 'string' ? removerAcentos(value.trim().toUpperCase()) : value)
        .isIn(["BUSCA E APREENSAO", "AUTO DE PRISAO EM FLAGRANTE", "SEQUESTRO", "BLOQUEIO"]).withMessage('Medida cautelar inválida. Valores aceitos: Busca e Apreensão, Auto de Prisão em Flagrante, Sequestro, Bloqueio.'),
    body('numero_cautelar')
        .optional()
        .isString().withMessage('Número da medida cautelar deve ser um texto')
        .bail()
        .trim()
        .isLength({ max: 30 }).withMessage('O número da medida cautelar deve ter no máximo 30 carateres')
        .matches(/^\d+$/).withMessage('O número da medida cautelar deve conter apenas números'),
    body('resultados')
        .optional()
        .bail()
        .toArray()
        .isArray({ min: 1, max: 6 }).withMessage('Resultados pode ter no máximo 6 itens')
        .bail()
        .custom((arr) => arr.every(item => typeof item === 'string' && item.length <= 30)).withMessage('Cada resultado deve ser um texto de até 30 caracteres')
        .bail()
        .customSanitizer(arr => arr.map(item => removerAcentos(item.trim().toUpperCase())))
        .custom((arr) => {
            const validos = ["USO", "APREENSAO", "SEQUESTRO", "INDISPONIBILIDADES", "BLOQUEIO", "DEPOSITO"];
            return arr.every(item => validos.includes(item));
        }).withMessage('Resultado inválido. Valores aceitos: Uso, Apreensão, Sequestro, Indisponibilidades, Bloqueio, Depósito.'),
    body('tipos_apreendidos')
        .optional()
        .bail()
        .toArray()
        .isArray({ min: 1, max: 30 }).withMessage('Tipos apreendidos pode ter no máximo 30 itens')
        .bail()
        .custom((arr) => arr.every(item => typeof item === 'string' && item.length <= 100)).withMessage('Cada tipo apreendido deve ser um texto de até 100 caracteres')
        .bail()
        .customSanitizer(arr => arr.map(item => removerAcentos(item.trim().toUpperCase())))
        .custom((arr) => {
            return arr.every(item => {
                if (!BENS_VALIDOS.includes(item)) {
                    return item.length <= 100;
                }
                return true;
            });
        }).withMessage('Tipo apreendido inválido. Tipos customizados não devem exceder 100 caracteres.'),
    body('descricao_operacao')
        .optional()
        .isString().withMessage('Descrição da operação deve ser um texto')
        .trim()
        .isLength({ max: 500 }).withMessage('A descrição da operação deve ter no máximo 500 caracteres'),
    body('valor_estimado')
        .optional()
        .isNumeric().withMessage('O valor estimado total da operação deve ser um número')
        .toFloat(),
    validateRequest
];
