import { User } from "../../../generated/prisma/client";
import { prisma } from "../../app/lib/prisma";
import { hashPassword, comparePassword } from "../../utils/password";
import jwt from "jsonwebtoken";

interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: string; // optional, defaults to Team_Member via DB default
}

export const AuthService = {
  /**
   * Register a new user.
   * Returns the created user object without the password hash.
   */
  async register(data: RegisterDto): Promise<Omit<User, "passwordHash">> {
    const { name, email, password, role } = data;
    let passwordHash;
    if (password) {
      passwordHash = await hashPassword(password);
    } else {
      throw new Error("Password is required");
    }
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        ...(role && { role: role as any }),
      },
    });
    // Omit passwordHash before returning
    // @ts-ignore – Prisma type includes passwordHash, we remove it manually
    const { passwordHash: _ph, ...rest } = user as any;
    return rest;
  },

  /**
   * Authenticate a user and return a JWT token plus user data.
   */
  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; user: Omit<User, "passwordHash"> }> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const passwordMatches = await comparePassword(password, user.passwordHash);
    if (!passwordMatches) {
      throw new Error("Invalid email or password");
    }
    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );
    // Strip passwordHash before returning
    const { passwordHash: _ph, ...rest } = user as any;
    return { token, user: rest };
  },
};
