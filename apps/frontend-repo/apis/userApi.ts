import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/apis/firebase";
import {createUserWithEmailAndPassword, signOut, updateProfile} from "@firebase/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const fetchUserData = async (userId: string, accessToken: string) => {
    try {
        const response = await fetch(`${BASE_URL}/fetch-user-data/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            }
        });
        return response.json();
    } catch (error) {
        throw new Error("Failed to fetch user data");
    }
};

export const updateUserData = async (userId: string, accessToken: string) => {
    try {
        const totalAverageWeightRatings = parseFloat((Math.random() * 5).toFixed(1)); // Random float from 0.0 to 5.0 (1 decimal)
        const numberOfRents = Math.floor(Math.random() * 100);

        await fetch(`${BASE_URL}/update-user-data/${userId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                totalAverageWeightRatings,
                numberOfRents,
                recentlyActive: Date.now()
            })
        });
        return { message: "User updated successfully" };
    } catch (error) {
        throw new Error("Failed to fetch user data");
    }
};

export const login = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        const userId = userCredential.user.uid;

        console.log(userCredential.user, '<<< ')
        document.cookie = `authToken=${token}; path=/; max-age=3600`;
        document.cookie = `userId=${userId}; path=/; max-age=3600`;

        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

export const register = async (email: string, password: string, name: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log(userCredential, '<<< user')
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: name,
        });

        const token = await userCredential.user.getIdToken();

        if (token) {
            const response = await fetch(`${BASE_URL}/update-user-data/${userCredential.user.uid}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userCredential.user.uid,
                    name: name,
                    email: email,
                    totalAverageWeightRatings: 0,
                    numberOfRents: 0,
                    recentlyActive: Date.now()
                })
            });
        }


        return { message: "User registered successfully", user };
    } catch (error) {
        console.log(error, '<<< error');
        return error
    }
}


export const logout = async () => {
    await signOut(auth);
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "userId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/login";
};

export const getCookie = (name: string) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) return decodeURIComponent(cookieValue);
    }
    return null;
};

