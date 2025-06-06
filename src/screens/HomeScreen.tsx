import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

import { authService, User } from '../services/AuthService';

const { width } = Dimensions.get('window');

interface StatCard {
  title: string;
  value: string;
  icon: string;
  color: string;
  gradient: readonly [string, string];
}

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats] = useState<StatCard[]>([
    {
      title: 'Doações Ativas',
      value: '156',
      icon: 'heart',
      color: '#e53e3e',
      gradient: ['#fed7d7', '#feb2b2'] as const,
    },
    {
      title: 'Necessidades',
      value: '89',
      icon: 'hand-left',
      color: '#3182ce',
      gradient: ['#bee3f8', '#90cdf4'] as const,
    },
    {
      title: 'ONGs Parceiras',
      value: '23',
      icon: 'people',
      color: '#38a169',
      gradient: ['#c6f6d5', '#9ae6b4'] as const,
    },
    {
      title: 'Matches Feitos',
      value: '342',
      icon: 'checkmark-circle',
      color: '#d69e2e',
      gradient: ['#faf089', '#f6e05e'] as const,
    },
  ]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
   
        const storedUser = await authService.getStoredUser();
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await loadUserData();
    setIsRefreshing(false);
  };

  const handleQuickAction = (action: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
   
    console.log(`Ação rápida: ${action}`);
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'DONOR':
        return 'Doador';
      case 'NGO_MEMBER':
        return 'Membro de ONG';
      case 'ADMIN':
        return 'Administrador';
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'DONOR':
        return 'heart';
      case 'NGO_MEMBER':
        return 'people';
      case 'ADMIN':
        return 'shield';
      default:
        return 'person';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={['#3182ce']}
          tintColor="#3182ce"
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Section */}
      <LinearGradient
        colors={['#1a365d', '#2d5282'] as const}
        style={styles.welcomeSection}
      >
        <View style={styles.welcomeContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Ionicons 
                name={getRoleIcon(user?.role || '') as any} 
                size={32} 
                color="#ffffff" 
              />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.welcomeText}>Olá,</Text>
              <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
              <Text style={styles.userRole}>
                {getRoleDisplayName(user?.role || '')}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => handleQuickAction('notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color="#ffffff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Stats Grid */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Estatísticas da Plataforma</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <TouchableOpacity
              key={index}
              style={styles.statCard}
              onPress={() => handleQuickAction(`stat-${index}`)}
            >
              <LinearGradient
                colors={stat.gradient}
                style={styles.statGradient}
              >
                <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                  <Ionicons name={stat.icon as any} size={24} color="#ffffff" />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('new-donation')}
          >
            <BlurView intensity={20} style={styles.quickActionBlur}>
              <LinearGradient
                colors={['rgba(225, 29, 72, 0.8)', 'rgba(225, 29, 72, 0.6)'] as const}
                style={styles.quickActionGradient}
              >
                <Ionicons name="add-circle" size={32} color="#ffffff" />
                <Text style={styles.quickActionText}>Nova Doação</Text>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('find-needs')}
          >
            <BlurView intensity={20} style={styles.quickActionBlur}>
              <LinearGradient
                colors={['rgba(49, 130, 206, 0.8)', 'rgba(49, 130, 206, 0.6)'] as const}
                style={styles.quickActionGradient}
              >
                <Ionicons name="search" size={32} color="#ffffff" />
                <Text style={styles.quickActionText}>Buscar Necessidades</Text>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('my-matches')}
          >
            <BlurView intensity={20} style={styles.quickActionBlur}>
              <LinearGradient
                colors={['rgba(56, 161, 105, 0.8)', 'rgba(56, 161, 105, 0.6)'] as const}
                style={styles.quickActionGradient}
              >
                <Ionicons name="link" size={32} color="#ffffff" />
                <Text style={styles.quickActionText}>Meus Matches</Text>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => handleQuickAction('reports')}
          >
            <BlurView intensity={20} style={styles.quickActionBlur}>
              <LinearGradient
                colors={['rgba(214, 158, 46, 0.8)', 'rgba(214, 158, 46, 0.6)'] as const}
                style={styles.quickActionGradient}
              >
                <Ionicons name="bar-chart" size={32} color="#ffffff" />
                <Text style={styles.quickActionText}>Relatórios</Text>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Atividade Recente</Text>
        <View style={styles.activityList}>
          {[
            {
              icon: 'checkmark-circle',
              title: 'Match realizado com sucesso',
              subtitle: 'Doação de alimentos → ONG Esperança',
              time: '2 horas atrás',
              color: '#38a169',
            },
            {
              icon: 'heart',
              title: 'Nova doação cadastrada',
              subtitle: 'Roupas de inverno disponíveis',
              time: '5 horas atrás',
              color: '#e53e3e',
            },
            {
              icon: 'people',
              title: 'Nova ONG parceira',
              subtitle: 'Instituto Solidário se juntou à plataforma',
              time: '1 dia atrás',
              color: '#3182ce',
            },
          ].map((activity, index) => (
            <TouchableOpacity
              key={index}
              style={styles.activityItem}
              onPress={() => handleQuickAction(`activity-${index}`)}
            >
              <View style={[styles.activityIcon, { backgroundColor: activity.color }]}>
                <Ionicons name={activity.icon as any} size={20} color="#ffffff" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748b" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  welcomeSection: {
    padding: 24,
    paddingTop: 40,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#e53e3e',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#4a5568',
    textAlign: 'center',
  },
  quickActionsContainer: {
    padding: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 60) / 2,
    height: 120,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionBlur: {
    flex: 1,
  },
  quickActionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  quickActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  activityContainer: {
    padding: 20,
  },
  activityList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
  },
});