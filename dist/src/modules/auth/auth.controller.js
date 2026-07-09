import { AuthService } from "./auth.service.js";
import { catchAsync } from "../../app/utils/catch-async.js";
// Signup handler
export const signup = catchAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const { user, token } = await AuthService.register({
        name,
        email,
        password,
        role,
    });
    res.status(201).json({ token, user });
});
// Login handler
export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const { token, user } = await AuthService.login(email, password);
    res.status(200).json({ token, user });
});
// Logout handler - clears auth cookies
export const logout = (req, res) => {
    const cookieNames = [
        "accessToken",
        "userEmail",
        "userName",
        "userRole",
        "userId",
    ];
    cookieNames.forEach((name) => {
        res.clearCookie(name, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
};
export const authController = {
    signup,
    login,
    logout,
};
