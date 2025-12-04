import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import * as DocumentPicker from 'expo-document-picker';

export default function AdminVotersScreen({ navigation }) {
    const { theme } = useTheme();
    const [voters, setVoters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
    });

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row', marginRight: 15 }}>
                    <TouchableOpacity
                        onPress={handleUploadCSV}
                        style={{ marginRight: 15 }}
                        disabled={uploading}
                    >
                        <Text style={{ fontSize: 24 }}>{uploading ? '⏳' : '📁'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteAll}>
                        <Text style={{ fontSize: 24 }}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, uploading]);

    const fetchVoters = async () => {
        try {
            const response = await api.get('/api/voters', {
                params: {
                    page: pagination.page,
                    limit: pagination.limit,
                }
            });
            setVoters(response.data.voters);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Failed to fetch voters:', error);
            Alert.alert('Error', 'Failed to fetch voters');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchVoters();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchVoters();
    };

    const handleUploadCSV = async () => {
        try {
            // Pick CSV file
            const result = await DocumentPicker.getDocumentAsync({
                type: 'text/csv',
                copyToCacheDirectory: true,
            });

            if (result.type === 'cancel') {
                return;
            }

            setUploading(true);

            // Create FormData
            const formData = new FormData();
            formData.append('file', {
                uri: result.uri,
                type: 'text/csv',
                name: result.name || 'voters.csv',
            });

            // Upload CSV
            const response = await api.post('/api/voters/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const summary = response.data.summary;
            Alert.alert(
                'Import Successful',
                `Total: ${summary.total}\nCreated: ${summary.created}\nUpdated: ${summary.updated}\nErrors: ${summary.errors}\nTotal in Database: ${summary.actualCountInDatabase}`,
                [{ text: 'OK', onPress: () => fetchVoters() }]
            );

        } catch (error) {
            console.error('CSV Upload Error:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to upload CSV';
            Alert.alert('Upload Failed', errorMessage);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteAll = () => {
        Alert.alert(
            'Delete All Voters',
            'This will delete ALL voters, positions, candidates, votes, and ballots. This action cannot be undone!\n\nAre you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete All',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const response = await api.delete('/api/voters/all');
                            Alert.alert('Success', response.data.message, [
                                { text: 'OK', onPress: () => fetchVoters() }
                            ]);
                        } catch (error) {
                            console.error('Delete All Error:', error);
                            Alert.alert('Error', 'Failed to delete voters');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.regNo}>{item.regNo}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                    <Text style={styles.phone}>{item.phone}</Text>
                    {item.program && (
                        <Text style={styles.program} numberOfLines={1}>{item.program}</Text>
                    )}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: theme.colors.success + '20' }]}>
                    <Text style={[styles.statusText, { color: theme.colors.success }]}>
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
        regNo: {
            fontSize: 14,
            color: theme.colors.primary,
            marginTop: 2,
            fontWeight: '600',
        },
        email: {
            fontSize: 12,
            color: theme.colors.subtext,
            marginTop: 2,
        },
        phone: {
            fontSize: 12,
            color: theme.colors.subtext,
            marginTop: 2,
        },
        program: {
            fontSize: 11,
            color: theme.colors.subtext,
            marginTop: 4,
            fontStyle: 'italic',
        },
        statusBadge: {
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
        },
        statusText: {
            fontSize: 10,
            fontWeight: 'bold',
        },
        emptyText: {
            textAlign: 'center',
            marginTop: 50,
            color: theme.colors.subtext,
            fontSize: 16,
        },
        headerText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.colors.text,
            padding: 20,
            paddingBottom: 10,
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
            <Text style={styles.headerText}>
                Total Voters: {pagination.total}
            </Text>
            <FlatList
                data={voters}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={<Text style={styles.emptyText}>No voters found. Upload a CSV file to add voters.</Text>}
            />
        </View>
    );
}
