import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, Picker } from 'react-native'
import { API } from './data'

const TURKEY_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bingöl',
  'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli',
  'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep',
  'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İçel', 'İstanbul',
  'İzmir', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri',
  'Kırıkkale', 'Kırklareli', 'Kırsehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya',
  'Lâzistan', 'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu',
  'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şırnak', 'Tekirdağ',
  'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
]

const DISTRICTS = {
  'Adana': ['Aladağ', 'Ceyhan', 'Feke', 'Karaisalı', 'Karataş', 'Kozan', 'Pozantı', 'Saimbeyli', 'Sarıçam', 'Tufanbeyli', 'Yumurtalık', 'Çukurova'],
  'Ankara': ['Akyurt', 'Altındağ', 'Ankara', 'Ayaş', 'Bala', 'Beypazarı', 'Çamlıdere', 'Çankaya', 'Çubuk', 'Demirlibahçe', 'Eryaman', 'Etimesgut', 'Evren', 'Gölbaşı', 'Güdül', 'Haymana', 'Kahramankazan', 'Kalecik', 'Kızılcahamam', 'Mamak', 'Nallıhan', 'Polatlı', 'Pursaklar', 'Sincan', 'Şereflikoçhisar', 'Yenimahalle'],
  'İstanbul': ['Adalar', 'Avcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Halkalı', 'Kağıthane', 'Kartal', 'Kasımpaşa', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sarıyer', 'Şişli', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'],
  'İzmir': ['Alsancak', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Bornova', 'Buca', 'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'İzmir', 'Karaburun', 'Karşıyaka', 'Kınık', 'Kiraz', 'Konak', 'Menderes', 'Menemen', 'Narlıdere', 'Ödemiş', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'],
  'Bursa': ['Altınordu', 'Büyükorhan', 'Cekirge', 'Gemlik', 'Gürsu', 'İnegöl', 'Keles', 'Kestel', 'Mudanya', 'Mustafakemalpaşa', 'Nilüfer', 'Orhangazi', 'Osmangazi', 'Yenişehir', 'Yıldırım'],
  'Gaziantep': ['Araban', 'Gaziantep', 'İslahiye', 'Nizip', 'Nurdağı', 'Oğuzeli', 'Şahinbey', 'Şehitkamil'],
  'Konya': ['Ahırlı', 'Akören', 'Akşehir', 'Altınekin', 'Beyşehir', 'Bozkır', 'Çumra', 'Doğanhisar', 'Ereğli', 'Hadim', 'Karapınar', 'Konya', 'Kulu', 'Meram', 'Sarayönü', 'Selçuklu', 'Seydişehir'],
  'Antalya': ['Akseki', 'Aksu', 'Alanya', 'Antalya', 'Belek', 'Demre', 'Döşemealtı', 'Elmalı', 'Finike', 'Gazipaşa', 'Gündoğmuş', 'Kalkan', 'Kaş', 'Kemer', 'Kepez', 'Kumluca', 'Lara', 'Manavgat', 'Muratpaşa', 'Side'],
  'Diyarbakır': ['Bağlar', 'Bismil', 'Çermik', 'Çinar', 'Çüngüş', 'Diyarbakır', 'Eğil', 'Ergani', 'Hani', 'Kayapınar', 'Silvan', 'Sur'],
}

function CompanyCard({ firm }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{firm.name}</Text>
      <Text style={styles.cardText}>📍 {firm.city}</Text>
      <Text style={styles.cardText}>💰 {firm.price.toLocaleString('tr-TR')} ₺</Text>
      <Text style={styles.cardText}>📦 {firm.loadStatus === 'Boş' ? '🟢 Boş' : '🔴 Dolu'}</Text>
      {firm.rating && <Text style={styles.rating}>⭐ {firm.rating}</Text>}
    </View>
  )
}

