import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminDashboardScreen({ navigation }) {
    const { theme, toggleTheme, isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({
        positions: 0,
        candidates: 0,
        voters: 0,
        votes: 0,
    });
    const [userName, setUserName] = useState('');

    const loadData = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                setUserName(user.name);
            }

            const [positionsRes, candidatesRes, votersRes, turnoutRes] = await Promise.all([
                api.get('/api/positions').catch(() => ({ data: [] })),
                api.get('/api/candidates').catch(() => ({ data: [] })),
                api.get('/api/voters').catch(() => ({ data: { pagination: { total: 0 } } })),
                api.get('/api/reports/turnout').catch(() => ({ data: { votesCast: 0 } })),
            ]);

            setStats({
                positions: positionsRes.data.length || 0,
                candidates: candidatesRes.data.length || 0,
                voters: votersRes.data.pagination?.total || votersRes.data.voters?.length || 0,
                votes: turnoutRes.data.votesCast || 0,
            });

        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
        navigation.replace('Welcome');
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
            paddingTop: 50, // For status bar
        },
        welcomeText: {
            fontSize: 14,
            color: theme.colors.subtext,
        },
        userName: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        content: {
            padding: 20,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 15,
            marginTop: 10,
        },
        statsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        statCard: {
            width: '48%',
            backgroundColor: theme.colors.card,
            padding: 15,
            borderRadius: 12,
            marginBottom: 15,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            borderLeftWidth: 4,
        },
        statLabel: {
            fontSize: 14,
            color: theme.colors.subtext,
            marginBottom: 5,
        },
        statValue: {
            fontSize: 24,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        menuGrid: {
            gap: 15,
        },
        menuButton: {
            backgroundColor: theme.colors.card,
            padding: 20,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        menuTextContainer: {
            flex: 1,
        },
        menuTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 4,
        },
        menuSubtitle: {
            fontSize: 14,
            color: theme.colors.subtext,
        },
        menuIcon: {
            fontSize: 24,
        },
        logoutButton: {
            marginTop: 30,
            padding: 15,
            backgroundColor: theme.colors.error || '#ff4444',
            borderRadius: 12,
            alignItems: 'center',
        },
        logoutText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
        },
        themeButton: {
            padding: 8,
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.userName}>{userName}</Text>
                </View>
                <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                    <Text style={{ fontSize: 24 }}>{isDark ? '☀️' : '🌙'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <Text style={styles.sectionTitle}>Overview</Text>

                <View style={styles.statsGrid}>
                    <View style={[styles.statCard, { borderLeftColor: '#005ea2' }]}>
                        <Text style={styles.statLabel}>Positions</Text>
                        <Text style={styles.statValue}>{loading ? '...' : stats.positions}</Text>
                    </View>
                    <View style={[styles.statCard, { borderLeftColor: '#4f46e5' }]}>
                        <Text style={styles.statLabel}>Candidates</Text>
                        <Text style={styles.statValue}>{loading ? '...' : stats.candidates}</Text>
                    </View>
                    <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
                        <Text style={styles.statLabel}>Voters</Text>
                        <Text style={styles.statValue}>{loading ? '...' : stats.voters}</Text>
                    </View>
                    <View style={[styles.statCard, { borderLeftColor: '#f59e0b' }]}>
                        <Text style={styles.statLabel}>Votes Cast</Text>
                        <Text style={styles.statValue}>{loading ? '...' : stats.votes}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Management</Text>

                <View style={styles.menuGrid}>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => navigation.navigate('AdminCandidates')}
                    >
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuTitle}>Candidates</Text>
                            <Text style={styles.menuSubtitle}>View all nominations</Text>
                        </View>
                        <Text style={styles.menuIcon}>👥</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => navigation.navigate('AdminPositions')}
                    >
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuTitle}>Positions</Text>
                            <Text style={styles.menuSubtitle}>View election positions</Text>
                        </View>
                        <Text style={styles.menuIcon}>📋</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => navigation.navigate('AdminVoters')}
                    >
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuTitle}>Voters</Text>
                            <Text style={styles.menuSubtitle}>Upload and manage voters CSV</Text>
                        </View>
                        <Text style={styles.menuIcon}>📁</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => navigation.navigate('Results')}
                    >
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuTitle}>Live Results</Text>
                            <Text style={styles.menuSubtitle}>View election standings</Text>
                        </View>
                        <Text style={styles.menuIcon}>📊</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => navigation.navigate('AuditLog')}
                    >
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuTitle}>Audit Log</Text>
                            <Text style={styles.menuSubtitle}>View system activity log</Text>
                        </View>
                        <Text style={styles.menuIcon}>📜</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => navigation.navigate('AdminCreateOfficer')}
                    >
                        <View style={styles.menuTextContainer}>
                            <Text style={styles.menuTitle}>Create Officer</Text>
                            <Text style={styles.menuSubtitle}>Add a new returning officer</Text>
                        </View>
                        <Text style={styles.menuIcon}>👮</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}
