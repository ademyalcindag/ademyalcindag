import React, { useState, useEffect } from 'react'
import CompanyCard from './CompanyCard'
import { API } from '../data'

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
  'İstanbul': ['Adalar', 'Avcılar', 'Bağcıköy', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Güzeltepe', 'Halkalı', 'Kağıthane', 'Kartal', 'Kasımpaşa', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sarıyer', 'Şilte', 'Şişli', 'Taksim', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'],
  'İzmir': ['Alsancak', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Bornova', 'Buca', 'Burmada', 'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'İzmir', 'Karaburun', 'Karabörü', 'Karşıyaka', 'Kınık', 'Kiraz', 'Konak', 'Köprübaşı', 'Menderes', 'Menemen', 'Merzifon', 'Narlıdere', 'Ödemiş', 'Pınarbaşı', 'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'],
  'Bursa': ['Altınordu', 'Büyükorhan', 'Cekirge', 'Gemlik', 'Gürsu', 'İnegöl', 'İsmail Beye', 'Keles', 'Kestel', 'Mudanya', 'Mustafakemalpaşa', 'Nilüfer', 'Orhangazi', 'Osmangazi', 'Yenişehir', 'Yıldırım'],
  'Gaziantep': ['Araban', 'Comkayır', 'Gaziantep', 'İslahiye', 'Jarablus', 'Karkamış', 'Nizip', 'Nurdağı', 'Oğuzeli', 'Şahinbey', 'Şehitkamil'],
  'Konya': ['Ahırlı', 'Akören', 'Akşehir', 'Altınekin', 'Beyşehir', 'Bozkır', 'Cihanbeyli', 'Çumra', 'Derbent', 'Doğanhisar', 'Ereğli', 'Hadim', 'Hüyük', 'Karapınar', 'Karchialon', 'Kaymak', 'Konya', 'Kulu', 'Meram', 'Sarayönü', 'Selçuklu', 'Seydişehir', 'Taşkent', 'Tuzlukçu', 'Uluğbey', 'Yalıhüyük', 'Yunak'],
  'Antalya': ['Akseki', 'Aksu', 'Alanya', 'Antalya', 'Atakent', 'Belek', 'Demre', 'Döşemealtı', 'Elmalı', 'Finike', 'Gazipaşa', 'Gündoğmuş', 'İbradı', 'Kalkan', 'Kaş', 'Kemer', 'Kepez', 'Kumluca', 'Lara', 'Manavgat', 'Muratpaşa', 'Ölüdeniz', 'Patara', 'Side'],
  'Diyarbakır': ['Bağlar', 'Bismil', 'Çermik', 'Çinar', 'Çüngüş', 'Diyarbakır', 'Eğil', 'Ergani', 'Hani', 'Hazro', 'Kayapınar', 'Kocaköy', 'Kulp', 'Lice', 'Mardin', 'Silvan', 'Sur', 'Urfaya'],
}

