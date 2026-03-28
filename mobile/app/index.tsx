import Constants from 'expo-constants';
import React, { useMemo } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';

function getWebAppUrl() {
  if (process.env.EXPO_PUBLIC_WEB_APP_URL) {
    return process.env.EXPO_PUBLIC_WEB_APP_URL;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri ? hostUri.split(':')[0] : null;

  if (host) {
    return `http://${host}:5173`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5173';
  }

  return 'http://localhost:5173';
}

export default function MobileApp() {
  const webAppUrl = useMemo(() => getWebAppUrl(), []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webFallbackContainer}>
        <Text style={styles.webFallbackTitle}>Web uygulamayı aç</Text>
        <Text style={styles.webFallbackText}>{webAppUrl}</Text>
        <Pressable
          style={styles.openButton}
          onPress={() => {
            WebBrowser.openBrowserAsync(webAppUrl);
          }}>
          <Text style={styles.openButtonText}>Tarayıcıda Aç</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: webAppUrl }}
      setSupportMultipleWindows={false}
      javaScriptEnabled
      domStorageEnabled
      startInLoadingState
      renderLoading={() => <ActivityIndicator style={styles.loader} size="large" />}
      style={styles.webview}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
  loader: {
    marginTop: 24,
  },
  webFallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  webFallbackTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  webFallbackText: {
    fontSize: 14,
    textAlign: 'center',
  },
  openButton: {
    backgroundColor: '#450ef3',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  openButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
