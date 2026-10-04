import FormsRepository from '../Repositories/formsRepository.js';

class FormsService {
    static async createForms(inputDto, reqUser) {
        if (reqUser.role !== 'Administrador') {
            inputDto.departamento = reqUser.departamento;
        }

        if (inputDto.status === 'realizado') {
            const dataOp = inputDto.data_operacao;
            if (dataOp) {
                let operationDateStr = typeof dataOp === 'string' ? dataOp.split('T')[0] : dataOp.toISOString().split('T')[0];

                const today = new Date();
                const todayStr = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0');

                if (operationDateStr > todayStr) {
                    const err = new Error("Não é possível registrar o apoio como realizado se a data da operação for no futuro.");
                    err.statusCode = 400;
                    throw err;
                }
            }
            inputDto.dataRealizado = new Date();
        }

        const createdForm = await FormsRepository.create(inputDto);
        return createdForm;
    }

    static async getForms(page = 1, limit = 10, reqUser, options = {}) {
        const filter = {};
        if (reqUser && reqUser.role !== 'Administrador') {
            filter.departamento = reqUser.departamento;
        } else if (options.departamento) {
            filter.departamento = options.departamento;
        }

        if (options.status) {
            filter.status = options.status;
        }

        let sort = { createdAt: -1 };
        if (options.sortBy) {
            sort = { [options.sortBy]: options.sortOrder === 'asc' ? 1 : -1 };
        }

        const { forms, total, totalPages } = await FormsRepository.findAll(page, limit, filter, sort);

        return {
            forms,
            total,
            page,
            totalPages
        };
    }

    static async getFormsById(id, reqUser) {
        const form = await FormsRepository.findById(id);
        if (!form) {
            const err = new Error("Formulário não encontrado");
            err.statusCode = 404;
            throw err;
        }

        if (reqUser && reqUser.role !== 'Administrador') {
            if (form.departamento !== reqUser.departamento) {
                const err = new Error("Acesso negado. O formulário não pertence ao seu departamento.");
                err.statusCode = 403;
                throw err;
            }
        }

        return form;
    }

    static async updateForms(id, updateDto, reqUser) {
        const form = await FormsRepository.findById(id);
        if (!form) {
            const err = new Error("Formulário não encontrado");
            err.statusCode = 404;
            throw err;
        }

        // Usuário só pode atualizar seus próprios formulários
        if (reqUser.role !== 'Administrador') {
            if (form.criador._id.toString() !== reqUser.id) {
                const err = new Error("Acesso negado. Você só pode modificar os formulários que você mesmo criou.");
                err.statusCode = 403;
                throw err;
            }
        }

        // Apenas ADMINISTRADOR pode alterar o departamento
        if (updateDto.departamento && updateDto.departamento !== form.departamento) {
            if (reqUser.role !== 'Administrador') {
                const err = new Error("Apenas administradores podem alterar o departamento do formulário.");
                err.statusCode = 403;
                throw err;
            }
        }

        // Apenas ADMINISTRADOR pode alterar o status
        if (updateDto.status && updateDto.status !== form.status) {
            if (reqUser.role !== 'Administrador') {
                const err = new Error("Apenas administradores podem alterar o status do formulário.");
                err.statusCode = 403;
                throw err;
            }
            if (updateDto.status === 'ciente') {
                updateDto.dataCiente = new Date();
            }
            if (updateDto.status === 'realizado') {
                const dataOp = updateDto.data_operacao || form.data_operacao;
                if (dataOp) {
                    let operationDateStr = typeof dataOp === 'string' ? dataOp.split('T')[0] : dataOp.toISOString().split('T')[0];

                    const today = new Date();
                    const todayStr = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0');

                    if (operationDateStr > todayStr) {
                        const err = new Error("Não é possível marcar o apoio como realizado se a data da operação for no futuro.");
                        err.statusCode = 400;
                        throw err;
                    }
                }
                updateDto.dataRealizado = new Date();
            }
        }

        const updatedForm = await FormsRepository.update(id, updateDto);
        return updatedForm;
    }

    static async deleteForms(id, reqUser) {
        const form = await FormsRepository.findById(id);
        if (!form) {
            const err = new Error("Formulário não encontrado");
            err.statusCode = 404;
            throw err;
        }

        if (reqUser && reqUser.role !== 'Administrador') {
            if (form.criador._id.toString() !== reqUser.id) {
                const err = new Error("Acesso negado. Você só pode deletar os formulários que você mesmo criou.");
                err.statusCode = 403;
                throw err;
            }
        }

        const deletedForm = await FormsRepository.remove(id);
        return deletedForm;
    }

    static async getDashboardData() {
        return await FormsRepository.getDashboardMetrics();
    }
}

export default FormsService;