export default function Home(){
  const [city, setCity] = useState('')
  const [filteredCities, setFilteredCities] = useState([])
  const [showCities, setShowCities] = useState(false)
  const [district, setDistrict] = useState('')
  const [filteredDistricts, setFilteredDistricts] = useState([])
  const [showDistricts, setShowDistricts] = useState(false)
  const [toCity, setToCity] = useState('')
  const [filteredToCities, setFilteredToCities] = useState([])
  const [showToCities, setShowToCities] = useState(false)
  const [toDistrict, setToDistrict] = useState('')
  const [filteredToDistricts, setFilteredToDistricts] = useState([])
  const [showToDistricts, setShowToDistricts] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loadStatus, setLoadStatus] = useState('')
  const [firms, setFirms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleCityInput = (e) => {
    const input = e.target.value
    setCity(input)

    if (input.trim() === '') {
      setFilteredCities([])
      setShowCities(false)
    } else {
      const search = input.toLowerCase().trim()
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

  const selectCity = (selectedCity) => {
    setCity(selectedCity)
    setShowCities(false)
    setFilteredCities([])
  }

  const handleDistrictInput = (e) => {
    const input = e.target.value
    setDistrict(input)

    if (input.trim() === '') {
      setFilteredDistricts([])
      setShowDistricts(false)
    } else {
      const search = input.toLowerCase().trim()
      const cityDistricts = DISTRICTS[city] || []
      const filtered = cityDistricts
        .filter(d => d.toLowerCase().includes(search))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(search) ? 0 : 1
          const bStarts = b.toLowerCase().startsWith(search) ? 0 : 1
          if (aStarts !== bStarts) return aStarts - bStarts
          return a.localeCompare(b, 'tr')
        })
      setFilteredDistricts(filtered)
      setShowDistricts(true)
    }
  }

  const selectDistrict = (selectedDistrict) => {
    setDistrict(selectedDistrict)
    setShowDistricts(false)
    setFilteredDistricts([])
  }

  const handleToCityInput = (e) => {
    const input = e.target.value
    setToCity(input)

    if (input.trim() === '') {
      setFilteredToCities([])
      setShowToCities(false)
    } else {
      const search = input.toLowerCase().trim()
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

  const selectToCity = (selectedCity) => {
    setToCity(selectedCity)
    setShowToCities(false)
    setFilteredToCities([])
  }

  const handleToDistrictInput = (e) => {
    const input = e.target.value
    setToDistrict(input)

    if (input.trim() === '') {
      setFilteredToDistricts([])
      setShowToDistricts(false)
    } else {
      const search = input.toLowerCase().trim()
      const cityDistricts = DISTRICTS[toCity] || []
      const filtered = cityDistricts
        .filter(d => d.toLowerCase().includes(search))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(search) ? 0 : 1
          const bStarts = b.toLowerCase().startsWith(search) ? 0 : 1
          if (aStarts !== bStarts) return aStarts - bStarts
          return a.localeCompare(b, 'tr')
        })
      setFilteredToDistricts(filtered)
      setShowToDistricts(true)
    }
  }

  const selectToDistrict = (selectedDistrict) => {
    setToDistrict(selectedDistrict)
    setShowToDistricts(false)
    setFilteredToDistricts([])
  }

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
    <div className="container">
      <aside className="filters">
        <h3>Filtreler</h3>
        <label>Nereden
          <div className="city-autocomplete">
            <input
              value={city}
              onChange={handleCityInput}
              onFocus={() => city && setShowCities(true)}
              placeholder="Şehir seçin..."
            />
            {showCities && filteredCities.length > 0 && (
              <ul className="city-dropdown">
                {filteredCities.map((c, idx) => (
                  <li key={idx} onClick={() => selectCity(c)}>
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </label>

        {city && DISTRICTS[city] && (
          <label>İlçe
            <div className="city-autocomplete">
              <input
                value={district}
                onChange={handleDistrictInput}
                onFocus={() => district && setShowDistricts(true)}
                placeholder="İlçe seçin..."
              />
              {showDistricts && filteredDistricts.length > 0 && (
                <ul className="city-dropdown">
                  {filteredDistricts.map((d, idx) => (
                    <li key={idx} onClick={() => selectDistrict(d)}>
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </label>
        )}

        <label>Nereye
          <div className="city-autocomplete">
            <input
              value={toCity}
              onChange={handleToCityInput}
              onFocus={() => toCity && setShowToCities(true)}
              placeholder="Şehir seçin..."
            />
            {showToCities && filteredToCities.length > 0 && (
              <ul className="city-dropdown">
                {filteredToCities.map((c, idx) => (
                  <li key={idx} onClick={() => selectToCity(c)}>
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </label>

        {toCity && DISTRICTS[toCity] && (
          <label>İlçe
            <div className="city-autocomplete">
              <input
                value={toDistrict}
                onChange={handleToDistrictInput}
                onFocus={() => toDistrict && setShowToDistricts(true)}
                placeholder="İlçe seçin..."
              />
              {showToDistricts && filteredToDistricts.length > 0 && (
                <ul className="city-dropdown">
                  {filteredToDistricts.map((d, idx) => (
                    <li key={idx} onClick={() => selectToDistrict(d)}>
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </label>
        )}

        <label>Min Fiyat
          <input 
            type="text"
            value={minPrice ? Number(minPrice).toLocaleString('tr-TR') + ' ₺' : ''} 
            onChange={e => {
              const cleaned = e.target.value.replace(/\D/g, '')
              setMinPrice(cleaned)
            }}
            placeholder="0 ₺"
          />
        </label>
        <label>Maks Fiyat
          <input 
            type="text"
            value={maxPrice ? Number(maxPrice).toLocaleString('tr-TR') + ' ₺' : ''} 
            onChange={e => {
              const cleaned = e.target.value.replace(/\D/g, '')
              setMaxPrice(cleaned)
            }}
            placeholder="0 ₺"
          />
        </label>
        <label>Yük Durumu
          <select value={loadStatus} onChange={e=>setLoadStatus(e.target.value)}>
            <option value="">Hepsi</option>
            <option>Boş</option>
            <option>Dolu</option>
          </select>
        </label>
        <button className="search-btn" onClick={() => window.scrollTo({top: document.querySelector('.list').offsetTop, behavior: 'smooth'})}>
          Ara
        </button>
      </aside>

      <section className="list">
        <h2>Firmalar</h2>
        {loading && <div className="loading">Yükleniyor...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && firms.length === 0 && <div className="empty">Firma bulunamadı</div>}
        <div className="cards">
          {filtered.map(f => <CompanyCard key={f.id} firm={f} />)}
        </div>
      </section>
    </div>
  )
}
