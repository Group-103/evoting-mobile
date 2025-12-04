import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function AdminPositionsScreen({ navigation }) {
    const { theme } = useTheme();
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('AdminCreatePosition')}
                    style={{ marginRight: 15 }}
                >
                    <Text style={{ fontSize: 24 }}>➕</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const fetchPositions = async () => {
        try {
            const response = await api.get('/api/positions');
            setPositions(response.data);
        } catch (error) {
            console.error('Failed to fetch positions:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPositions();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('AdminEditPosition', { position: item })}
        >
            <View style={styles.header}>
                <Text style={styles.title}>{item.name}</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.maxVotes} Vote(s)</Text>
                </View>
            </View>

            <View style={styles.dateContainer}>
                <View style={styles.dateRow}>
                    <Text style={styles.dateLabel}>Opens:</Text>
                    <Text style={styles.dateValue}>{formatDate(item.votingOpens)}</Text>
                </View>
                <View style={styles.dateRow}>
                    <Text style={styles.dateLabel}>Closes:</Text>
                    <Text style={styles.dateValue}>{formatDate(item.votingCloses)}</Text>
                </View>
            </View>

            <Text style={styles.description} numberOfLines={2}>
                {item.description || 'No description provided'}
            </Text>

            <Text style={styles.tapToEdit}>Tap to edit ✏️</Text>
        </TouchableOpacity>
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
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.colors.text,
            flex: 1,
        },
        badge: {
            backgroundColor: theme.colors.primary + '20',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
        },
        badgeText: {
            color: theme.colors.primary,
            fontSize: 12,
            fontWeight: 'bold',
        },
        dateContainer: {
            backgroundColor: theme.colors.background,
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
        },
        dateRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 4,
        },
        dateLabel: {
            fontSize: 12,
            color: theme.colors.subtext,
        },
        dateValue: {
            fontSize: 12,
            color: theme.colors.text,
            fontWeight: '500',
        },
        description: {
            fontSize: 14,
            color: theme.colors.subtext,
        },
        tapToEdit: {
            fontSize: 12,
            color: theme.colors.primary,
            fontStyle: 'italic',
            marginTop: 8,
            textAlign: 'right',
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
                data={positions}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={<Text style={styles.emptyText}>No positions found</Text>}
            />
        </View>
    );
}
