
// Middleware de validação
export const webLog = (req, res, next) => {
    const data = new Date().toISOString();
    console.log(`[${data}] ${req.method} em ${req.url}`);
    next();
};