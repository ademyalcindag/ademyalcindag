import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLORS, SIZES, FONTS } from '../constants'
import { api } from '../api'

function MessageCard({ message }) {
  const formattedDate = message.createdAt
    ? new Date(message.createdAt).toLocaleDateString('tr-TR')
    : '-'

  return (
    <View style={styles.messageCard}>
      <View style={styles.messageHeader}>
        <Text style={styles.senderName}>
          {message.senderName || 'Anonim'}
        </Text>
        <Text style={styles.messageDate}>{formattedDate}</Text>
      </View>

      <View style={styles.firmInfo}>
        <View style={styles.iconBadge}>
          <Ionicons name="business" size={14} color={COLORS.primary} />
        </View>
        <Text style={styles.firmName}>
          {message.firmName || 'Firma'}
        </Text>
      </View>

      <Text style={styles.messageContent}>{message.message}</Text>

      {message.senderEmail && (
        <View style={styles.contactInfo}>
          <Ionicons name="mail" size={14} color={COLORS.textSecondary} />
          <Text style={styles.contactText}>{message.senderEmail}</Text>
        </View>
      )}
    </View>
  )
}

export default function MessagesScreen() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadDataAndMessages()
  }, [])

  const loadDataAndMessages = async () => {
    try {
      const userData = await AsyncStorage.getItem('user')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        
        // If it's a company, load messages for their firm
        const companyId = parsedUser.firmId || parsedUser.id
        if (parsedUser.isCompany && companyId) {
          const msgs = await api.fetchMessages(companyId)
          setMessages(msgs || [])
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadDataAndMessages()
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
          <Ionicons name="mail-outline" size={48} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>Mesajlar</Text>
          <Text style={styles.emptyText}>
            Firma hesabıyla giriş yaparak mesajlarınızı görüntüleyebilirsiniz
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  const sortedMessages = [...messages].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0)
    const dateB = new Date(b.createdAt || 0)
    return dateB - dateA
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mesajlar</Text>
        <Text style={styles.headerSubtitle}>
          {messages.length} yeni mesaj
        </Text>
      </View>

      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="mail-outline" size={48} color={COLORS.textSecondary} />
          <Text style={styles.emptyTitle}>Mesaj Yok</Text>
          <Text style={styles.emptyText}>
            Henüz herhangi bir mesaj almadınız
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedMessages}
          renderItem={({ item }) => <MessageCard message={item} />}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          contentContainerStyle={styles.listContent}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  listContent: {
    padding: SIZES.md,
  },
  messageCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  senderName: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    color: COLORS.text,
  },
  messageDate: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
  },
  firmInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
    marginBottom: SIZES.md,
    paddingBottom: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  firmName: {
    fontSize: FONTS.normal,
    fontWeight: '600',
    color: COLORS.primary,
  },
  messageContent: {
    fontSize: FONTS.normal,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: SIZES.md,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.sm,
    paddingTop: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  contactText: {
    fontSize: FONTS.small,
    color: COLORS.textSecondary,
    flex: 1,
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
