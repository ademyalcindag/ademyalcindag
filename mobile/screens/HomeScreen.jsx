import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import { COLORS, SIZES, FONTS, TURKEY_CITIES, DISTRICTS } from '../constants'
import { api } from '../api'

function CompanyCard({ firm, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{firm.name}</Text>
        {firm.rating && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#f59e0b" />
            <Text style={styles.ratingText}>{firm.rating}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="locate" size={16} color={COLORS.primary} />
          <Text style={styles.detailText}>
            {firm.city} {firm.district ? `/ ${firm.district}` : ''}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="arrow-forward" size={16} color={COLORS.secondary} />
          <Text style={styles.detailText}>
            {firm.toCity} {firm.toDistrict ? `/ ${firm.toDistrict}` : ''}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="pricetag" size={16} color={COLORS.accent} />
          <Text style={styles.detailText}>
            {firm.price?.toLocaleString('tr-TR')} ₺
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View
          style={[
            styles.statusBadge,
            firm.loadStatus === 'Boş'
              ? styles.statusEmpty
              : styles.statusFull,
          ]}
        >
          <Ionicons
            name="checkmark-circle"
            size={14}
            color={COLORS.white}
          />
          <Text style={styles.statusText}>
            {firm.loadStatus === 'Boş' ? 'Boş' : 'Dolu'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default function HomeScreen({ navigation }) {
  const [city, setCity] = useState('')
  const [filteredCities, setFilteredCities] = useState([])
  const [showCities, setShowCities] = useState(false)
  const [district, setDistrict] = useState('')
  const [toCity, setToCity] = useState('')
  const [filteredToCities, setFilteredToCities] = useState([])
  const [showToCities, setShowToCities] = useState(false)
  const [toDistrict, setToDistrict] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loadStatus, setLoadStatus] = useState('')
  const [firms, setFirms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadFirms()
  }, [])

  const loadFirms = async () => {
    setLoading(true)
    try {
      const data = await api.fetchFirms()
      setFirms(data || [])
      setError(null)
    } catch (err) {
      setError('Firmalar yüklenemedi')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCityInput = (text) => {
    setCity(text)
    if (!text) {
      setFilteredCities([])
      setShowCities(false)
    } else {
      const filtered = TURKEY_CITIES.filter(c =>
        c.toLowerCase().includes(text.toLowerCase())
      )
      setFilteredCities(filtered)
      setShowCities(true)
    }
  }

  const handleToCityInput = (text) => {
    setToCity(text)
    if (!text) {
      setFilteredToCities([])
      setShowToCities(false)
    } else {
      const filtered = TURKEY_CITIES.filter(c =>
        c.toLowerCase().includes(text.toLowerCase())
      )
      setFilteredToCities(filtered)
      setShowToCities(true)
    }
  }

  const filtered = firms.filter(f => {
    if (city && f.city?.toLowerCase() !== city.toLowerCase()) return false
    if (district && f.district?.toLowerCase() !== district.toLowerCase())
      return false
    if (toCity && f.toCity?.toLowerCase() !== toCity.toLowerCase())
      return false
    if (toDistrict && f.toDistrict?.toLowerCase() !== toDistrict.toLowerCase())
      return false
    if (minPrice && f.price < Number(minPrice)) return false
    if (maxPrice && f.price > Number(maxPrice)) return false
    if (loadStatus && f.loadStatus !== loadStatus) return false
    return true
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚚 Taşımacılık Rehberi</Text>
        <Text style={styles.headerSubtitle}>Firma Araması</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.filtersSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="funnel" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Filtreler</Text>
          </View>

          <Text style={styles.label}>Nereden</Text>
          <TextInput
            style={styles.input}
            placeholder="Başlangıç şehrini seçin..."
            value={city}
            onChangeText={handleCityInput}
            placeholderTextColor={COLORS.textSecondary}
          />
          {showCities && filteredCities.length > 0 && (
            <View style={styles.dropdown}>
              {filteredCities.slice(0, 5).map((c, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setCity(c)
                    setShowCities(false)
                    setDistrict('')
                  }}
                >
                  <Ionicons name="location" size={14} color={COLORS.primary} />
                  <Text style={styles.dropdownText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {city && DISTRICTS[city] && (
            <>
              <Text style={styles.label}>İlçe</Text>
              <Picker
                selectedValue={district}
                onValueChange={setDistrict}
                style={styles.picker}
              >
                <Picker.Item label="İlçe seçin..." value="" />
                {DISTRICTS[city].map((d, idx) => (
                  <Picker.Item key={idx} label={d} value={d} />
                ))}
              </Picker>
            </>
          )}

          <Text style={styles.label}>Nereye</Text>
          <TextInput
            style={styles.input}
            placeholder="Hedef şehrini seçin..."
            value={toCity}
            onChangeText={handleToCityInput}
            placeholderTextColor={COLORS.textSecondary}
          />
          {showToCities && filteredToCities.length > 0 && (
            <View style={styles.dropdown}>
              {filteredToCities.slice(0, 5).map((c, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setToCity(c)
                    setShowToCities(false)
                    setToDistrict('')
                  }}
                >
                  <Ionicons name="location" size={14} color={COLORS.secondary} />
                  <Text style={styles.dropdownText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {toCity && DISTRICTS[toCity] && (
            <>
              <Text style={styles.label}>İlçe</Text>
              <Picker
                selectedValue={toDistrict}
                onValueChange={setToDistrict}
                style={styles.picker}
              >
                <Picker.Item label="İlçe seçin..." value="" />
                {DISTRICTS[toCity].map((d, idx) => (
                  <Picker.Item key={idx} label={d} value={d} />
                ))}
              </Picker>
            </>
          )}

          <View style={styles.priceRow}>
            <View style={styles.priceCol}>
              <Text style={styles.label}>Min Fiyat</Text>
              <TextInput
                style={styles.input}
                placeholder="₺"
                value={minPrice}
                onChangeText={setMinPrice}
                keyboardType="numeric"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
            <View style={styles.priceCol}>
              <Text style={styles.label}>Max Fiyat</Text>
              <TextInput
                style={styles.input}
                placeholder="₺"
                value={maxPrice}
                onChangeText={setMaxPrice}
                keyboardType="numeric"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
          </View>

          <Text style={styles.label}>Yük Durumu</Text>
          <Picker
            selectedValue={loadStatus}
            onValueChange={setLoadStatus}
            style={styles.picker}
          >
            <Picker.Item label="Hepsi" value="" />
            <Picker.Item label="Boş" value="Boş" />
            <Picker.Item label="Dolu" value="Dolu" />
          </Picker>

          <TouchableOpacity
            style={styles.searchBtn}
            onPress={loadFirms}
          >
            <Ionicons name="search" size={20} color={COLORS.white} />
            <Text style={styles.searchBtnText}>Ara</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>
              Firmalar ({filtered.length})
            </Text>
          </View>

          {loading && <ActivityIndicator size="large" color={COLORS.primary} />}
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={32} color={COLORS.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          {!loading && filtered.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>Arama kriterlerine uygun firma yok</Text>
            </View>
          )}

          {filtered.map(firm => (
            <CompanyCard
              key={firm.id}
              firm={firm}
              onPress={() =>
                navigation.navigate('CompanyDetails', { firmId: firm.id })
              }
            />
          ))}
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
  filtersSection: {
    backgroundColor: COLORS.white,
    padding: SIZES.lg,
    borderRadius: 12,
    marginBottom: SIZES.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.md,
    gap: SIZES.sm,
  },
  sectionTitle: {
    fontSize: FONTS.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
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
    backgroundColor: COLORS.white,
    fontSize: FONTS.normal,
    color: COLORS.text,
  },
  picker: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: SIZES.sm,
    backgroundColor: COLORS.white,
  },
  dropdown: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: SIZES.md,
    maxHeight: 150,
    elevation: 3,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
    gap: SIZES.sm,
  },
  dropdownText: {
    fontSize: FONTS.normal,
    color: COLORS.text,
  },
  priceRow: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  priceCol: {
    flex: 1,
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.md,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.sm,
    marginTop: SIZES.lg,
  },
  searchBtnText: {
    color: COLORS.white,
    fontSize: FONTS.medium,
    fontWeight: '600',
  },
  listSection: {
    marginBottom: SIZES.lg,
  },
  listHeader: {
    marginBottom: SIZES.md,
  },
  listTitle: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  cardTitle: {
    fontSize: FONTS.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: 20,
    gap: SIZES.xs,
  },
  ratingText: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: '#92400e',
  },
  cardDetails: {
    marginBottom: SIZES.md,
    gap: SIZES.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
  },
  detailText: {
    fontSize: FONTS.normal,
    color: COLORS.textSecondary,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.xs,
    borderRadius: 20,
    gap: SIZES.xs,
  },
  statusEmpty: {
    backgroundColor: '#d1fae5',
  },
  statusFull: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: FONTS.small,
    fontWeight: '600',
    color: COLORS.white,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.lg,
    gap: SIZES.md,
  },
  errorText: {
    fontSize: FONTS.normal,
    color: COLORS.danger,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.lg,
    gap: SIZES.md,
  },
  emptyText: {
    fontSize: FONTS.normal,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SIZES.md,
  },
})
