// --- BANCO DE DADOS EM MEMÓRIA (VETOR) ---
// Para simplificar, usaremos um vetor para armazenar os dados dos pets.
// Em uma aplicação real, você usaria um banco de dados como PostgreSQL, MongoDB, etc.
// 1. Nosso "Banco de Dados" temporário
export let users = [
    { id: 1, nome: "Pablo", matricula: 123456, cpf: "1234567890", email: "pablo@gmail.com", password: "123", cargo: "estagiário", status: "ativo", role: "admin", departamento: "TI" },
    { id: 2, nome: "Bruno", matricula: 654321, cpf: "9876543210", email: "bruno@gmail.com", password: "123", cargo: "delegado", status: "ativo", role: "admin", departamento: "TI" },
    { id: 3, nome: "Darliane", matricula: 456123, cpf: "1234567890", email: "darliane@gmail.com", password: "123", cargo: "escrivã", status: "ativo", role: "admin", departamento: "TI" }
];

export let apoios = [];