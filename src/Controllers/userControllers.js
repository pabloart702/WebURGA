import { users } from '../Config/bd.js';

export const listUsers = (req, res) => {
    res.status(200).json(users);
};

export const searchUserForId = (req, res) => {
    const { id } = req.params;
    const user = users.find(p => p.id === Number(id));
    if (!user) return res.status(404).json({ mensagem: "Usuário não encontrado" });
    res.status(200).json(user);
};

export const createUser = (req, res) => {
    const newUser = { id: Date.now(), status: "ativo", ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
};

export const updateUser = (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(p => p.id === Number(id));

    if (index === -1) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    users[index] = { ...users[index], ...req.body };
    res.status(200).json(users[index]);
};

export const deleteUser = (req, res) => {
    const { id } = req.params;
    const index = users.findIndex(p => p.id === Number(id));

    if (index === -1) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    users[index] = { ...users[index], status: "inativo" };
    res.status(200).json({ mensagem: "Usuário desativado com sucesso", user: users[index] });
};