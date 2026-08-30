import { removerAcentos } from '../Utils/sanitizers.js';
export const BENS = [
    "CARRO",
    "MOTO",
    "IMOVEL",
    "CAMINHAO",
    "ONIBUS",
    "EMBARCACAO",
    "AERONAVE",
    "BICICLETA",
    "DINHEIRO",
    "DOLAR",
    "EURO",
    "COMPUTADOR",
    "CELULAR",
    "IMOVEL RURAL",
    "JOIAS",
    "MOVEIS",
    "ARTE",
    "CRIPTOATIVOS",
    "SEMOVENTES"
]

export const BENS_VALIDOS = BENS.map(item => removerAcentos(item.trim().toUpperCase()));
