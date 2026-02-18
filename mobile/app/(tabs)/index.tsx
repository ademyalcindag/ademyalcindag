import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { API } from '@/data';

const COLORS = {
  primary: '#1E90FF',
  secondary: '#FF6B6B',
  success: '#4CAF50',
  warning: '#FFA500',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  subtext: '#666666',
  border: '#E0E0E0',
  inactive: '#CCCCCC',
};

const DISTRICTS = {
  'Adana': ['Aladağ', 'Ceyhan', 'Feke', 'Karaisalı', 'Karataş', 'Kozan', 'Pozantı', 'Saimbeyli', 'Sarıçam', 'Tufanbeyli', 'Yumurtalık', 'Çukurova'],
  'Ankara': ['Akyurt', 'Altındağ', 'Ankara', 'Ayaş', 'Bala', 'Beypazarı', 'Çamlıdere', 'Çankaya', 'Çubuk', 'Demirlibahçe', 'Eryaman', 'Etimesgut', 'Evren', 'Gölbaşı', 'Güdül', 'Haymana', 'Kahramankazan', 'Kalecik', 'Kızılcahamam', 'Mamak', 'Nallıhan', 'Polatlı', 'Pursaklar', 'Sincan', 'Şereflikoçhisar', 'Yenimahalle'],
  'İstanbul': ['Adalar', 'Avcılar', 'Bağcıköy', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Güzeltepe', 'Halkalı', 'Kağıthane', 'Kartal', 'Kasımpaşa', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sarıyer', 'Şilte', 'Şişli', 'Taksim', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'],
  'İzmir': ['Alsancak', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Bornova', 'Buca', 'Burmada', 'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'İzmir', 'Karaburun', 'Karabörü', 'Karşıyaka', 'Kınık', 'Kiraz', 'Konak', 'Köprübaşı', 'Menderes', 'Menemen', 'Merzifon', 'Narlıdere', 'Ödemiş', 'Pınarbaşı', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'],
};

export default function HomeScreen() {
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromCity, setFromCity] = useState('');
  const [fromDistrict, setFromDistrict] = useState('');
  const [toCity, setToCity] = useState('');
  const [toDistrict, setToDistrict] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loadStatus, setLoadStatus] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFirms();
  }, []);

  const fetchFirms = async () => {
    try {
      setLoading(true);
      const data = await API.fetchFirms();
      setFirms(data || []);
      setError(null);
    } catch (err) {
      console.error('Firma yükleme hatası:', err);
      setError('Firmalar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchFirms().finally(() => setRefreshing(false));
  }, []);

  const filtered = firms.filter(f => {
    if (fromCity && f.city?.toLowerCase() !== fromCity.toLowerCase()) return false;
    if (fromDistrict && f.district?.toLowerCase() !== fromDistrict.toLowerCase()) return false;
    if (toCity && f.toCity?.toLowerCase() !== toCity.toLowerCase()) return false;
    if (toDistrict && f.toDistrict?.toLowerCase() !== toDistrict.toLowerCase()) return false;
    if (minPrice && f.price < Number(minPrice)) return false;
    if (maxPrice && f.price > Number(maxPrice)) return false;
    if (loadStatus && f.loadStatus !== loadStatus) return false;
    return true;
  });

  const renderFirmCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.firmName}>{item.name}</Text>
        <View style={[styles.statusBadge, item.loadStatus === 'Dolu' ? styles.statusDolu : styles.statusBos]}>
          <Text style={styles.statusBadgeText}>{item.loadStatus === 'Dolu' ? '✓ Dolu' : '✗ Boş'}</Text>
        </View>
      </View>
      <View style={styles.routeInfo}>
        <Text style={styles.routeLabel}>🚛 Rota</Text>
        <Text style={styles.routeText}>{item.city} → {item.toCity || 'Belirsiz'}</Text>
      </View>
      <View style={styles.priceInfo}>
        <Text style={styles.priceLabel}>₺ Ücret</Text>
        <Text style={styles.price}>{item.price?.toLocaleString('tr-TR')} ₺</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚛 Taşıyıcı Rehberi</Text>
      </View>

      <ScrollView style={styles.filterContainer} showsVerticalScrollIndicator={true}>
        <Text style={styles.filterTitle}>Filtreler</Text>
        
        {/* Nereden Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Nereden</Text>
          <TextInput
            style={styles.input}
            placeholder="Şehir seçin..."
            value={fromCity}
            onChangeText={setFromCity}
            placeholderTextColor={COLORS.inactive}
          />
          {fromCity && DISTRICTS[fromCity] && (
            <TextInput
              style={styles.input}
              placeholder="İlçe seçin..."
              value={fromDistrict}
              onChangeText={setFromDistrict}
              placeholderTextColor={COLORS.inactive}
            />
          )}
        </View>

        {/* Nereye Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 Nereye</Text>
          <TextInput
            style={styles.input}
            placeholder="Şehir seçin..."
            value={toCity}
            onChangeText={setToCity}
            placeholderTextColor={COLORS.inactive}
          />
          {toCity && DISTRICTS[toCity] && (
            <TextInput
              style={styles.input}
              placeholder="İlçe seçin..."
              value={toDistrict}
              onChangeText={setToDistrict}
              placeholderTextColor={COLORS.inactive}
            />
          )}
        </View>

        {/* Price Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Fiyat Aralığı</Text>
          <View style={styles.priceRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Min ₺"
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
              placeholderTextColor={COLORS.inactive}
            />
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 8 }]}
              placeholder="Maks ₺"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
              placeholderTextColor={COLORS.inactive}
            />
          </View>
        </View>

        {/* Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Yük Durumu</Text>
          <View style={styles.statusButtons}>
            <TouchableOpacity 
              style={[styles.statusBtn, loadStatus === '' && styles.statusBtnActive]}
              onPress={() => setLoadStatus('')}
            >
              <Text style={[styles.statusBtnText, loadStatus === '' && styles.statusBtnActiveText]}>Hepsi</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.statusBtn, loadStatus === 'Boş' && { ...styles.statusBtnActive, backgroundColor: '#FFA500' }]}
              onPress={() => setLoadStatus('Boş')}
            >
              <Text style={[styles.statusBtnText, loadStatus === 'Boş' && styles.statusBtnActiveText]}>Boş</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.statusBtn, loadStatus === 'Dolu' && { ...styles.statusBtnActive, backgroundColor: '#4CAF50' }]}
              onPress={() => setLoadStatus('Dolu')}
            >
              <Text style={[styles.statusBtnText, loadStatus === 'Dolu' && styles.statusBtnActiveText]}>Dolu</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Clear Button */}
        <TouchableOpacity 
          style={styles.clearBtn} 
          onPress={() => {
            setFromCity('');
            setFromDistrict('');
            setToCity('');
            setToDistrict('');
            setMinPrice('');
            setMaxPrice('');
            setLoadStatus('');
          }}
        >
          <Text style={styles.clearBtnText}>🔄 Filtreleri Temizle</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* List Section */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Firmalar ({filtered.length})</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={() => fetchFirms()}>
            <Text style={styles.refreshIcon}>🔄</Text>
          </TouchableOpacity>
        </View>
        
        {loading && !refreshing && <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />}
        {error && <Text style={styles.errorText}>⚠️ {error}</Text>}
        {!loading && firms.length === 0 && <Text style={styles.emptyText}>Firma bulunamadı</Text>}
        
        <FlatList
          data={filtered}
          renderItem={renderFirmCard}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          scrollEnabled={true}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          style={styles.firmList}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  filterContainer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: '40%',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.text,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    backgroundColor: COLORS.background,
    color: COLORS.text,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  statusBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  statusBtnActiveText: {
    color: COLORS.surface,
  },
  clearBtn: {
    marginTop: 12,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  clearBtnText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  refreshBtn: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: COLORS.background,
  },
  refreshIcon: {
    fontSize: 18,
  },
  firmList: {
    padding: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  firmName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusDolu: {
    backgroundColor: COLORS.success,
  },
  statusBos: {
    backgroundColor: COLORS.warning,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  routeInfo: {
    marginBottom: 10,
  },
  routeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.subtext,
    marginBottom: 4,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  priceInfo: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.subtext,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: COLORS.secondary,
    textAlign: 'center',
    padding: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    color: COLORS.subtext,
    textAlign: 'center',
    padding: 16,
    fontSize: 14,
  },
});
