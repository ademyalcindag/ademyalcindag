import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLORS, SIZES, FONTS } from '../constants'
import { api } from '../api'

export default function CompanyDetailsScreen({ route }) {
  const { firmId } = route.params
  const [firm, setFirm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    loadFirmDetails()
    loadUser()
  }, [])

  const loadFirmDetails = async () => {
    try {
      const data = await api.fetchFirm(firmId)
      setFirm(data)
    } catch (error) {
      Alert.alert('Hata', 'Firma detayları yüklenemedi')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir mesaj yazın')
      return
    }

    if (!user) {
      Alert.alert('Hata', 'Mesaj göndermek için giriş yapmalısınız')
      return
    }

    setSendingMessage(true)
    try {
      const result = await api.sendMessage({
        firmId,
        senderId: user.id,
        senderName: user.name,
        senderEmail: user.email,
        message: message.trim(),
      })

      if (result.success) {
        Alert.alert('Başarılı', 'Mesajınız gönderildi')
        setMessage('')
      } else {
        Alert.alert('Hata', result.error || 'Mesaj gönderilemedi')
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata meydana geldi')
      console.error('Error:', error)
    } finally {
      setSendingMessage(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  if (!firm) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={48} color={COLORS.danger} />
        <Text style={styles.errorText}>Firma bulunamadı</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.titleSection}>
              <Text style={styles.firmName}>{firm.name}</Text>
              {firm.rating && (
                <View style={styles.ratingSection}>
                  <Ionicons name="star" size={16} color="#f59e0b" />
                  <Text style={styles.rating}>{firm.rating} / 5.0</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                firm.loadStatus === 'Boş'
                  ? styles.statusEmpty
                  : styles.statusFull,
              ]}
            >
              <Ionicons name="checkmark-circle" size={14} color={COLORS.white} />
              <Text style={styles.statusText}>
                {firm.loadStatus === 'Boş' ? 'Boş' : 'Dolu'}
              </Text>
            </View>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rota Bilgileri</Text>

          <View style={styles.detailCard}>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons name="location-sharp" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Başlangıç</Text>
                <Text style={styles.detailValue}>
                  {firm.city} {firm.district ? `/ ${firm.district}` : ''}
                </Text>
              </View>
            </View>

            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-forward" size={24} color={COLORS.secondary} />
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <Ionicons
                  name="location"
                  size={20}
                  color={COLORS.secondary}
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Hedef</Text>
                <Text style={styles.detailValue}>
                  {firm.toCity} {firm.toDistrict ? `/ ${firm.toDistrict}` : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Price Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fiyat Bilgileri</Text>

          <View style={styles.priceCard}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Ücret</Text>
              <Text style={styles.priceValue}>
                {firm.price?.toLocaleString('tr-TR')} ₺
              </Text>
            </View>

            {firm.pricePerKm && (
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Km Başına</Text>
                <Text style={styles.priceValue}>{firm.pricePerKm} ₺</Text>
              </View>
            )}
          </View>
        </View>

        {/* Contact Section */}
        {firm.phone && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İletişim Bilgileri</Text>

            <TouchableOpacity style={styles.contactCard}>
              <Ionicons name="call" size={20} color={COLORS.primary} />
              <Text style={styles.contactText}>{firm.phone}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Description */}
        {firm.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hakkında</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{firm.description}</Text>
            </View>
          </View>
        )}

        {/* Message Section */}
        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mesaj Gönder</Text>

            <View style={styles.messageCard}>
              <TextInput
                style={styles.messageInput}
                placeholder="Mesajınız..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                placeholderTextColor={COLORS.textSecondary}
              />

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  sendingMessage && styles.sendButtonDisabled,
                ]}
                onPress={handleSendMessage}
                disabled={sendingMessage}
              >
                {sendingMessage ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Ionicons name="send" size={18} color={COLORS.white} />
                    <Text style={styles.sendButtonText}>Gönder</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
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
  errorText: {
    fontSize: FONTS.medium,
    color: COLORS.danger,
    marginTop: SIZES.md,
  },
  headerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTop: {
    marginBottom: SIZES.md,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
    marginBottom: SIZES.sm,
  },
  firmName: {
    fontSize: FONTS.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    borderRadius: 20,
    gap: SIZES.xs,
  },
  rating: {
    fontSize: FONTS.normal,
    fontWeight: '600',
    color: '#92400e',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 20,
    gap: SIZES.sm,
  },
  statusEmpty: {
    backgroundColor: '#d1fae5',
  },
  statusFull: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: FONTS.normal,
    fontWeight: '600',
    color: COLORS.white,
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
  detailCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.lg,
    gap: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
  },
  detailValue: {
    fontSize: FONTS.normal,
    fontWeight: '600',
    color: COLORS.text,
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.md,
  },
  priceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  priceLabel: {
    fontSize: FONTS.normal,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  contactCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactText: {
    fontSize: FONTS.normal,
    fontWeight: '600',
    color: COLORS.primary,
  },
  descriptionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  descriptionText: {
    fontSize: FONTS.normal,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  messageCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    marginBottom: SIZES.md,
    fontSize: FONTS.normal,
    color: COLORS.text,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: COLORS.white,
    fontSize: FONTS.normal,
    fontWeight: '600',
  },
})
