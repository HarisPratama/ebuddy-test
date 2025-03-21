"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const admin = require("firebase-admin");
const dotenv = require("dotenv");
dotenv.config();
const serviceAccount = require("../ebuddy-1a6a0-firebase-adminsdk-fbsvc-8e9ee06eee.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
exports.db = admin.firestore();
