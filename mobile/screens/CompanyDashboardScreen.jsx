import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLORS, SIZES, FONTS, TURKEY_CITIES, DISTRICTS } from '../constants'
import { api } from '../api'

function PriceCard({ price, onDelete }) {
  return (
    <View style={styles.priceCard}>
      <View style={styles.priceInfo}>
        <Text style={styles.priceRoute}>
          {price.fromCity} → {price.toCity}
        </Text>
        <Text style={styles.priceAmount}>
          {price.price?.toLocaleString('tr-TR')} ₺
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(price.id)}
      >
        <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  )
}

export default function CompanyDashboardScreen() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [prices, setPrices] = useState([])

  // Edit fields
  const [firmData, setFirmData] = useState({
    name: '',
    phone: '',
    description: '',
    loadStatus: 'Boş',
    city: '',
    district: '',
    toCity: '',
    toDistrict: '',
    price: '',
  })

  // Add price fields
  const [newPrice, setNewPrice] = useState({
    fromCity: '',
    toCity: '',
    price: '',
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setFirmData({
          name: parsedUser.name || '',
          phone: parsedUser.phone || '',
          description: parsedUser.description || '',
          loadStatus: parsedUser.loadStatus || 'Boş',
          city: parsedUser.city || '',
          district: parsedUser.district || '',
          toCity: parsedUser.toCity || '',
          toDistrict: parsedUser.toDistrict || '',
          price: parsedUser.price?.toString() || '',
        })

        // Load prices if firmId exists
        const companyId = parsedUser.firmId || parsedUser.id
        if (companyId) {
          const pricesData = await api.fetchPrices(companyId)
          setPrices(pricesData || [])
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChanges = async () => {
    if (!user?.id) {
      Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı')
      return
    }

    try {
      const result = await api.updateFirm(user.id, firmData)

      if (result.success) {
        // Update local user data
        const updatedUser = { ...user, ...firmData }
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        setEditMode(false)
        Alert.alert('Başarılı', 'Firma bilgileri güncellendi')
      } else {
        Alert.alert('Hata', result.error || 'Güncelleme başarısız')
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata meydana geldi')
      console.error('Error:', error)
    }
  }

  const handleAddPrice = async () => {
    if (
      !newPrice.fromCity ||
      !newPrice.toCity ||
      !newPrice.price
    ) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun')
      return
    }

    if (!user?.id) {
      Alert.alert('Hata', 'Kullanıcı bilgisi bulunamadı')
      return
    }

    try {
      const result = await api.addPrice(user.id, {
        fromCity: newPrice.fromCity,
        toCity: newPrice.toCity,
        price: Number(newPrice.price),
      })

      if (result.success) {
        setPrices([...prices, result.data])
        setNewPrice({ fromCity: '', toCity: '', price: '' })
        Alert.alert('Başarılı', 'Fiyat eklendi')
      } else {
        Alert.alert('Hata', result.error || 'Fiyat eklenemedi')
      }
    } catch (error) {
      Alert.alert('Hata', 'Bir hata meydana geldi')
      console.error('Error:', error)
    }
  }

  const handleDeletePrice = async (priceId) => {
    Alert.alert('Onay', 'Bu fiyatı silmek istediğinize emin misiniz?', [
      { text: 'İptal', onPress: () => {} },
      {
        text: 'Sil',
        onPress: async () => {
          try {
            const result = await api.deletePrice(priceId)

            if (result.success) {
              setPrices(prices.filter(p => p.id !== priceId))
              Alert.alert('Başarılı', 'Fiyat silindi')
            } else {
              Alert.alert('Hata', result.error || 'Silinemedi')
            }
          } catch (error) {
            Alert.alert('Hata', 'Bir hata meydana geldi')
            console.error('Error:', error)
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

  if (!user || !user.isCompany) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="business-outline" size={48} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>Firma Paneli</Text>
          <Text style={styles.emptyText}>
            Firma hesabıyla giriş yaparak panele erişebilirsiniz
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Firma Paneli</Text>
        <Text style={styles.headerSubtitle}>{user.name}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Firma Bilgileri */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Firma Bilgileri</Text>
            {!editMode && (
              <TouchableOpacity onPress={() => setEditMode(true)}>
                <Ionicons name="pencil" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>

          {editMode ? (
            <View style={styles.editCard}>
              <Text style={styles.label}>Firma Adı</Text>
              <TextInput
                style={styles.input}
                value={firmData.name}
                onChangeText={(text) =>
                  setFirmData({ ...firmData, name: text })
                }
              />

              <Text style={styles.label}>Telefon</Text>
              <TextInput
                style={styles.input}
                value={firmData.phone}
                onChangeText={(text) =>
                  setFirmData({ ...firmData, phone: text })
                }
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Açıklama</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={firmData.description}
                onChangeText={(text) =>
                  setFirmData({ ...firmData, description: text })
                }
                multiline
                numberOfLines={3}
              />

              <Text style={styles.label}>Yük Durumu</Text>
              <Picker
                selectedValue={firmData.loadStatus}
                onValueChange={(value) =>
                  setFirmData({ ...firmData, loadStatus: value })
                }
                style={styles.picker}
              >
                <Picker.Item label="Boş" value="Boş" />
                <Picker.Item label="Dolu" value="Dolu" />
              </Picker>

              <Text style={styles.label}>Başlangıç Şehri</Text>
              <Picker
                selectedValue={firmData.city}
                onValueChange={(value) =>
                  setFirmData({ ...firmData, city: value, district: '' })
                }
                style={styles.picker}
              >
                <Picker.Item label="Seçiniz..." value="" />
                {TURKEY_CITIES.map((city) => (
                  <Picker.Item key={city} label={city} value={city} />
                ))}
              </Picker>

              {firmData.city && DISTRICTS[firmData.city] && (
                <>
                  <Text style={styles.label}>Başlangıç İlçesi</Text>
                  <Picker
                    selectedValue={firmData.district}
                    onValueChange={(value) =>
                      setFirmData({ ...firmData, district: value })
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Seçiniz..." value="" />
                    {DISTRICTS[firmData.city].map((district) => (
                      <Picker.Item
                        key={district}
                        label={district}
                        value={district}
                      />
                    ))}
                  </Picker>
                </>
              )}

              <Text style={styles.label}>Hedef Şehri</Text>
              <Picker
                selectedValue={firmData.toCity}
                onValueChange={(value) =>
                  setFirmData({ ...firmData, toCity: value, toDistrict: '' })
                }
                style={styles.picker}
              >
                <Picker.Item label="Seçiniz..." value="" />
                {TURKEY_CITIES.map((city) => (
                  <Picker.Item key={city} label={city} value={city} />
                ))}
              </Picker>

              {firmData.toCity && DISTRICTS[firmData.toCity] && (
                <>
                  <Text style={styles.label}>Hedef İlçesi</Text>
                  <Picker
                    selectedValue={firmData.toDistrict}
                    onValueChange={(value) =>
                      setFirmData({ ...firmData, toDistrict: value })
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Seçiniz..." value="" />
                    {DISTRICTS[firmData.toCity].map((district) => (
                      <Picker.Item
                        key={district}
                        label={district}
                        value={district}
                      />
                    ))}
                  </Picker>
                </>
              )}

              <Text style={styles.label}>Fiyat (₺)</Text>
              <TextInput
                style={styles.input}
                value={firmData.price}
                onChangeText={(text) =>
                  setFirmData({ ...firmData, price: text })
                }
                keyboardType="numeric"
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setEditMode(false)}
                >
                  <Text style={styles.cancelButtonText}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSaveChanges}
                >
                  <Ionicons name="checkmark" size={18} color={COLORS.white} />
                  <Text style={styles.saveButtonText}>Kaydet</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Telefon:</Text>
                <Text style={styles.infoValue}>{user.phone || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Yük Durumu:</Text>
                <Text style={styles.infoValue}>{user.loadStatus || 'Boş'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fiyat:</Text>
                <Text style={styles.infoValue}>
                  {user.price?.toLocaleString('tr-TR')} ₺ || '-'
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Fiyat Listesi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rota Fiyatları</Text>

          {prices.length > 0 && (
            <FlatList
              data={prices}
              renderItem={({ item }) => (
                <PriceCard
                  price={item}
                  onDelete={handleDeletePrice}
                />
              )}
              keyExtractor={(item) => item.id?.toString()}
              scrollEnabled={false}
              style={styles.priceList}
            />
          )}

          <View style={styles.addPriceCard}>
            <Text style={styles.addPriceTitle}>Yeni Rota Fiyatı Ekle</Text>

            <Text style={styles.label}>Başlangıç Şehri</Text>
            <Picker
              selectedValue={newPrice.fromCity}
              onValueChange={(value) =>
                setNewPrice({ ...newPrice, fromCity: value })
              }
              style={styles.picker}
            >
              <Picker.Item label="Seçiniz..." value="" />
              {TURKEY_CITIES.map((city) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>

            <Text style={styles.label}>Hedef Şehri</Text>
            <Picker
              selectedValue={newPrice.toCity}
              onValueChange={(value) =>
                setNewPrice({ ...newPrice, toCity: value })
              }
              style={styles.picker}
            >
              <Picker.Item label="Seçiniz..." value="" />
              {TURKEY_CITIES.map((city) => (
                <Picker.Item key={city} label={city} value={city} />
              ))}
            </Picker>

            <Text style={styles.label}>Fiyat (₺)</Text>
            <TextInput
              style={styles.input}
              value={newPrice.price}
              onChangeText={(text) =>
                setNewPrice({ ...newPrice, price: text })
              }
              keyboardType="numeric"
              placeholder="0"
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddPrice}
            >
              <Ionicons name="add" size={20} color={COLORS.white} />
              <Text style={styles.addButtonText}>Fiyat Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.secondary,
  },
  headerTitle: {
    fontSize: FONTS.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: FONTS.small,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: SIZES.xs,
  },
  content: {
    flex: 1,
    padding: SIZES.md,
  },
  section: {
    marginBottom: SIZES.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    fontSize: FONTS.medium,
    fontWeight: '700',
    color: COLORS.primary,
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
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: FONTS.normal,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: FONTS.normal,
    fontWeight: '600',
    color: COLORS.text,
  },
  label: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SIZES.md,
    marginBottom: SIZES.xs,
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
  multilineInput: {
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: SIZES.sm,
    backgroundColor: COLORS.white,
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
  priceList: {
    marginBottom: SIZES.lg,
  },
  priceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priceInfo: {
    flex: 1,
  },
  priceRoute: {
    fontSize: FONTS.normal,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  priceAmount: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  deleteBtn: {
    padding: SIZES.sm,
  },
  addPriceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addPriceTitle: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SIZES.md,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.sm,
    marginTop: SIZES.lg,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: FONTS.normal,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
  },
  emptyTitle: {
    fontSize: FONTS.large,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  emptyText: {
    fontSize: FONTS.normal,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
})
