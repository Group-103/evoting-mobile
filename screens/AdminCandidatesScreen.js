import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function AdminCandidatesScreen({ navigation }) {
    const { theme } = useTheme();
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('AdminCreateCandidate')}
                    style={{ marginRight: 15 }}
                >
                    <Text style={{ fontSize: 24 }}>➕</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const fetchCandidates = async () => {
        try {
            const response = await api.get('/api/candidates');
            setCandidates(response.data);
        } catch (error) {
            console.error('Failed to fetch candidates:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCandidates();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return '#10b981';
            case 'REJECTED': return '#ef4444';
            case 'PENDING': return '#f59e0b';
            default: return theme.colors.subtext;
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.position}>{item.position?.name || 'Unknown Position'}</Text>
                    <Text style={styles.email}>{item.user?.email}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status}
                    </Text>
                </View>
            </View>
        </View>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        listContent: {
            padding: 20,
        },
        card: {
            backgroundColor: theme.colors.card,
            borderRadius: 12,
            padding: 15,
            marginBottom: 15,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        avatar: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 15,
        },
        avatarText: {
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
        },
        info: {
            flex: 1,
        },
        name: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.colors.text,
        },
        position: {
            fontSize: 14,
            color: theme.colors.primary,
            marginTop: 2,
        },
        email: {
            fontSize: 12,
            color: theme.colors.subtext,
            marginTop: 2,
        },
        statusBadge: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
        },
        statusText: {
            fontSize: 12,
            fontWeight: 'bold',
        },
        emptyText: {
            textAlign: 'center',
            marginTop: 50,
            color: theme.colors.subtext,
            fontSize: 16,
        },
    });

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={candidates}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={<Text style={styles.emptyText}>No candidates found</Text>}
            />
        </View>
    );
}
