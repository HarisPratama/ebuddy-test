import styles from './page.module.css';
import { Box } from "@mui/system";
import {Card, Stack, Typography} from "@mui/material";

import AuthForm from "@/components/AuthForm";
import Link from "next/link";

const RegisterPage = () => {

    return (
        <Box className={styles.Box}>
            <Card className={styles.Card}>
                <Stack spacing={2}>
                    <Typography className={styles.Typography} variant='h5'>Register</Typography>
                    <AuthForm type='register' />
                    <Typography className={styles.Typography} variant='body1'>Already have an account ?</Typography>
                    <Link href='/login'>
                        <Typography className={styles.Typography} variant='body1'>Login</Typography>
                    </Link>
                </Stack>
            </Card>
        </Box>
    )
}

export default RegisterPage;
