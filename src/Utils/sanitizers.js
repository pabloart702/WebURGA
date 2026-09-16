export const removerAcentos = (value) => {
    if (typeof value !== 'string') return value;
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const escapeRegex = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};