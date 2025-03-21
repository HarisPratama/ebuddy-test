'use client'

import React from 'react';
import {Box} from "@mui/system";
import {Controller, useForm} from "react-hook-form";
import {Button, Snackbar, Stack, TextField} from "@mui/material";

import {login, register} from "@/apis/userApi";
import {useDispatch, useSelector} from "react-redux";
import {setError, setLoading, setSuccess} from "@/store/reducers";
import {RootState} from "@/store/store";

interface FormData {
    name: string;
    email: string;
    password: string;
    onSubmit: (data: FormData) => void;
}

interface Props {
    type: 'login' | 'register';
}

const AuthForm: React.FC<Props> = ({ type }: Props) => {
    const dispatch = useDispatch();
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
    const loading = useSelector((state: RootState) => state.user.loading);
    const error = useSelector((state: RootState) => state.user.error);
    const success = useSelector((state: RootState) => state.user.success);

    const onSubmit = async (data: { email: string; password: string, name: string }) => {
        dispatch(setLoading(true));
        try {
            let resp: any
            if (type === 'login') resp = await login(data.email, data.password);
            if (type === 'register') resp = await register(data.email, data.password, data.name);
            dispatch(setLoading(false));
            if(resp && resp.message) dispatch(setSuccess(resp.message));
            setTimeout(() => {
                location.reload();
            }, 700)
        } catch (error: any) {
            dispatch(setError(error?.message ?? 'Something went wrong'));
            dispatch(setLoading(false));
        }
    }

    return (
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                {type === 'register' && <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    rules={{required: "Name is required"}}
                    render={({field}) => (
                        <TextField
                            {...field}
                            label="Name"
                            variant="outlined"
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            placeholder="Type your name"
                            focused
                        />
                    )}
                />}
                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Email is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Email"
                            variant="outlined"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            placeholder="Type your email"
                            focused
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Password is required" }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Password"
                            variant="outlined"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            placeholder="Type your password"
                            focused
                            type="password"
                        />
                    )}
                />
                <Button disabled={loading} type="submit" variant="contained" color="primary">
                    {loading ? 'Loading...' : type}
                </Button>
            </Stack>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={!!error?.length || !!success?.length}
                autoHideDuration={700}
                onClose={() => dispatch(setError(null))}
                message={error || success || "Something went wrong"}
            />
        </Box>
    )
}

export default AuthForm;
