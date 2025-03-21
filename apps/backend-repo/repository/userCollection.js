"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTopUsers = exports.updateUserActivity = exports.fetchUser = exports.updateUser = exports.createUser = void 0;
const firebaseConfig_1 = require("../config/firebaseConfig");
const usersCollection = firebaseConfig_1.db.collection('USERS');
/**
 * Creates a new user document in Firestore.
 * @param userId string
 * @param data Partial<User>
 */
const createUser = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield usersCollection.doc(userId).set(data);
});
exports.createUser = createUser;
/**
 * Calculates the potentialScore based on weighted factors.
 * @param totalAverageWeightRatings User's rating score (higher is better)
 * @param numberOfRents Total number of rents (higher is better)
 * @param recentlyActive Last active timestamp (higher is better)
 * @returns Computed potential score
 */
const calculatePotentialScore = (totalAverageWeightRatings = 0, numberOfRents = 0, recentlyActive) => {
    return (totalAverageWeightRatings * 1000) + (numberOfRents * 10) + (recentlyActive / 1e9);
};
/**
 * Updates a user's data and recalculates the potential score if relevant fields change.
 * @param userId The user's ID
 * @param data Partial user data to update
 */
const updateUser = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const existingUserDoc = yield usersCollection.doc(userId).get();
    // if (!existingUserDoc.exists) {
    //     await usersCollection.doc(userId).set(data);
    // }
    const existingUser = existingUserDoc.data();
    const updatedTotalAverageWeightRatings = (_a = data.totalAverageWeightRatings) !== null && _a !== void 0 ? _a : existingUser.totalAverageWeightRatings;
    const updatedNumberOfRents = (_b = data.numberOfRents) !== null && _b !== void 0 ? _b : existingUser.numberOfRents;
    const updatedRecentlyActive = (_c = data.recentlyActive) !== null && _c !== void 0 ? _c : existingUser.recentlyActive;
    const updatedPotentialScore = calculatePotentialScore(updatedTotalAverageWeightRatings, updatedNumberOfRents, updatedRecentlyActive);
    yield usersCollection.doc(userId).set(Object.assign(Object.assign({}, data), { potentialScore: updatedPotentialScore }), { merge: true });
});
exports.updateUser = updateUser;
/**
 * Retrieves user data from Firestore.
 * @param userId The user's ID
 * @returns The user object or null if not found
 */
const fetchUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield usersCollection.doc(userId).get();
    return doc.exists ? doc.data() : null;
});
exports.fetchUser = fetchUser;
/**
 * Updates the user's last active time and recalculates potentialScore.
 * Should be called on login or any user activity.
 * @param userId The user's ID
 */
const updateUserActivity = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const recentlyActive = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
    const existingUser = yield (0, exports.fetchUser)(userId);
    if (!existingUser)
        throw new Error("User not found");
    const updatedPotentialScore = calculatePotentialScore(existingUser.totalAverageWeightRatings, existingUser.numberOfRents, recentlyActive);
    yield usersCollection.doc(userId).set({ recentlyActive, potentialScore: updatedPotentialScore }, { merge: true });
});
exports.updateUserActivity = updateUserActivity;
/**
 * Fetches top users ranked by potentialScore, supporting pagination.
 * @param lastDoc Optional: last document from previous query for pagination
 * @param pageSize Number of users per page (default: 10)
 * @returns List of top users and reference to the last document for pagination
 */
const fetchTopUsers = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (lastDoc = null, pageSize = 10) {
    let queryRef = usersCollection.orderBy("potentialScore", "desc").limit(pageSize);
    if (lastDoc) {
        queryRef = queryRef.startAfter(lastDoc);
    }
    const snapshot = yield queryRef.get();
    const users = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
    return {
        users,
        lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
    };
});
exports.fetchTopUsers = fetchTopUsers;
