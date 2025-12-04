import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
    Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function ManifestoViewerScreen({ navigation, route }) {
    const { theme } = useTheme();
    const { candidateId, manifestoUrl } = route.params || {};
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [localUri, setLocalUri] = useState(null);
    const [candidate, setCandidate] = useState(null);

    useEffect(() => {
        if (manifestoUrl) {
            loadManifesto();
        } else if (candidateId) {
            loadCandidateData();
        }
    }, []);

    const loadCandidateData = async () => {
        try {
            const response = await api.get('/api/candidates/my');
            if (response.data && response.data.length > 0) {
                const candidateData = response.data.find(c => c.id === candidateId) || response.data[0];
                setCandidate(candidateData);
                if (candidateData.manifestoUrl) {
                    loadManifesto(candidateData.manifestoUrl);
                } else {
                    Alert.alert('No Manifesto', 'No manifesto has been uploaded yet');
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error('Failed to load candidate:', error);
            Alert.alert('Error', 'Failed to load manifesto');
            setLoading(false);
        }
    };

    const loadManifesto = async (url = manifestoUrl) => {
        try {
            setLoading(true);
            // The manifestoUrl from backend is like '/uploads/manifesto-123.pdf'
            // We need to construct the full URL using the API base URL
            const baseURL = api.defaults.baseURL || 'http://localhost:5000';
            const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

            // For now, we'll just set the URL for WebView
            // In production, you might want to download it first
            setLocalUri(fullUrl);
            setLoading(false);
        } catch (error) {
            console.error('Error loading manifesto:', error);
            Alert.alert('Error', 'Failed to load manifesto');
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            setDownloading(true);
            const baseURL = api.defaults.baseURL || 'http://localhost:5000';
            const url = manifestoUrl || candidate?.manifestoUrl;
            const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

            const filename = url.split('/').pop() || 'manifesto.pdf';
            const fileUri = FileSystem.documentDirectory + filename;

            const downloadResult = await FileSystem.downloadAsync(fullUrl, fileUri);

            if (downloadResult.status === 200) {
                const canShare = await Sharing.isAvailableAsync();
                if (canShare) {
                    await Sharing.shareAsync(downloadResult.uri);
                } else {
                    Alert.alert('Success', `Manifesto downloaded to: ${downloadResult.uri}`);
                }
            } else {
                Alert.alert('Error', 'Failed to download manifesto');
            }
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Error', 'Failed to download manifesto');
        } finally {
            setDownloading(false);
        }
    };

    const handleOpenExternal = async () => {
        try {
            const baseURL = api.defaults.baseURL || 'http://localhost:5000';
            const url = manifestoUrl || candidate?.manifestoUrl;
            const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

            const canOpen = await Linking.canOpenURL(fullUrl);
            if (canOpen) {
                await Linking.openURL(fullUrl);
            } else {
                Alert.alert('Error', 'Cannot open URL');
            }
        } catch (error) {
            console.error('Open error:', error);
            Alert.alert('Error', 'Failed to open manifesto');
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.background,
        },
        webviewContainer: {
            flex: 1,
        },
        buttonContainer: {
            padding: 15,
            backgroundColor: theme.colors.card,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            flexDirection: 'row',
            gap: 10,
        },
        button: {
            flex: 1,
            backgroundColor: theme.colors.primary,
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
        },
        buttonSecondary: {
            backgroundColor: theme.colors.border,
        },
        buttonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 14,
        },
        buttonTextSecondary: {
            color: theme.colors.text,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        emptyIcon: {
            fontSize: 64,
            marginBottom: 20,
        },
        emptyTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: 10,
        },
        emptyText: {
            fontSize: 14,
            color: theme.colors.subtext,
            textAlign: 'center',
        },
        infoCard: {
            backgroundColor: theme.colors.card,
            padding: 15,
            margin: 15,
            borderRadius: 12,
        },
        infoText: {
            fontSize: 14,
            color: theme.colors.text,
            lineHeight: 22,
        },
    });

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ color: theme.colors.text, marginTop: 10 }}>Loading manifesto...</Text>
            </View>
        );
    }

    if (!localUri) {
        return (
            <View style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📄</Text>
                    <Text style={styles.emptyTitle}>No Manifesto Available</Text>
                    <Text style={styles.emptyText}>
                        You haven't uploaded a manifesto yet. Go to Edit Profile to upload one.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.webviewContainer}>
                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>
                        📱 Note: PDF viewing on mobile can be limited. You can download or open the manifesto in your device's PDF reader for the best experience.
                    </Text>
                </View>
                <WebView
                    source={{ uri: localUri }}
                    style={{ flex: 1, minHeight: 600 }}
                    startInLoadingState={true}
                    renderLoading={() => (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        </View>
                    )}
                />
            </ScrollView>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={handleOpenExternal}
                >
                    <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
                        Open Externally
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleDownload}
                    disabled={downloading}
                >
                    {downloading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.buttonText}>Download & Share</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
