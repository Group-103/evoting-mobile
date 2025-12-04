import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl, Alert, Image } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CandidateDashboardScreen({ navigation }) {
    const { theme, toggleTheme, isDark } = useTheme();
    const [user, setUser] = useState(null);
    const [candidateData, setCandidateData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDashboardData = async () => {
        try {
            // Get user data from storage
            const userDataStr = await AsyncStorage.getItem('userData');
            if (userDataStr) {
                const userData = JSON.parse(userDataStr);
                setUser(userData);

                // Fetch candidate specific details
                try {
                    const response = await api.get('/candidates/my');
                    if (response.data && response.data.length > 0) {
                        // Use the most recent nomination (first one due to sorting)
                        setCandidateData(response.data[0]);
                    }
                } catch (err) {
                    console.log('Failed to fetch candidate profile:', err);
                }
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            Alert.alert('Error', 'Failed to load dashboard data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchDashboardData();
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.multiRemove(['userToken', 'userData']);
                        navigation.replace('Welcome');
                    }
                }
            ]
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return '#10b981';
            case 'REJECTED': return '#ef4444';
            case 'PENDING': return '#f59e0b';
            default: return theme.colors.subtext;
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            padding: 20,
            backgroundColor: theme.colors.card,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 50,
        },
        headerTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        content: {
            padding: 20,
        },
        welcomeCard: {
            backgroundColor: theme.colors.primary,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
        },
        welcomeText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 5,
        },
        subWelcomeText: {
            color: 'rgba(255,255,255,0.8)',
            fontSize: 14,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 15,
            marginTop: 10,
        },
        statusCard: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            borderLeftWidth: 5,
            borderLeftColor: getStatusColor(candidateData?.status || 'PENDING'),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        statusLabel: {
            fontSize: 14,
            color: theme.colors.subtext,
            marginBottom: 5,
        },
        statusValue: {
            fontSize: 20,
            fontWeight: 'bold',
            color: getStatusColor(candidateData?.status || 'PENDING'),
        },
        infoCard: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 15,
            marginBottom: 15,
            flexDirection: 'row',
            alignItems: 'center',
        },
        infoIcon: {
            fontSize: 24,
            marginRight: 15,
        },
        infoContent: {
            flex: 1,
        },
        infoLabel: {
            fontSize: 12,
            color: theme.colors.subtext,
        },
        infoValue: {
            fontSize: 16,
            color: theme.colors.text,
            fontWeight: '500',
        },
        menuGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        menuItem: {
            width: '48%',
            backgroundColor: theme.colors.card,
            padding: 20,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 15,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        menuIcon: {
            fontSize: 32,
            marginBottom: 10,
        },
        menuText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
            textAlign: 'center',
        },
        logoutButton: {
            backgroundColor: theme.colors.error + '20',
            padding: 15,
            borderRadius: 12,
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 40,
        },
        logoutText: {
            color: theme.colors.error,
            fontWeight: 'bold',
            fontSize: 16,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Candidate Portal</Text>
                </View>
                <TouchableOpacity onPress={toggleTheme}>
                    <Text style={{ fontSize: 24 }}>{isDark ? '☀️' : '🌙'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.welcomeCard}>
                    <Text style={styles.welcomeText}>Hello, {user?.name || 'Candidate'}</Text>
                    <Text style={styles.subWelcomeText}>Manage your nomination and profile</Text>
                </View>

                <Text style={styles.sectionTitle}>Nomination Status</Text>
                <View style={styles.statusCard}>
                    <Text style={styles.statusLabel}>Current Status</Text>
                    <Text style={styles.statusValue}>{candidateData?.status || 'NOT SUBMITTED'}</Text>
                    {candidateData?.position && (
                        <Text style={[styles.infoLabel, { marginTop: 10 }]}>Running for: <Text style={{ fontWeight: 'bold' }}>{candidateData.position.name}</Text></Text>
                    )}
                </View>

                <Text style={styles.sectionTitle}>Your Details</Text>
                <View style={styles.infoCard}>
                    <Text style={styles.infoIcon}>📧</Text>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>{user?.email}</Text>
                    </View>
                </View>

                {candidateData && (
                    <>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoIcon}>🎓</Text>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Program</Text>
                                <Text style={styles.infoValue}>{candidateData.program}</Text>
                            </View>
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.infoIcon}>📜</Text>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Manifesto</Text>
                                <Text style={styles.infoValue} numberOfLines={2}>{candidateData.manifestoUrl || 'No manifesto uploaded'}</Text>
                            </View>
                        </View>
                    </>
                )}

                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.menuGrid}>
                    {!candidateData && (
                        <TouchableOpacity
                            style={[styles.menuItem, { width: '100%', backgroundColor: theme.colors.primary }]}
                            onPress={() => navigation.navigate('EditCandidateProfile')}
                        >
                            <Text style={[styles.menuIcon, { fontSize: 40 }]}>➕</Text>
                            <Text style={[styles.menuText, { color: '#fff', fontSize: 16 }]}>Submit Nomination</Text>
                        </TouchableOpacity>
                    )}

                    {candidateData && (
                        <>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => navigation.navigate('EditCandidateProfile')}
                            >
                                <Text style={styles.menuIcon}>✏️</Text>
                                <Text style={styles.menuText}>Edit Profile</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    if (candidateData?.manifestoUrl) {
                                        navigation.navigate('ManifestoViewer', {
                                            candidateId: candidateData.id,
                                            manifestoUrl: candidateData.manifestoUrl
                                        });
                                    } else {
                                        Alert.alert('No Manifesto', 'You haven\'t uploaded a manifesto yet. Use Edit Profile to upload one.');
                                    }
                                }}
                            >
                                <Text style={styles.menuIcon}>📄</Text>
                                <Text style={styles.menuText}>View Manifesto</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Results')}>
                        <Text style={styles.menuIcon}>📊</Text>
                        <Text style={styles.menuText}>View Results</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

