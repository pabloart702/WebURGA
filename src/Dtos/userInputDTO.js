import { formatNomeProprio } from '../Utils/sanitizers.js';

class InputUserDTO {
    constructor(payload) {

        this.nome = payload.nome !== undefined ? formatNomeProprio(payload.nome) : payload.nome;
        this.email = payload.email;
        this.password = payload.password;
        this.cpf = payload.cpf;
        this.matricula = payload.matricula;
        this.cargo = payload.cargo;
        this.departamento = payload.departamento;

        this.role = payload.role || 'Usuário';
        this.status = payload.status || 'Ativo';
    }
}

class AdminUpdateUserDTO {
    constructor(payload) {
        if (payload.nome !== undefined) this.nome = formatNomeProprio(payload.nome);
        if (payload.email !== undefined) this.email = payload.email;
        if (payload.password !== undefined) this.password = payload.password;
        if (payload.cargo !== undefined) this.cargo = payload.cargo;
        if (payload.cpf !== undefined) this.cpf = payload.cpf;
        if (payload.matricula !== undefined) this.matricula = payload.matricula;
        if (payload.role !== undefined) this.role = payload.role;
        if (payload.departamento !== undefined) this.departamento = payload.departamento;
        if (payload.status !== undefined) this.status = payload.status;
    }
}

class ProfileUpdateDTO {
    constructor(payload) {
        if (payload.nome !== undefined) this.nome = formatNomeProprio(payload.nome);
        if (payload.email !== undefined) this.email = payload.email;
        if (payload.password !== undefined) this.password = payload.password;
        if (payload.cargo !== undefined) this.cargo = payload.cargo;
    }
}

export { InputUserDTO, AdminUpdateUserDTO, ProfileUpdateDTO };