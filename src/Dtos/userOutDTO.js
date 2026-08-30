class outUserDTO {
    constructor(user) {
        this.id = user._id;
        this.nome = user.nome;
        this.email = user.email;
        this.cpf = user.cpf;
        this.role = user.role;
        this.matricula = user.matricula;
        this.cargo = user.cargo;
        this.departamento = user.departamento;
        this.status = user.status;
    }
}

export default outUserDTO;
