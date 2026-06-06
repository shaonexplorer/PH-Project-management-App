import jwt from 'jsonwebtoken';
/**
 * Express middleware to protect routes.
 * Expects an `Authorization: Bearer <token>` header.
 * On success, attaches `req.user = { id, role }`.
 */
export const authenticate = (req, res, next) => {
    // Try Authorization header first
    let token;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    else if (req.cookies && req.cookies.accessToken) {
        // Fallback to cookie named 'accessToken'
        token = req.cookies.accessToken;
    }
    if (!token) {
        return res.status(401).json({ message: 'Missing authentication token' });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Attach minimal user info to request
        req.user = { id: payload.sub, role: payload.role };
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
