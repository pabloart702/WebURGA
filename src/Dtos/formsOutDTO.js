export class OutFormsDTO {
    constructor(form) {
        this.id = form._id ? form._id.toString() : (form.id || null);
        this.departamento = form.departamento;
        this.operacao = form.operacao;
        
        if (form.data_operacao) {
            const date = form.data_operacao instanceof Date ? form.data_operacao : new Date(form.data_operacao);
            if (!isNaN(date.getTime())) {
                this.data_operacao = `${String(date.getUTCDate()).padStart(2, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${date.getUTCFullYear()}`;
            } else {
                this.data_operacao = form.data_operacao;
            }
        } else {
            this.data_operacao = null;
        }

        this.numero_processo = form.numero_processo || null;
        this.medida_cautelar = form.medida_cautelar;
        this.numero_cautelar = form.numero_cautelar || null;
        this.resultados = form.resultados;
        this.tipos_apreendidos = form.tipos_apreendidos;
        this.descricao_operacao = form.descricao_operacao;
        this.valor_estimado = form.valor_estimado;
        this.status = form.status;
        this.dataCiente = form.dataCiente;
        this.dataRealizado = form.dataRealizado;
        this.criador = form.criador; // Pode ser populado ou apenas o ObjectId
        this.createdAt = form.createdAt;
        this.updatedAt = form.updatedAt;
    }
}
