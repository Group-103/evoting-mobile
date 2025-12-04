import React, { createContext, useState, useContext } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const lightTheme = {
    dark: false,
    colors: {
        background: '#f5f5f5',
        card: '#ffffff',
        text: '#333333',
        subtext: '#666666',
        primary: '#007AFF',
        border: '#dddddd',
        error: '#ff3b30',
        success: '#34c759',
    },
};

export const darkTheme = {
    dark: true,
    colors: {
        background: '#121212',
        card: '#1e1e1e',
        text: '#ffffff',
        subtext: '#aaaaaa',
        primary: '#0a84ff',
        border: '#333333',
        error: '#ff453a',
        success: '#32d74b',
    },
};

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemScheme === 'dark');

    const toggleTheme = () => setIsDark(prev => !prev);

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
