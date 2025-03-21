import { db } from '../config/firebaseConfig';
import { User } from '../entities/user';
import { DocumentSnapshot } from 'firebase-admin/firestore';

const usersCollection = db.collection('USERS');

/**
 * Creates a new user document in Firestore.
 * @param userId string
 * @param data Partial<User>
 */
export const createUser = async (userId: string, data: Partial<User>) => {
    await usersCollection.doc(userId).set(data);
};

/**
 * Calculates the potentialScore based on weighted factors.
 * @param totalAverageWeightRatings User's rating score (higher is better)
 * @param numberOfRents Total number of rents (higher is better)
 * @param recentlyActive Last active timestamp (higher is better)
 * @returns Computed potential score
 */
const calculatePotentialScore = (totalAverageWeightRatings: number = 0, numberOfRents: number = 0, recentlyActive: number): number => {
    return (totalAverageWeightRatings * 1000) + (numberOfRents * 10) + (recentlyActive / 1e9);
};

/**
 * Updates a user's data and recalculates the potential score if relevant fields change.
 * @param userId The user's ID
 * @param data Partial user data to update
 */
export const updateUser = async (userId: string, data: Partial<User>) => {
    const existingUserDoc = await usersCollection.doc(userId).get();
    // if (!existingUserDoc.exists) {
    //     await usersCollection.doc(userId).set(data);
    // }

    const existingUser = existingUserDoc.data() as User;

    const updatedTotalAverageWeightRatings = data.totalAverageWeightRatings ?? existingUser.totalAverageWeightRatings;
    const updatedNumberOfRents = data.numberOfRents ?? existingUser.numberOfRents;
    const updatedRecentlyActive = data.recentlyActive ?? existingUser.recentlyActive;

    const updatedPotentialScore = calculatePotentialScore(updatedTotalAverageWeightRatings, updatedNumberOfRents, updatedRecentlyActive);

    await usersCollection.doc(userId).set({ ...data, potentialScore: updatedPotentialScore }, { merge: true });
};

/**
 * Retrieves user data from Firestore.
 * @param userId The user's ID
 * @returns The user object or null if not found
 */
export const fetchUser = async (userId: string): Promise<User | null> => {
    const doc: DocumentSnapshot = await usersCollection.doc(userId).get();
    return doc.exists ? (doc.data() as User) : null;
};

/**
 * Updates the user's last active time and recalculates potentialScore.
 * Should be called on login or any user activity.
 * @param userId The user's ID
 */
export const updateUserActivity = async (userId: string) => {
    const recentlyActive = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds

    const existingUser = await fetchUser(userId);
    if (!existingUser) throw new Error("User not found");

    const updatedPotentialScore = calculatePotentialScore(existingUser.totalAverageWeightRatings, existingUser.numberOfRents, recentlyActive);

    await usersCollection.doc(userId).set({ recentlyActive, potentialScore: updatedPotentialScore }, { merge: true });
};

/**
 * Fetches top users ranked by potentialScore, supporting pagination.
 * @param lastDoc Optional: last document from previous query for pagination
 * @param pageSize Number of users per page (default: 10)
 * @returns List of top users and reference to the last document for pagination
 */
export const fetchTopUsers = async (lastDoc: DocumentSnapshot | null = null, pageSize: number = 10) => {
    let queryRef = usersCollection.orderBy("potentialScore", "desc").limit(pageSize);

    if (lastDoc) {
        queryRef = queryRef.startAfter(lastDoc);
    }

    const snapshot = await queryRef.get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));

    return {
        users,
        lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
    };
};
