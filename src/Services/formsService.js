import formsRepository from '../Repositories/formsRepository.js';
import { OutFormsDTO } from '../Dtos/formsOutDTO.js';

class FormsService {
    async createForms(inputDto, reqUser) {
        if (reqUser.role !== 'Administrador') {
            inputDto.departamento = reqUser.departamento;
        }

        const createdForm = await formsRepository.create(inputDto);
        return new OutFormsDTO(createdForm);
    }

    async getForms(page = 1, limit = 10, reqUser) {
        const filter = {};
        if (reqUser && reqUser.role !== 'Administrador') {
            filter.departamento = reqUser.departamento;
        }

        const { forms, total, totalPages } = await formsRepository.findAll(page, limit, filter);

        return {
            forms: forms.map(form => new OutFormsDTO(form)),
            total,
            page,
            totalPages
        };
    }

    async getFormsById(id, reqUser) {
        const form = await formsRepository.findById(id);
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

        return new OutFormsDTO(form);
    }

    async updateForms(id, updateDto, reqUser) {
        const form = await formsRepository.findById(id);
        if (!form) {
            const err = new Error("Formulário não encontrado");
            err.statusCode = 404;
            throw err;
        }

        // Regra de Negócio: Usuário só pode atualizar forms do seu departamento
        if (reqUser.role !== 'Administrador') {
            if (form.departamento !== reqUser.departamento) {
                const err = new Error("Acesso negado. O formulário não pertence ao seu departamento.");
                err.statusCode = 403;
                throw err;
            }
        }

        // Regra de Negócio: Apenas ADMINISTRADOR pode alterar o departamento
        if (updateDto.departamento && updateDto.departamento !== form.departamento) {
            if (reqUser.role !== 'Administrador') {
                const err = new Error("Apenas administradores podem alterar o departamento do formulário.");
                err.statusCode = 403;
                throw err;
            }
        }

        const updatedForm = await formsRepository.update(id, updateDto);
        return new OutFormsDTO(updatedForm);
    }

    async deleteForms(id, reqUser) {
        const form = await formsRepository.findById(id);
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

        const deletedForm = await formsRepository.remove(id);
        return new OutFormsDTO(deletedForm);
    }
}

export default new FormsService();
