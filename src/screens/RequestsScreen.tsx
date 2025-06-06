import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface Request {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  urgency: 'low' | 'medium' | 'high';
  location: string;
  status: 'open' | 'matched' | 'fulfilled';
  createdAt: string;
  organization: string;
  contactInfo: string;
}

const urgencyLevels = [
  { key: 'low', label: 'Baixa', color: '#38a169', icon: 'remove-circle' },
  { key: 'medium', label: 'Média', color: '#d69e2e', icon: 'alert-circle' },
  { key: 'high', label: 'Alta', color: '#e53e3e', icon: 'warning' },
];

const categories = [
  { key: 'food', label: 'Alimentos', icon: 'restaurant' },
  { key: 'clothing', label: 'Roupas', icon: 'shirt' },
  { key: 'medicine', label: 'Medicamentos', icon: 'medical' },
  { key: 'hygiene', label: 'Higiene', icon: 'water' },
  { key: 'shelter', label: 'Abrigo', icon: 'home' },
  { key: 'education', label: 'Educação', icon: 'school' },
  { key: 'other', label: 'Outros', icon: 'cube' },
];

export default function RequestsScreen() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      
      const mockRequests: Request[] = [
        {
          id: '1',
          title: 'Alimentos para 100 famílias',
          description: 'Urgente! Precisamos de cestas básicas para famílias afetadas pelas enchentes. Itens essenciais: arroz, feijão, óleo, açúcar.',
          category: 'food',
          quantity: 100,
          urgency: 'high',
          location: 'Porto Alegre, RS',
          status: 'open',
          createdAt: '2025-06-01T08:00:00Z',
          organization: 'ONG Esperança',
          contactInfo: 'contato@esperanca.org.br',
        },
        {
          id: '2',
          title: 'Roupas de inverno infantis',
          description: 'Crianças de 0 a 12 anos precisam de agasalhos, casacos e sapatos fechados para o inverno.',
          category: 'clothing',
          quantity: 50,
          urgency: 'medium',
          location: 'São Paulo, SP',
          status: 'open',
          createdAt: '2025-06-02T10:30:00Z',
          organization: 'Casa da Criança',
          contactInfo: '(11) 99999-9999',
        },
        {
          id: '3',
          title: 'Medicamentos para hipertensão',
          description: 'Idosos da comunidade precisam de medicamentos para controle da pressão arterial.',
          category: 'medicine',
          quantity: 30,
          urgency: 'high',
          location: 'Belo Horizonte, MG',
          status: 'matched',
          createdAt: '2025-06-03T14:15:00Z',
          organization: 'Centro Comunitário Vila Nova',
          contactInfo: 'vilanota@email.com',
        },
        {
          id: '4',
          title: 'Material escolar',
          description: 'Cadernos, lápis, canetas e material didático para crianças em idade escolar.',
          category: 'education',
          quantity: 80,
          urgency: 'low',
          location: 'Recife, PE',
          status: 'open',
          createdAt: '2025-06-04T09:45:00Z',
          organization: 'Escola Comunitária Futuro',
          contactInfo: '(81) 88888-8888',
        },
        {
          id: '5',
          title: 'Produtos de higiene pessoal',
          description: 'Sabonetes, shampoo, pasta de dente, fraldas e absorventes para famílias carentes.',
          category: 'hygiene',
          quantity: 60,
          urgency: 'medium',
          location: 'Fortaleza, CE',
          status: 'fulfilled',
          createdAt: '2025-05-28T16:20:00Z',
          organization: 'Associação Mãos Solidárias',
          contactInfo: 'maossolidarias@gmail.com',
        },
      ];
      setRequests(mockRequests);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as necessidades');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadRequests();
    setIsRefreshing(false);
  };

  const handleMatch = (requestId: string) => {
    Alert.alert(
      'Confirmar Match',
      'Deseja se comprometer com esta necessidade?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            setRequests(prev =>
              prev.map(req =>
                req.id === requestId ? { ...req, status: 'matched' } : req
              )
            );
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Sucesso!', 'Match realizado! Entre em contato com a organização.');
          },
        },
      ]
    );
  };

  const getUrgencyConfig = (urgency: string) => {
    return urgencyLevels.find(u => u.key === urgency) || urgencyLevels[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#38a169';
      case 'matched':
        return '#d69e2e';
      case 'fulfilled':
        return '#718096';
      default:
        return '#64748b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Aberto';
      case 'matched':
        return 'Matched';
      case 'fulfilled':
        return 'Atendido';
      default:
        return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.key === category);
    return cat?.icon || 'cube';
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || request.category === selectedCategory;
    const matchesUrgency = selectedUrgency === 'all' || request.urgency === selectedUrgency;
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const renderRequestItem = ({ item }: { item: Request }) => {
    const urgencyConfig = getUrgencyConfig(item.urgency);
    
    return (
      <TouchableOpacity style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <View style={styles.requestIcon}>
            <Ionicons 
              name={getCategoryIcon(item.category) as any} 
              size={24} 
              color="#3182ce" 
            />
          </View>
          <View style={styles.requestInfo}>
            <Text style={styles.requestTitle}>{item.title}</Text>
            <Text style={styles.requestOrganization}>{item.organization}</Text>
            <Text style={styles.requestLocation}>📍 {item.location}</Text>
          </View>
          <View style={styles.badges}>
            <View style={[styles.urgencyBadge, { backgroundColor: urgencyConfig.color }]}>
              <Ionicons name={urgencyConfig.icon as any} size={12} color="#ffffff" />
              <Text style={styles.urgencyText}>{urgencyConfig.label}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.requestDescription}>{item.description}</Text>
        
        <View style={styles.requestFooter}>
          <View style={styles.requestMeta}>
            <Text style={styles.requestQuantity}>Quantidade: {item.quantity}</Text>
            <Text style={styles.requestDate}>
              {new Date(item.createdAt).toLocaleDateString('pt-BR')}
            </Text>
            <Text style={styles.requestContact}>📞 {item.contactInfo}</Text>
          </View>
          
          {item.status === 'open' && (
            <TouchableOpacity
              style={styles.matchButton}
              onPress={() => handleMatch(item.id)}
            >
              <LinearGradient
                colors={['#38a169', '#2f855a'] as const}
                style={styles.matchButtonGradient}
              >
                <Ionicons name="hand-right" size={20} color="#ffffff" />
                <Text style={styles.matchButtonText}>Ajudar</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search and Filter Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar necessidades..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        
        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedCategory === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedCategory === 'all' && styles.filterButtonTextActive
            ]}>
              Todas
            </Text>
          </TouchableOpacity>
          
          {categories.map(category => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.filterButton,
                selectedCategory === category.key && styles.filterButtonActive
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Ionicons 
                name={category.icon as any} 
                size={14} 
                color={selectedCategory === category.key ? '#ffffff' : '#64748b'} 
              />
              <Text style={[
                styles.filterButtonText,
                selectedCategory === category.key && styles.filterButtonTextActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Urgency Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedUrgency === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedUrgency('all')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedUrgency === 'all' && styles.filterButtonTextActive
            ]}>
              Todas
            </Text>
          </TouchableOpacity>
          
          {urgencyLevels.map(urgency => (
            <TouchableOpacity
              key={urgency.key}
              style={[
                styles.filterButton,
                selectedUrgency === urgency.key && styles.filterButtonActive,
                selectedUrgency === urgency.key && { backgroundColor: urgency.color }
              ]}
              onPress={() => setSelectedUrgency(urgency.key)}
            >
              <Ionicons 
                name={urgency.icon as any} 
                size={14} 
                color={selectedUrgency === urgency.key ? '#ffffff' : urgency.color} 
              />
              <Text style={[
                styles.filterButtonText,
                selectedUrgency === urgency.key && styles.filterButtonTextActive
              ]}>
                {urgency.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{requests.filter(r => r.status === 'open').length}</Text>
          <Text style={styles.statLabel}>Abertas</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{requests.filter(r => r.urgency === 'high').length}</Text>
          <Text style={styles.statLabel}>Urgentes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{requests.filter(r => r.status === 'matched').length}</Text>
          <Text style={styles.statLabel}>Matched</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{requests.filter(r => r.status === 'fulfilled').length}</Text>
          <Text style={styles.statLabel}>Atendidas</Text>
        </View>
      </View>

      {/* Requests List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3182ce" />
          <Text style={styles.loadingText}>Carregando necessidades...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRequests}
          renderItem={renderRequestItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#3182ce']}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="hand-left-outline" size={64} color="#64748b" />
              <Text style={styles.emptyText}>Nenhuma necessidade encontrada</Text>
              <Text style={styles.emptySubtext}>
                Tente ajustar os filtros de busca
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  searchSection: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1a202c',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterButtonActive: {
    backgroundColor: '#3182ce',
    borderColor: '#3182ce',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#a0aec0',
    marginTop: 8,
    textAlign: 'center',
  },
  requestCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  requestHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  requestIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(49, 130, 206, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 4,
  },
  requestOrganization: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3182ce',
    marginBottom: 2,
  },
  requestLocation: {
    fontSize: 12,
    color: '#64748b',
  },
  badges: {
    alignItems: 'flex-end',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 4,
  },
  urgencyText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  requestDescription: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
    marginBottom: 16,
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  requestMeta: {
    flex: 1,
  },
  requestQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 2,
  },
  requestDate: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  requestContact: {
    fontSize: 12,
    color: '#3182ce',
  },
  matchButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 12,
  },
  matchButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  matchButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});