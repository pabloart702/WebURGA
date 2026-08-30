export function authorize(...allowedRoles) {
    return (req, res, next) => {
        try {
            const userRole = req.user.role;

            const hasPermission = allowedRoles.includes(userRole);

            if (!hasPermission) {
                const err = new Error("Acesso negado.");
                err.statusCode = 403;
                throw err;
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}