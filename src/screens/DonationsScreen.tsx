import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface Donation {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  location: string;
  status: 'available' | 'reserved' | 'delivered';
  createdAt: string;
  donorName: string;
}

const categories = [
  { key: 'food', label: 'Alimentos', icon: 'restaurant' },
  { key: 'clothing', label: 'Roupas', icon: 'shirt' },
  { key: 'medicine', label: 'Medicamentos', icon: 'medical' },
  { key: 'hygiene', label: 'Higiene', icon: 'water' },
  { key: 'other', label: 'Outros', icon: 'cube' },
];

export default function DonationsScreen() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'food',
    quantity: '1',
    location: '',
  });

  useEffect(() => {
    loadDonations();
  }, []);

  // CREATE - Adicionar nova doação
  const loadDonations = async () => {
    setIsLoading(true);
    try {
      
      const mockDonations: Donation[] = [
        {
          id: '1',
          title: 'Cestas Básicas',
          description: 'Cestas básicas completas para familias necessitadas',
          category: 'food',
          quantity: 50,
          location: 'São Paulo, SP',
          status: 'available',
          createdAt: '2025-06-01T10:00:00Z',
          donorName: 'João Silva',
        },
        {
          id: '2',
          title: 'Roupas de Inverno',
          description: 'Agasalhos, casacos e cobertores em bom estado',
          category: 'clothing',
          quantity: 30,
          location: 'Rio de Janeiro, RJ',
          status: 'available',
          createdAt: '2025-06-02T14:30:00Z',
          donorName: 'Maria Santos',
        },
        {
          id: '3',
          title: 'Medicamentos Básicos',
          description: 'Remédios para gripe, dor de cabeça e primeiros socorros',
          category: 'medicine',
          quantity: 100,
          location: 'Belo Horizonte, MG',
          status: 'reserved',
          createdAt: '2025-06-03T09:15:00Z',
          donorName: 'Carlos Oliveira',
        },
      ];
      setDonations(mockDonations);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as doações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDonations();
    setIsRefreshing(false);
  };

  const createDonation = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const newDonation: Donation = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        quantity: parseInt(formData.quantity) || 1,
        location: formData.location.trim(),
        status: 'available',
        createdAt: new Date().toISOString(),
        donorName: 'Usuário Atual', 
      };

      setDonations(prev => [newDonation, ...prev]);
      resetForm();
      setShowModal(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Sucesso', 'Doação criada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a doação');
    }
  };


  const updateDonation = async () => {
    if (!editingDonation) return;

    try {
      const updatedDonation: Donation = {
        ...editingDonation,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        quantity: parseInt(formData.quantity) || 1,
        location: formData.location.trim(),
      };

      setDonations(prev =>
        prev.map(donation =>
          donation.id === editingDonation.id ? updatedDonation : donation
        )
      );

      resetForm();
      setShowModal(false);
      setEditingDonation(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Sucesso', 'Doação atualizada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a doação');
    }
  };

  // DELETE - Remover doação
  const deleteDonation = (donationId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta doação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setDonations(prev => prev.filter(d => d.id !== donationId));
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'food',
      quantity: '1',
      location: '',
    });
  };

  const openEditModal = (donation: Donation) => {
    setEditingDonation(donation);
    setFormData({
      title: donation.title,
      description: donation.description,
      category: donation.category,
      quantity: donation.quantity.toString(),
      location: donation.location,
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingDonation(null);
    resetForm();
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#38a169';
      case 'reserved':
        return '#d69e2e';
      case 'delivered':
        return '#718096';
      default:
        return '#64748b';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'reserved':
        return 'Reservado';
      case 'delivered':
        return 'Entregue';
      default:
        return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.key === category);
    return cat?.icon || 'cube';
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || donation.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderDonationItem = ({ item }: { item: Donation }) => (
    <TouchableOpacity style={styles.donationCard}>
      <View style={styles.donationHeader}>
        <View style={styles.donationIcon}>
          <Ionicons 
            name={getCategoryIcon(item.category) as any} 
            size={24} 
            color="#3182ce" 
          />
        </View>
        <View style={styles.donationInfo}>
          <Text style={styles.donationTitle}>{item.title}</Text>
          <Text style={styles.donationLocation}>📍 {item.location}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      
      <Text style={styles.donationDescription}>{item.description}</Text>
      
      <View style={styles.donationFooter}>
        <View style={styles.donationMeta}>
          <Text style={styles.donationQuantity}>Qtd: {item.quantity}</Text>
          <Text style={styles.donationDate}>
            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
          </Text>
        </View>
        
        <View style={styles.donationActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openEditModal(item)}
          >
            <Ionicons name="create-outline" size={20} color="#3182ce" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => deleteDonation(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#e53e3e" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search and Filter Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar doações..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilter}
        >
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'all' && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === 'all' && styles.categoryButtonTextActive
            ]}>
              Todos
            </Text>
          </TouchableOpacity>
          
          {categories.map(category => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                selectedCategory === category.key && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Ionicons 
                name={category.icon as any} 
                size={16} 
                color={selectedCategory === category.key ? '#ffffff' : '#64748b'} 
              />
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.key && styles.categoryButtonTextActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Donations List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3182ce" />
          <Text style={styles.loadingText}>Carregando doações...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDonations}
          renderItem={renderDonationItem}
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
              <Ionicons name="heart-outline" size={64} color="#64748b" />
              <Text style={styles.emptyText}>Nenhuma doação encontrada</Text>
              <Text style={styles.emptySubtext}>
                Seja o primeiro a criar uma doação!
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={openCreateModal}
      >
        <LinearGradient
          colors={['#3182ce', '#2c5aa0']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="#ffffff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Create/Edit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowModal(false)}
            >
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingDonation ? 'Editar Doação' : 'Nova Doação'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Título *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ex: Cestas básicas, Roupas de inverno..."
                value={formData.title}
                onChangeText={text => setFormData(prev => ({ ...prev, title: text }))}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Descreva os itens da doação..."
                value={formData.description}
                onChangeText={text => setFormData(prev => ({ ...prev, description: text }))}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Categoria</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categorySelector}>
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category.key}
                      style={[
                        styles.categoryOption,
                        formData.category === category.key && styles.categoryOptionSelected
                      ]}
                      onPress={() => setFormData(prev => ({ ...prev, category: category.key }))}
                    >
                      <Ionicons 
                        name={category.icon as any} 
                        size={20} 
                        color={formData.category === category.key ? '#ffffff' : '#64748b'} 
                      />
                      <Text style={[
                        styles.categoryOptionText,
                        formData.category === category.key && styles.categoryOptionTextSelected
                      ]}>
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Quantidade</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="1"
                  value={formData.quantity}
                  onChangeText={text => setFormData(prev => ({ ...prev, quantity: text }))}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 2 }]}>
                <Text style={styles.inputLabel}>Localização *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ex: São Paulo, SP"
                  value={formData.location}
                  onChangeText={text => setFormData(prev => ({ ...prev, location: text }))}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={editingDonation ? updateDonation : createDonation}
            >
              <LinearGradient
                colors={['#3182ce', '#2c5aa0']}
                style={styles.saveButtonGradient}
              >
                <Text style={styles.saveButtonText}>
                  {editingDonation ? 'Atualizar' : 'Criar'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1a202c',
  },
  categoryFilter: {
    flexDirection: 'row',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryButtonActive: {
    backgroundColor: '#3182ce',
    borderColor: '#3182ce',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
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
  donationCard: {
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
  donationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  donationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(49, 130, 206, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  donationInfo: {
    flex: 1,
  },
  donationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 4,
  },
  donationLocation: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  donationDescription: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
    marginBottom: 16,
  },
  donationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  donationMeta: {
    flex: 1,
  },
  donationQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
  },
  donationDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  donationActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: 'rgba(229, 62, 62, 0.1)',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a202c',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  categorySelector: {
    flexDirection: 'row',
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryOptionSelected: {
    backgroundColor: '#3182ce',
    borderColor: '#3182ce',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  categoryOptionTextSelected: {
    color: '#ffffff',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: '#f7fafc',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});