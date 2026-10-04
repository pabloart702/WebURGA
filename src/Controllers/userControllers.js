import UserService from '../Services/userService.js';
import { InputUserDTO, AdminUpdateUserDTO, ProfileUpdateDTO } from '../Dtos/userInputDTO.js';
import OutUserDTO from '../Dtos/userOutDTO.js';

class UserController {

    static async listUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const searchTerm = req.query.search || '';
            const departamento = req.query.departamento || '';
            const result = await UserService.findAll(page, searchTerm, departamento);
            result.data = result.data.map(user => new OutUserDTO(user));
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    static async searchUserForId(req, res, next) {
        try {
            const { id } = req.params;
            const user = await UserService.findById(id);
            res.status(200).json(new OutUserDTO(user));
        } catch (error) {
            next(error);
        }
    };

    static async createUser(req, res, next) {
        try {
            const inputDTO = new InputUserDTO(req.body);
            const newUser = await UserService.create(inputDTO);
            res.status(201).json(new OutUserDTO(newUser));
        } catch (error) {
            next(error);
        }
    };

    static async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updateDTO = new AdminUpdateUserDTO(req.body);
            const updatedUser = await UserService.update(id, updateDTO);
            res.status(200).json(new OutUserDTO(updatedUser));
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
                user: new OutUserDTO(deletedUser)
            });
        } catch (error) {
            next(error);
        }
    };

    static async activateUser(req, res, next) {
        try {
            const { id } = req.params;
            const activatedUser = await UserService.activate(id);
            res.status(200).json({
                mensagem: "Usuário ativado com sucesso",
                user: new OutUserDTO(activatedUser)
            });
        } catch (error) {
            next(error);
        }
    };

    static async getProfile(req, res, next) {
        try {
            const id = req.user.id;
            const user = await UserService.findById(id);
            res.status(200).json(new OutUserDTO(user));
        } catch (error) {
            next(error);
        }
    };

    static async updateProfile(req, res, next) {
        try {
            const id = req.user.id;
            const updateDTO = new ProfileUpdateDTO(req.body);
            const updatedUser = await UserService.update(id, updateDTO);
            res.status(200).json(new OutUserDTO(updatedUser));
        } catch (error) {
            next(error);
        }
    };


    static async deleteProfilePicture(req, res, next) {
        try {
            const id = req.user.id;
            const updatedUser = await UserService.deleteProfilePicture(id);
            res.status(200).json({
                mensagem: 'Foto de perfil removida com sucesso.',
                user: new OutUserDTO(updatedUser)
            });
        } catch (error) {
            next(error);
        }
    }

    static async uploadProfilePicture(req, res, next) {
        try {
            if (!req.file || !req.file.filename) {
                return res.status(400).json({ error: 'Nenhuma imagem foi processada.' });
            }
            const id = req.user.id;
            const newFilename = req.file.filename;
            const updatedUser = await UserService.updateProfilePicture(id, newFilename);
            res.status(200).json({
                mensagem: "Foto de perfil atualizada com sucesso.",
                user: new OutUserDTO(updatedUser)
            });
        } catch (error) {
            next(error);
        }
    }
}

export default UserController;