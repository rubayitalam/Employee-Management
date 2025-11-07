import bcrypt from 'bcryptjs';
import User from './models/User.js';

const useRegister = async () => {
    try {
        const hashPassword = await bcrypt.hash('admin', 10);
        const newUser = new User({
            name: 'admin',
            email: 'admin@gamil.com',
            password: hashPassword,
            role: 'admin'
        });

        await newUser.save();
    } catch (error) {
        console.error('userSeed.js :  Error registering user:', error);
    }
};
