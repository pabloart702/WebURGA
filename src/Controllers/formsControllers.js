import FormsService from '../Services/formsService.js';
import { InputFormsDTO, UpdateFormsDTO } from '../Dtos/formsInputDTO.js';
import { OutFormsDTO } from '../Dtos/formsOutDTO.js';

class FormsController {
    static async listForms(req, res, next) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10;
            const status = req.query.status;
            const departamento = req.query.departamento;
            const sortBy = req.query.sortBy;
            const sortOrder = req.query.sortOrder;

            const options = { status, departamento, sortBy, sortOrder };

            const result = await FormsService.getForms(page, limit, req.user, options);
            if (result && Array.isArray(result.forms)) {
                result.forms = result.forms.map(form => new OutFormsDTO(form));
            }
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    static async searchFormsById(req, res, next) {
        try {
            const { id } = req.params;
            const form = await FormsService.getFormsById(id, req.user);
            res.status(200).json(new OutFormsDTO(form));
        } catch (error) {
            next(error);
        }
    }

    static async createForms(req, res, next) {
        try {
            // Assume authMiddleware injects req.user
            const userId = req.user?.id || req.user?._id;

            const inputDto = new InputFormsDTO(req.body, userId);
            const newForms = await FormsService.createForms(inputDto, req.user);

            res.status(201).json(new OutFormsDTO(newForms));
        } catch (error) {
            next(error);
        }
    }

    static async updateForms(req, res, next) {
        try {
            const { id } = req.params;
            const updateDto = new UpdateFormsDTO(req.body);

            // Passamos o req.user para a camada de serviço avaliar as regras de autorização
            const updatedForms = await FormsService.updateForms(id, updateDto, req.user);

            res.status(200).json(new OutFormsDTO(updatedForms));
        } catch (error) {
            next(error);
        }
    }

    static async deleteForms(req, res, next) {
        try {
            const { id } = req.params;
            const deletedForms = await FormsService.deleteForms(id, req.user);

            res.status(200).json({
                mensagem: "Formulário cancelado com sucesso",
                form: new OutFormsDTO(deletedForms)
            });
        } catch (error) {
            next(error);
        }
    }

    static async getDashboardData(req, res, next) {
        try {
            const data = await FormsService.getDashboardData();
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }
}

export default FormsController;
