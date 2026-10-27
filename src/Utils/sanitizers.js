export const escapeRegex = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const formatNomeProprio = (nome) => {
    if (!nome || typeof nome !== 'string') return nome;
    const preposicoes = new Set(['de', 'da', 'do', 'dos', 'das', 'e']);

    return nome
        .trim()
        .split(/\s+/)
        .map((palavra, index) => {
            const lower = palavra.toLowerCase();
            if (index > 0 && preposicoes.has(lower)) {
                return lower;
            }
            if (palavra.includes('-')) {
                return palavra
                    .split('-')
                    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
                    .join('-');
            }
            return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
        })
        .join(' ');
};