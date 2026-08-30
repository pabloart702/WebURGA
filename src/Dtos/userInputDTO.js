class InputUserDTO {
    constructor(payload) {

        this.nome = payload.nome;
        this.email = payload.email;
        this.password = payload.password;
        this.cpf = payload.cpf;
        this.matricula = payload.matricula;
        this.cargo = payload.cargo;
        this.departamento = payload.departamento;

        this.role = payload.role || 'USUÁRIO';
        this.status = payload.status || 'ATIVO';
    }
}

class UpdateUserDTO {
    constructor(payload) {
        if (payload.nome !== undefined) this.nome = payload.nome;
        if (payload.email !== undefined) this.email = payload.email;
        if (payload.password !== undefined) this.password = payload.password;
        if (payload.cargo !== undefined) this.cargo = payload.cargo;
        if (payload.role !== undefined) this.role = payload.role;
        if (payload.departamento !== undefined) this.departamento = payload.departamento;
        if (payload.status !== undefined) this.status = payload.status;
    }
}

export { InputUserDTO, UpdateUserDTO };