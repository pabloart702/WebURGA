const securityHeadersMiddleware = (req, res, next) => {
    // Cabeçalhos de segurança essenciais para impedir XSS e Sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    res.setHeader('Content-Disposition', 'inline');
    next();
};

export default securityHeadersMiddleware;
