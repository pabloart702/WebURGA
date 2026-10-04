class InputFormsDTO {
    constructor(payload, userId) {
        this.departamento = payload.departamento;
        this.operacao = payload.operacao;
        this.data_operacao = payload.data_operacao ? new Date(payload.data_operacao) : null;
        this.numero_processo = payload.numero_processo || null;
        this.medida_cautelar = payload.medida_cautelar;
        this.numero_cautelar = payload.numero_cautelar || null;
        this.resultados = payload.resultados;
        this.tipos_apreendidos = payload.tipos_apreendidos;
        this.descricao_operacao = payload.descricao_operacao;
        this.valor_estimado = payload.valor_estimado;
        this.status = payload.status || 'pendente';
        this.criador = userId;
    }
}

class UpdateFormsDTO {
    constructor(payload) {
        if (payload.departamento !== undefined) this.departamento = payload.departamento;
        if (payload.operacao !== undefined) this.operacao = payload.operacao;
        if (payload.data_operacao !== undefined) {
            this.data_operacao = payload.data_operacao ? new Date(payload.data_operacao) : null;
        }
        if (payload.numero_processo !== undefined) this.numero_processo = payload.numero_processo || null;
        if (payload.medida_cautelar !== undefined) this.medida_cautelar = payload.medida_cautelar;
        if (payload.numero_cautelar !== undefined) this.numero_cautelar = payload.numero_cautelar || null;
        if (payload.resultados !== undefined) this.resultados = payload.resultados;
        if (payload.tipos_apreendidos !== undefined) this.tipos_apreendidos = payload.tipos_apreendidos;
        if (payload.descricao_operacao !== undefined) this.descricao_operacao = payload.descricao_operacao;
        if (payload.valor_estimado !== undefined) this.valor_estimado = payload.valor_estimado;
        if (payload.status !== undefined) this.status = payload.status;
    }
}

export { InputFormsDTO, UpdateFormsDTO };
