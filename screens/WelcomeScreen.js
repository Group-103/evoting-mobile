import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function WelcomeScreen({ navigation }) {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
        },
        title: {
            fontSize: 32,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.colors.text,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 18,
            color: theme.colors.subtext,
            marginBottom: 50,
            textAlign: 'center',
        },
        button: {
            width: '100%',
            height: 60,
            backgroundColor: theme.colors.primary,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
        },
        secondaryButton: {
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        buttonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
        },
        secondaryButtonText: {
            color: theme.colors.text,
        },
        icon: {
            fontSize: 60,
            marginBottom: 20,
        }
    });

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>🗳️</Text>
            <Text style={styles.title}>University E-Voting</Text>
            <Text style={styles.subtitle}>Secure, Transparent, Easy.</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('VoterLogin')}
            >
                <Text style={styles.buttonText}>I am a Voter</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => navigation.navigate('StaffLogin')}
            >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Candidate / Official Login</Text>
            </TouchableOpacity>
        </View>
    );
}
