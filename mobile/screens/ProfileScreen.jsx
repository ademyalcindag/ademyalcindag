import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLORS, SIZES, FONTS } from '../constants'

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setEditData(parsedUser)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(editData))
      setUser(editData)
      setEditMode(false)
      Alert.alert('Başarılı', 'Profil güncellendi')
    } catch (error) {
      Alert.alert('Hata', 'Profil güncellenemedi')
      console.error('Error:', error)
    }
  }

  const handleLogout = async () => {
    Alert.alert('Çıkış', 'Eminmisiniz?', [
      { text: 'İptal', onPress: () => {} },
      {
        text: 'Çıkış Yap',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('user')
            // This will trigger the app to show the login screen
          } catch (error) {
            console.error('Logout error:', error)
          }
        },
      },
    ])
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="person-outline" size={48} color={COLORS.textSecondary} />
        <Text style={styles.emptyText}>Profil verisi yok</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.headerCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color={COLORS.white} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userType}>
                {user.isCompany ? '🏢 Firma' : '👤 Bireysel'}
              </Text>
            </View>
          </View>
        </View>

        {/* Profile Details */}
        {editMode ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profili Düzenle</Text>

            <View style={styles.editCard}>
              <Text style={styles.label}>Ad Soyad / Firma Adı</Text>
              <TextInput
                style={styles.input}
                value={editData.name}
                onChangeText={(text) =>
                  setEditData({ ...editData, name: text })
                }
                placeholder="Ad girin"
              />

              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                value={editData.email}
                onChangeText={(text) =>
                  setEditData({ ...editData, email: text })
                }
                placeholder="E-mail girin"
                keyboardType="email-address"
              />

              <Text style={styles.label}>Telefon</Text>
              <TextInput
                style={styles.input}
                value={editData.phone}
                onChangeText={(text) =>
                  setEditData({ ...editData, phone: text })
                }
                placeholder="Telefon girin"
                keyboardType="phone-pad"
              />

              {user.isCompany && (
                <>
                  <Text style={styles.label}>Vergi Numarası</Text>
                  <TextInput
                    style={styles.input}
                    value={editData.taxNumber}
                    onChangeText={(text) =>
                      setEditData({ ...editData, taxNumber: text })
                    }
                    placeholder="Vergi numarası girin"
                    keyboardType="numeric"
                    editable={false}
                  />
                </>
              )}

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setEditMode(false)
                    setEditData(user)
                  }}
                >
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveProfile}
                >
                  <Ionicons name="checkmark" size={18} color={COLORS.white} />
                  <Text style={styles.saveButtonText}>Kaydet</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
                <TouchableOpacity onPress={() => setEditMode(true)}>
                  <Ionicons name="pencil" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoItem}>
                  <View style={styles.infoLeft}>
                    <Ionicons name="mail" size={20} color={COLORS.primary} />
                    <Text style={styles.infoLabel}>E-mail</Text>
                  </View>
                  <Text style={styles.infoValue}>{user.email}</Text>
                </View>

                {user.phone && (
                  <View style={styles.infoItem}>
                    <View style={styles.infoLeft}>
                      <Ionicons name="call" size={20} color={COLORS.primary} />
                      <Text style={styles.infoLabel}>Telefon</Text>
                    </View>
                    <Text style={styles.infoValue}>{user.phone}</Text>
                  </View>
                )}

                {user.isCompany && user.taxNumber && (
                  <View style={styles.infoItem}>
                    <View style={styles.infoLeft}>
                      <Ionicons
                        name="document"
                        size={20}
                        color={COLORS.primary}
                      />
                      <Text style={styles.infoLabel}>Vergi No.</Text>
                    </View>
                    <Text style={styles.infoValue}>{user.taxNumber}</Text>
                  </View>
                )}

                <View style={styles.infoItem}>
                  <View style={styles.infoLeft}>
                    <Ionicons name="calendar" size={20} color={COLORS.primary} />
                    <Text style={styles.infoLabel}>Üye Olma Tarihi</Text>
                  </View>
                  <Text style={styles.infoValue}>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('tr-TR')
                      : '-'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Settings Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ayarlar</Text>

              <View style={styles.settingsCard}>
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="notifications" size={20} color={COLORS.primary} />
                    <Text style={styles.settingLabel}>Bildirimler</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="lock-closed" size={20} color={COLORS.primary} />
                    <Text style={styles.settingLabel}>Priv asi</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="help-circle" size={20} color={COLORS.primary} />
                    <Text style={styles.settingLabel}>Yardım</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Logout Button */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Ionicons name="log-out" size={20} color={COLORS.white} />
                <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SIZES.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  emptyText: {
    fontSize: FONTS.normal,
    color: COLORS.textSecondary,
    marginTop: SIZES.md,
  },
  headerCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  userType: {
    fontSize: FONTS.normal,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    marginBottom: SIZES.lg,
  },
  sectionTitle: {
    fontSize: FONTS.medium,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SIZES.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  infoLabel: {
    fontSize: FONTS.normal,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: FONTS.normal,
    fontWeight: '600',
    color: COLORS.text,
  },
  editCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
    marginTop: SIZES.md,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    fontSize: FONTS.normal,
    color: COLORS.text,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SIZES.md,
    marginTop: SIZES.lg,
  },
  button: {
    flex: 1,
    paddingVertical: SIZES.md,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  cancelButton: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: FONTS.normal,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: FONTS.normal,
    fontWeight: '600',
  },
  settingsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  settingLabel: {
    fontSize: FONTS.normal,
    color: COLORS.text,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: SIZES.md,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: FONTS.normal,
    fontWeight: '600',
  },
})
