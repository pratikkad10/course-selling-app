
export const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid token" });
        }
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

export const adminAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
    if (req.user.role !== "admin") {
        return res.status(403).json({
            error: "Access denied"
        });
    }
    next();
}

export const instructorAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
    if(req.user.role !== "instructor"){
        return res.status(403).json({
            error: "Access denied"
        });
    }
    next();
}

export const studentAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }
    if(req.user.role !== "student"){
        return res.status(403).json({
            error: "Access denied"
        });
    }
    next();
}