import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {setUserAction, setErrorAction, setLoadingAction, setUsersAction, setSuccessAction} from './actions';

export interface UserState {
    user: any | null;
    users: any | null;
    loading: boolean;
    error: string | null;
    success: string | null;
}

const initialState: UserState = {
    user: null,
    users: null,
    loading: false,
    error: null,
    success: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: setUserAction,
        setUsers: setUsersAction,
        setError: setErrorAction,
        setLoading: setLoadingAction,
        setSuccess: setSuccessAction,
    },
});

export const { setUser, setUsers, setLoading, setError, setSuccess } = userSlice.actions;
export default userSlice.reducer;
