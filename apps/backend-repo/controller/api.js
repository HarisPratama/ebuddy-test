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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserData = exports.updateUserData = exports.registerUser = void 0;
const userCollection_1 = require("../repository/userCollection");
// @ts-ignore
const firebase_admin_1 = require("firebase-admin");
/**
 * Creates a new user in Firestore.
 * @param req Request - expects email, name, and password in body
 * @param res Express Response
 */
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            res.status(400).json({ message: "Email, name, and password are required" });
            return;
        }
        // Create user in Firebase Auth
        const userRecord = yield firebase_admin_1.default.auth().createUser({
            email,
            password,
            displayName: name,
        });
        // Save user in Firestore
        yield (0, userCollection_1.createUser)(userRecord.uid, {
            email,
            name,
            totalAverageWeightRatings: 0,
            numberOfRents: 0,
            recentlyActive: Date.now()
        });
        res.status(201).json({ message: "User created successfully", userId: userRecord.uid });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});
exports.registerUser = registerUser;
/**
 * Updates user data, recalculates potentialScore when necessary.
 * @param req AuthenticatedRequest - expects userId and update fields in body
 * @param res Express Response
 */
const updateUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body, '<<< body');
        const _a = req.body, { userId } = _a, data = __rest(_a, ["userId"]);
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }
        yield (0, userCollection_1.updateUser)(userId, data);
        yield (0, userCollection_1.updateUserActivity)(userId);
        res.status(200).json({ message: "User updated successfully" });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user", error });
    }
});
exports.updateUserData = updateUserData;
/**
 * Fetches user data from Firestore.
 * @param req AuthenticatedRequest - expects userId in params
 * @param res Express Response
 */
const fetchUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }
        const user = yield (0, userCollection_1.fetchUser)(userId);
        if (!user) {
            if (req.user) {
                const data = {
                    email: req.user.email,
                };
                yield (0, userCollection_1.updateUser)(userId, data);
            }
            res.status(404).json({ message: "User not found" });
            return;
        }
        yield (0, userCollection_1.updateUserActivity)(userId);
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10; // Default to 10 users
        const lastDocId = req.query.lastDocId; // Cursor for pagination
        let lastDoc = null;
        if (lastDocId) {
            const lastDocSnapshot = yield firebase_admin_1.default.firestore().collection("USERS").doc(lastDocId).get();
            if (lastDocSnapshot.exists) {
                lastDoc = lastDocSnapshot;
            }
        }
        const { users, lastDoc: newLastDoc } = yield (0, userCollection_1.fetchTopUsers)(lastDoc, pageSize);
        res.status(200).json({ userInformation: user, users, lastDoc });
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user", error });
    }
});
exports.fetchUserData = fetchUserData;
