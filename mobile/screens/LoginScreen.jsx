import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SIZES, FONTS } from '../constants'
import { api } from '../api'

export default function LoginScreen() {
  const [userType, setUserType] = useState('user') // 'user' or 'company'
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!identifier.trim()) {
      Alert.alert('Hata', 'Lütfen e-mail veya telefon numarası girin')
      return
    }

    if (userType === 'company' && !taxNumber.trim()) {
      Alert.alert('Hata', 'Lütfen vergi numarası girin')
      return
    }

    if (userType === 'user' && !password.trim()) {
      Alert.alert('Hata', 'Lütfen parolayı girin')
      return
    }

    setLoading(true)
    try {
      let response
      if (userType === 'company') {
        response = await api.loginCompany(identifier, taxNumber)
      } else {
        response = await api.login(identifier, password)
      }

      if (response.success) {
        const normalizedUser = response.user?.isCompany
          ? { ...response.user, firmId: response.user.id }
          : response.user

        await AsyncStorage.setItem('user', JSON.stringify(normalizedUser))
        if (response.token) {
          await AsyncStorage.setItem('token', response.token)
        }
        setIdentifier('')
        setPassword('')
        setTaxNumber('')
      } else {
        Alert.alert('Hata', response.error || 'Giriş başarısız')
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata meydana geldi')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500' }}
      style={styles.background}
      blurRadius={3}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="truck" size={80} color={COLORS.white} />
            <Text style={styles.appName}>Taşımacılık Rehberi</Text>
            <Text style={styles.appSubtitle}>Mobil Uygulaması</Text>
          </View>

          {/* User Type Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                userType === 'user' && styles.toggleButtonActive,
              ]}
              onPress={() => setUserType('user')}
            >
              <Text
                style={[
                  styles.toggleText,
                  userType === 'user' && styles.toggleTextActive,
                ]}
              >
                Bireysel Giriş
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                userType === 'company' && styles.toggleButtonActive,
              ]}
              onPress={() => setUserType('company')}
            >
              <Text
                style={[
                  styles.toggleText,
                  userType === 'company' && styles.toggleTextActive,
                ]}
              >
                Firma Girişi
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {userType === 'user' ? 'E-mail veya Telefon' : 'Firma Adı veya E-mail'}
              </Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={COLORS.primary} />
                <TextInput
                  style={styles.input}
                  placeholder={userType === 'user' ? 'ornek@email.com' : 'Örnek Nakliye'}
                  value={identifier}
                  onChangeText={setIdentifier}
                  placeholderTextColor={COLORS.textSecondary}
                  editable={!loading}
                />
              </View>
            </View>

            {userType === 'company' ? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Vergi Numarası</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="document-outline" size={20} color={COLORS.primary} />
                  <TextInput
                    style={styles.input}
                    placeholder="1234567890"
                    value={taxNumber}
                    onChangeText={setTaxNumber}
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="numeric"
                    editable={!loading}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Parola</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor={COLORS.textSecondary}
                    secureTextEntry={!showPassword}
                    editable={!loading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons name="log-in" size={20} color={COLORS.white} />
                  <Text style={styles.loginButtonText}>Giriş Yap</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Hesabın yok mu?</Text>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SIZES.md,
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: SIZES.lg,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SIZES.md,
  },
  appSubtitle: {
    fontSize: FONTS.normal,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.lg,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SIZES.xs,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: SIZES.sm,
    alignItems: 'center',
    borderRadius: 7,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: FONTS.normal,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  formContainer: {
    gap: SIZES.md,
  },
  inputGroup: {
    marginBottom: SIZES.md,
  },
  label: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: SIZES.md,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    paddingVertical: SIZES.sm,
    marginHorizontal: SIZES.sm,
    fontSize: FONTS.normal,
    color: COLORS.text,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.sm,
    marginTop: SIZES.md,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: FONTS.medium,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.md,
  },
  footerText: {
    fontSize: FONTS.normal,
    color: COLORS.textSecondary,
  },
  signupLink: {
    fontSize: FONTS.normal,
    color: COLORS.secondary,
    fontWeight: 'bold',
    marginLeft: SIZES.xs,
  },
})
