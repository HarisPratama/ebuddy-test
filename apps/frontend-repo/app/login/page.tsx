import styles from './page.module.css';
import Link from 'next/link'
import { Box } from "@mui/system";
import {Card, Stack, Typography} from "@mui/material";

import AuthForm from "@/components/AuthForm";

const LoginPage = () => {

    return (
        <Box className={styles.Box}>
            <Card className={styles.Card}>
                <Stack spacing={2}>
                    <Typography className={styles.Typography} variant='h5'>Login</Typography>
                    <AuthForm type='login' />
                    <Typography className={styles.Typography} variant='body1'>Not registered yet ?</Typography>
                    <Link href='/register'>
                        <Typography className={styles.Typography} variant='body1'>Register</Typography>
                    </Link>
                </Stack>
            </Card>
        </Box>
    )
}

export default LoginPage;
