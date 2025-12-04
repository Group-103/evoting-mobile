import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function CandidateProfileScreen({ route, navigation }) {
    const { candidate } = route.params;
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            alignItems: 'center',
            padding: 30,
            backgroundColor: theme.colors.card,
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
        },
        avatar: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: '#ddd',
            marginBottom: 15,
        },
        name: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
            textAlign: 'center',
        },
        program: {
            fontSize: 16,
            color: theme.colors.primary,
            marginTop: 5,
        },
        content: {
            padding: 20,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 10,
            marginTop: 20,
        },
        text: {
            fontSize: 16,
            color: theme.colors.text,
            lineHeight: 24,
        },
        manifestoCard: {
            backgroundColor: theme.colors.card,
            padding: 20,
            borderRadius: 15,
            marginTop: 10,
        },
        backButton: {
            position: 'absolute',
            top: 40,
            left: 20,
            zIndex: 10,
            padding: 10,
        },
        backText: {
            fontSize: 16,
            color: theme.colors.primary,
            fontWeight: 'bold',
        }
    });

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                {candidate.photoUrl ? (
                    <Image source={{ uri: candidate.photoUrl }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, { justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ fontSize: 40, color: '#888' }}>
                            {candidate.name.charAt(0)}
                        </Text>
                    </View>
                )}
                <Text style={styles.name}>{candidate.name}</Text>
                <Text style={styles.program}>{candidate.program}</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Manifesto</Text>
                <View style={styles.manifestoCard}>
                    <Text style={styles.text}>
                        {candidate.manifestoUrl
                            ? "View full manifesto document (PDF support coming soon)"
                            : "No manifesto uploaded."}
                    </Text>
                    {/* Placeholder for actual manifesto text if available in DB */}
                    <Text style={[styles.text, { marginTop: 10 }]}>
                        "I promise to serve the students with integrity and dedication. My goal is to improve campus facilities and ensure every voice is heard."
                    </Text>
                </View>

                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.text}>
                    Running for the position of {candidate.position?.name || 'Student Leader'}.
                </Text>
            </View>
        </ScrollView>
    );
}

