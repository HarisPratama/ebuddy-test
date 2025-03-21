import { PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "@/store/reducers";

export const setUserAction = (state: UserState, action: PayloadAction<any>) => {
    state.user = action.payload;
    state.loading = false;
}
export const setUsersAction = (state: UserState, action: PayloadAction<any>) => {
    state.users = action.payload;
    state.loading = false;
}
export const setLoadingAction = (state: UserState, action: PayloadAction<boolean>) => {
    state.loading = action.payload;
}
export const setErrorAction = (state: UserState, action: PayloadAction<string | null>) => {
    state.error = action.payload;
}
export const setSuccessAction = (state: UserState, action: PayloadAction<string | null>) => {
    state.success = action.payload;
}
