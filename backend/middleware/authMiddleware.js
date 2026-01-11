const authMiddleware = (req, res, next) => {
    // Temporary pass-through auth (do not block)
    next();
};

export default authMiddleware;
