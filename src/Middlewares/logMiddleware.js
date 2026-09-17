
// Middleware de validação
export const webLog = (req, res, next) => {
    const data = new Date().toISOString();
    // Usando req.path no lugar de req.url para evitar logar query strings sensíveis (ex: ?token=123)
    console.log(`[${data}] ${req.method} em ${req.path}`);
    next();
};