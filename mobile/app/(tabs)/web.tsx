import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
let WebViewComponent: any = null;
try {
  WebViewComponent = require('react-native-webview').WebView;
} catch (e) {
  WebViewComponent = null;
}
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function WebScreen() {
  const [url, setUrl] = useState('https://tasimacilik-web.loca.lt');
  const [loading, setLoading] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Open web app in WebView</ThemedText>
      <View style={styles.controls}>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={Platform.OS === 'web' ? 'url' : 'default'}
        />
        <Button
          title="Open"
          onPress={() => {
            if (WebViewComponent) {
              setLoading(true);
            } else {
              WebBrowser.openBrowserAsync(url);
            }
          }}
        />
      </View>

      {loading && WebViewComponent ? (
        <WebViewComponent
          source={{ uri: url }}
          onLoadEnd={() => setLoading(false)}
          startInLoadingState
          renderLoading={() => <ActivityIndicator style={styles.loading} size="large" />}
          style={styles.webview}
        />
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
  },
  webview: {
    flex: 1,
    marginTop: 8,
  },
  loading: {
    marginTop: 20,
  },
});