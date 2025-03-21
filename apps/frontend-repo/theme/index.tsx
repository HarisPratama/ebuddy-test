"use client";
import { createTheme, ThemeProvider } from '@mui/material';

export const theme = createTheme({
    components: {
        MuiInputBase: {
            defaultProps: {
                disableInjectingGlobalStyles: true,
            },
        },
    },
    palette: {
        mode: 'dark',
    },
});


export default function CustomThemProvider({ children }: { children: React.ReactNode }) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}