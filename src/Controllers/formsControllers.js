import formsService from '../Services/formsService.js';
import { InputFormsDTO, UpdateFormsDTO } from '../Dtos/formsInputDTO.js';

class FormsController {
    async listForms(req, res, next) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const status = req.query.status;
            const departamento = req.query.departamento;
            const sortBy = req.query.sortBy;
            const sortOrder = req.query.sortOrder;

            const options = { status, departamento, sortBy, sortOrder };

            const result = await formsService.getForms(page, limit, req.user, options);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async searchFormsById(req, res, next) {
        try {
            const { id } = req.params;
            const form = await formsService.getFormsById(id, req.user);
            res.status(200).json(form);
        } catch (error) {
            next(error);
        }
    }

    async createForms(req, res, next) {
        try {
            // Assume authMiddleware injects req.user
            const userId = req.user?.id || req.user?._id;

            const inputDto = new InputFormsDTO(req.body, userId);
            const newForms = await formsService.createForms(inputDto, req.user);

            res.status(201).json(newForms);
        } catch (error) {
            next(error);
        }
    }

    async updateForms(req, res, next) {
        try {
            const { id } = req.params;
            const updateDto = new UpdateFormsDTO(req.body);

            // Passamos o req.user para a camada de serviço avaliar as regras de autorização
            const updatedForms = await formsService.updateForms(id, updateDto, req.user);

            res.status(200).json(updatedForms);
        } catch (error) {
            next(error);
        }
    }

    async deleteForms(req, res, next) {
        try {
            const { id } = req.params;
            const deletedForms = await formsService.deleteForms(id, req.user);

            res.status(200).json({
                mensagem: "Formulário cancelado com sucesso",
                form: deletedForms
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new FormsController();
