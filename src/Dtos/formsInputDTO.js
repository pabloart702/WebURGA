class InputFormsDTO {
    constructor(payload, userId) {
        this.departamento = payload.departamento;
        this.operacao = payload.operacao;
        
        if (payload.data_operacao) {
            const [day, month, year] = payload.data_operacao.split('-');
            this.data_operacao = new Date(`${year}-${month}-${day}T00:00:00Z`);
        }

        this.numero_processo = payload.numero_processo;
        this.medida_cautelar = payload.medida_cautelar;
        this.numero_cautelar = payload.numero_cautelar;
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
            const [day, month, year] = payload.data_operacao.split('-');
            this.data_operacao = new Date(`${year}-${month}-${day}T00:00:00Z`);
        }

        if (payload.numero_processo !== undefined) this.numero_processo = payload.numero_processo;
        if (payload.medida_cautelar !== undefined) this.medida_cautelar = payload.medida_cautelar;
        if (payload.numero_cautelar !== undefined) this.numero_cautelar = payload.numero_cautelar;
        if (payload.resultados !== undefined) this.resultados = payload.resultados;
        if (payload.tipos_apreendidos !== undefined) this.tipos_apreendidos = payload.tipos_apreendidos;
        if (payload.descricao_operacao !== undefined) this.descricao_operacao = payload.descricao_operacao;
        if (payload.valor_estimado !== undefined) this.valor_estimado = payload.valor_estimado;
        if (payload.status !== undefined) this.status = payload.status;
    }
}

export { InputFormsDTO, UpdateFormsDTO };