export default function App() {
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
    setLoading(true)
    API.fetchFirms()
      .then(data => {
        setFirms(data || [])
        setError(null)
      })
      .catch(err => {
        console.error('API error:', err)
        setError('Firmalar yüklenemedi')
        setFirms([])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleCityInput = (text) => {
    setCity(text)
    if (text.trim() === '') {
      setFilteredCities([])
      setShowCities(false)
    } else {
      const search = text.toLowerCase().trim()
      const filtered = TURKEY_CITIES
        .filter(c => c.toLowerCase().includes(search))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(search) ? 0 : 1
          const bStarts = b.toLowerCase().startsWith(search) ? 0 : 1
          if (aStarts !== bStarts) return aStarts - bStarts
          return a.localeCompare(b, 'tr')
        })
      setFilteredCities(filtered)
      setShowCities(true)
    }
  }

  const handleToCityInput = (text) => {
    setToCity(text)
    if (text.trim() === '') {
      setFilteredToCities([])
      setShowToCities(false)
    } else {
      const search = text.toLowerCase().trim()
      const filtered = TURKEY_CITIES
        .filter(c => c.toLowerCase().includes(search))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(search) ? 0 : 1
          const bStarts = b.toLowerCase().startsWith(search) ? 0 : 1
          if (aStarts !== bStarts) return aStarts - bStarts
          return a.localeCompare(b, 'tr')
        })
      setFilteredToCities(filtered)
      setShowToCities(true)
    }
  }

  const filtered = firms.filter(f => {
    if (city && f.city.toLowerCase() !== city.toLowerCase()) return false
    if (district && f.district?.toLowerCase() !== district.toLowerCase()) return false
    if (toCity && f.toCity?.toLowerCase() !== toCity.toLowerCase()) return false
    if (toDistrict && f.toDistrict?.toLowerCase() !== toDistrict.toLowerCase()) return false
    if (minPrice && f.price < Number(minPrice)) return false
    if (maxPrice && f.price > Number(maxPrice)) return false
    if (loadStatus && f.loadStatus !== loadStatus) return false
    return true
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚚 Taşımacılık Rehberi</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.filtersSection}>
          <Text style={styles.filterTitle}>Filtreler</Text>

          <Text style={styles.label}>Nereden</Text>
          <TextInput
            style={styles.input}
            placeholder="Şehir seçin..."
            value={city}
            onChangeText={handleCityInput}
            onFocus={() => city && setShowCities(true)}
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
                    setFilteredCities([])
                  }}
                >
                  <Text>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {city && DISTRICTS[city] && (
            <>
              <Text style={styles.label}>İlçe</Text>
              <Picker
                selectedValue={district}
                onValueChange={(itemValue) => setDistrict(itemValue)}
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
            placeholder="Şehir seçin..."
            value={toCity}
            onChangeText={handleToCityInput}
            onFocus={() => toCity && setShowToCities(true)}
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
                    setFilteredToCities([])
                  }}
                >
                  <Text>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {toCity && DISTRICTS[toCity] && (
            <>
              <Text style={styles.label}>İlçe</Text>
              <Picker
                selectedValue={toDistrict}
                onValueChange={(itemValue) => setToDistrict(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="İlçe seçin..." value="" />
                {DISTRICTS[toCity].map((d, idx) => (
                  <Picker.Item key={idx} label={d} value={d} />
                ))}
              </Picker>
            </>
          )}

          <Text style={styles.label}>Min Fiyat</Text>
          <TextInput
            style={styles.input}
            placeholder="0 ₺"
            value={minPrice ? Number(minPrice).toLocaleString('tr-TR') + ' ₺' : ''}
            onChangeText={(text) => setMinPrice(text.replace(/\D/g, ''))}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Maks Fiyat</Text>
          <TextInput
            style={styles.input}
            placeholder="0 ₺"
            value={maxPrice ? Number(maxPrice).toLocaleString('tr-TR') + ' ₺' : ''}
            onChangeText={(text) => setMaxPrice(text.replace(/\D/g, ''))}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Yük Durumu</Text>
          <Picker
            selectedValue={loadStatus}
            onValueChange={(itemValue) => setLoadStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Hepsi" value="" />
            <Picker.Item label="Boş" value="Boş" />
            <Picker.Item label="Dolu" value="Dolu" />
          </Picker>

          <TouchableOpacity style={styles.searchBtn} onPress={() => {}}>
            <Text style={styles.searchBtnText}>🔍 Ara</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Firmalar</Text>
          {loading && <ActivityIndicator size="large" color="#450ef3" />}
          {error && <Text style={styles.error}>{error}</Text>}
          {!loading && filtered.length === 0 && <Text style={styles.empty}>Firma bulunamadı</Text>}
          {filtered.map(firm => (
            <CompanyCard key={firm.id} firm={firm} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  header: {
    backgroundColor: '#450ef3',
    padding: 20,
    paddingTop: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#f3450e',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filtersSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#a9c400',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#450ef3',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  dropdown: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 8,
    maxHeight: 120,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  searchBtn: {
    backgroundColor: '#450ef3',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  searchBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listSection: {
    marginBottom: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#450ef3',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#450ef3',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  rating: {
    fontSize: 13,
    color: '#f59e0b',
    fontWeight: '600',
    marginTop: 4,
  },
  error: {
    color: '#7f1d1d',
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 8,
    textAlign: 'center',
  },
  empty: {
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    textAlign: 'center',
  },
})
