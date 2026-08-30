export class OutFormsDTO {
    constructor(form) {
        this.id = form._id.toString();
        this.departamento = form.departamento;
        this.operacao = form.operacao;
        
        if (form.data_operacao) {
            const date = form.data_operacao;
            this.data_operacao = `${String(date.getUTCDate()).padStart(2, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${date.getUTCFullYear()}`;
        }

        this.numero_processo = form.numero_processo;
        this.medida_cautelar = form.medida_cautelar;
        this.numero_cautelar = form.numero_cautelar;
        this.resultados = form.resultados;
        this.tipos_apreendidos = form.tipos_apreendidos;
        this.descricao_operacao = form.descricao_operacao;
        this.valor_estimado = form.valor_estimado;
        this.status = form.status;
        this.criador = form.criador; // Pode ser populado ou apenas o ObjectId
        this.createdAt = form.createdAt;
        this.updatedAt = form.updatedAt;
    }
}
