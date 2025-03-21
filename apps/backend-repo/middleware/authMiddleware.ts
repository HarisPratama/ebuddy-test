import {NextFunction, Request, Response} from 'express';
import * as admin from 'firebase-admin';

export interface AuthenticatedRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        req.user = await admin.auth().verifyIdToken(token);
        next();
    } catch (error) {
        res.status(403).json({ message: JSON.stringify(error) || "Invalid token" });
    }
};