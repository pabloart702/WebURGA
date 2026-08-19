import { apoios } from '../Config/bd.js';

export const listApoios = (req, res) => {
    res.status(200).json(apoios);
};

export const searchApoioForId = (req, res) => {
    const { id } = req.params;
    const apoio = apoios.find(p => p.id === Number(id));
    if (!apoio) return res.status(404).json({ mensagem: "Solicitação não encontrada" });
    res.status(200).json(apoio);
};

export const createApoio = (req, res) => {
    const newApoio = { id: Date.now(), status: "pendente", ...req.body };
    apoios.push(newApoio);
    res.status(201).json(newApoio);
};

export const updateApoio = (req, res) => {
    const { id } = req.params;
    const index = apoios.findIndex(p => p.id === Number(id));

    if (index === -1) {
        return res.status(404).json({ mensagem: "Solicitação não encontrada" });
    }

    apoios[index] = { ...apoios[index], ...req.body };
    res.status(200).json(apoios[index]);
};

export const deleteApoio = (req, res) => {
    const { id } = req.params;
    const index = apoios.findIndex(p => p.id === Number(id));

    if (index === -1) {
        return res.status(404).json({ mensagem: "Solicitação não encontrada" });
    }

    apoios[index] = { ...apoios[index], status: "cancelado" };
    res.status(200).json({ mensagem: "Solicitação cancelada com sucesso", apoio: apoios[index] });
};
