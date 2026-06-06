import { prisma } from "../../app/lib/prisma.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
export const AuthService = {
    /**
     * Register a new user.
     * Returns the created user object without the password hash.
     */
    async register(data) {
        const { name, email, password, role } = data;
        let passwordHash;
        if (password) {
            passwordHash = await hashPassword(password);
        }
        else {
            throw new Error("Password is required");
        }
        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role: role,
            },
        });
        // Omit passwordHash before returning
        // @ts-ignore – Prisma type includes passwordHash, we remove it manually
        const { passwordHash: _ph, ...rest } = user;
        return rest;
    },
    /**
     * Authenticate a user and return a JWT token plus user data.
     */
    async login(email, password) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error("Invalid email or password");
        }
        const passwordMatches = await comparePassword(password, user.passwordHash);
        if (!passwordMatches) {
            throw new Error("Invalid email or password");
        }
        const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "24h" });
        // Strip passwordHash before returning
        const { passwordHash: _ph, ...rest } = user;
        return { token, user: rest };
    },
};
