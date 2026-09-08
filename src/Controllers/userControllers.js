import UserService from '../Services/userService.js';
import { InputUserDTO, UpdateUserDTO } from '../Dtos/userInputDTO.js';
import outUserDTO from '../Dtos/userOutDTO.js';

class UserController {

    static async listUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const searchTerm = req.query.search || '';
            const departamento = req.query.departamento || '';
            console.log("query:", req.query); const result = await UserService.findAll(page, searchTerm, departamento);

            // Mapeia apenas os usuários dentro da propriedade 'data' para o DTO
            result.data = result.data.map(user => new outUserDTO(user));

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    static async searchUserForId(req, res, next) {
        try {
            const { id } = req.params;
            const user = await UserService.findById(id);
            res.status(200).json(new outUserDTO(user));
        } catch (error) {
            next(error);
        }
    };

    static async createUser(req, res, next) {
        try {
            const inputDTO = new InputUserDTO(req.body);
            const newUser = await UserService.create(inputDTO);
            res.status(201).json(new outUserDTO(newUser));
        } catch (error) {
            next(error);
        }
    };

    static async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updateDTO = new UpdateUserDTO(req.body);
            const updatedUser = await UserService.update(id, updateDTO);
            res.status(200).json(new outUserDTO(updatedUser));
        } catch (error) {
            next(error);
        }
    };

    static async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            const deletedUser = await UserService.delete(id);
            res.status(200).json({
                mensagem: "Usuário desativado com sucesso",
                user: new outUserDTO(deletedUser)
            });
        } catch (error) {
            next(error);
        }
    };

    static async getProfile(req, res, next) {
        try {
            const id = req.user.id;
            const user = await UserService.findById(id);
            res.status(200).json(new outUserDTO(user));
        } catch (error) {
            next(error);
        }
    };

    static async updateProfile(req, res, next) {
        try {
            const id = req.user.id;
            const updateDTO = new UpdateUserDTO(req.body);
            const updatedUser = await UserService.update(id, updateDTO);
            res.status(200).json(new outUserDTO(updatedUser));
        } catch (error) {
            next(error);
        }
    };
}

export default UserController;