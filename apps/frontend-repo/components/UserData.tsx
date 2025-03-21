'use client'
import { Box } from "@mui/system";
import {useDispatch, useSelector} from "react-redux";
import React, { useEffect } from "react";

import {setError, setLoading, setSuccess, setUser, setUsers} from "@/store/reducers";
import {fetchUserData, getCookie, logout, updateUserData} from "@/apis/userApi";
import {Avatar, Button, Card, CardHeader, Container, IconButton, Snackbar, Stack, Typography} from "@mui/material";
import {RootState} from "@/store/store";
import {red} from "@mui/material/colors";
import UsersTable from "@/components/UsersTable";

function MoreVertIcon() {
    return null;
}

const UserData = () => {
    const dispatch = useDispatch()
    const userInformation = useSelector((state: RootState) => state.user.user);
    const listOfUser = useSelector((state: RootState) => state.user.users);
    const loading = useSelector((state: RootState) => state.user.loading);
    const success = useSelector((state: RootState) => state.user.success);

    const fetchUser = async () => {
        dispatch(setLoading(true))
        const token = getCookie('authToken')
        const userId = getCookie('userId')
        try {
            if(userId && token) {
                const userData = await fetchUserData(userId, token)
                console.log('userData', userData)
                if(userData.userInformation) dispatch(setUser(userData.userInformation))
                if(userData.users) dispatch(setUsers(userData.users))
            }
        } catch (e) {
            dispatch(setLoading(false))
        }
    }
    const updateUser = async () => {
        dispatch(setLoading(true))
        const token = getCookie('authToken')
        const userId = getCookie('userId')
        try {
            if(userId && token) {
                const resp = await updateUserData(userId, token)
                if (resp && resp.message) dispatch(setSuccess(resp.message))
                dispatch(setLoading(false))
                setTimeout(() => dispatch(setSuccess(null)), 700)
            }
        } catch (e) {
            dispatch(setLoading(false))
        }
    }

    return (
        <Container maxWidth='md'>
            <Button onClick={logout}>Logout</Button>
            <Stack spacing={10}>
                <Stack direction='row' spacing={2}>
                    <Button disabled={loading} onClick={fetchUser}>{loading ? 'Loading...' : 'Display User Information'}</Button>
                    <Button disabled={loading} onClick={updateUser}>{loading ? 'Loading...' : 'Update User'}</Button>
                </Stack>
                {userInformation?.email && <Card variant="outlined">
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                {userInformation.email[0]}
                            </Avatar>
                        }
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                        title={userInformation?.name ?? userInformation?.email}
                        subheader={'Last activity: ' + new Date(userInformation?.recentlyActive * 1000).toDateString()}
                    />
                </Card>}
                <Typography variant="body2" color="textSecondary">List User</Typography>
                {listOfUser && <UsersTable rows={listOfUser}/>}
            </Stack>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={!!success?.length}
                autoHideDuration={700}
                onClose={() => dispatch(setError(null))}
                message={ success || "Something went wrong"}
            />

        </Container>
    )
}

export default UserData
