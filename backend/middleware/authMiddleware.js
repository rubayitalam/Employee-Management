import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const verifyUser = async (req, res, next) => {
    try {
        const token = req?.headers?.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('authMiddleware.js : Error verifying user:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

export default verifyUser;
