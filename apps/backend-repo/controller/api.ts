import { Response } from "express";
import {updateUser, fetchUser, updateUserActivity, fetchTopUsers, createUser} from "../repository/userCollection";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
// @ts-ignore
import admin from "firebase-admin";

/**
 * Creates a new user in Firestore.
 * @param req Request - expects email, name, and password in body
 * @param res Express Response
 */
export const registerUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            res.status(400).json({ message: "Email, name, and password are required" });
            return;
        }

        // Create user in Firebase Auth
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        // Save user in Firestore
        await createUser(userRecord.uid, {
            email,
            name,
            totalAverageWeightRatings: 0,
            numberOfRents: 0,
            recentlyActive: Date.now()
        });

        res.status(201).json({ message: "User created successfully", userId: userRecord.uid });
    } catch (error: any) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

/**
 * Updates user data, recalculates potentialScore when necessary.
 * @param req AuthenticatedRequest - expects userId and update fields in body
 * @param res Express Response
 */
export const updateUserData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        console.log(req.body, '<<< body');
        const { userId, ...data } = req.body;
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }

        await updateUser(userId, data);
        await updateUserActivity(userId);
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user", error });
    }
};

/**
 * Fetches user data from Firestore.
 * @param req AuthenticatedRequest - expects userId in params
 * @param res Express Response
 */
export const fetchUserData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }

        const user = await fetchUser(userId);
        if (!user) {
            if (req.user) {
                const data = {
                    email: req.user.email,
                }
                await updateUser(userId, data);
            }
            res.status(404).json({ message: "User not found" });
            return;
        }

        await updateUserActivity(userId);

        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : 10; // Default to 10 users
        const lastDocId = req.query.lastDocId as string | undefined; // Cursor for pagination

        let lastDoc = null;
        if (lastDocId) {
            const lastDocSnapshot = await admin.firestore().collection("USERS").doc(lastDocId).get();
            if (lastDocSnapshot.exists) {
                lastDoc = lastDocSnapshot;
            }
        }

        const { users, lastDoc: newLastDoc } = await fetchTopUsers(lastDoc, pageSize);

        res.status(200).json({ userInformation: user, users, lastDoc });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user", error });
    }
};
