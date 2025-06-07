# RESOURCEMAP 

**Marketplace de ajuda humanitária** - Conectando doadores e organizações necessitadas através de uma plataforma móvel intuitiva.

## 📱 Sobre o Projeto

O RESOURCEMAP é um aplicativo móvel desenvolvido em React Native que facilita a conexão entre doadores e organizações que precisam de ajuda. A plataforma permite o cadastro de doações, necessidades e realização de matches entre oferta e demanda de recursos humanitários.


📸 Screenshots

🔐 Autenticação

Telas de login e registro com design moderno e validação de formulários
![ResourceMap login ](https://github.com/bia98silva/ResourcemapMobile/blob/main/img/loginscreen.jpg)

![ResourceMap criar conta](https://github.com/bia98silva/ResourcemapMobile/blob/main/img/criarcontascreen.jpg)



🏠 Dashboard e Navegação

Dashboard com estatísticas em tempo real e perfil completo do usuário
![ResourceMap HomeScreen](https://github.com/bia98silva/ResourcemapMobile/blob/main/img/homescreen.jpg)

💝 Gerenciamento de Doações

Sistema completo de CRUD para doações com filtros e categorias
![ResourceMap ](https://github.com/bia98silva/ResourcemapMobile/blob/main/img/doa%C3%A7oesscreen.jpg)

🆘 Necessidades e Matches

Visualização de necessidades com sistema de urgência e matches automáticos
![ResourceMap](https://github.com/bia98silva/ResourcemapMobile/blob/main/img/necessidaescreen.jpg)

### 🌟 Funcionalidades Principais

- **Autenticação completa** com login, registro e recuperação de senha
- **Gerenciamento de doações** (CRUD) com categorização e filtros
- **Visualização de necessidades** com sistema de urgência e matches
- **Perfil de usuário** com diferentes tipos (Doador, ONG, Admin)
- **Interface moderna** com gradientes, animações e feedback háptico
- **Sistema de notificações** e estatísticas em tempo real
- **Filtros avançados** por categoria, localização e urgência

### 👥 Tipos de Usuário

- **🤝 Doador**: Pode criar e gerenciar doações
- **🏢 Membro de ONG**: Pode criar necessidades e gerenciar recursos

## 🔧 Tecnologias Utilizadas

### Frontend (Mobile)
- **React Native** 0.79.3 - Framework principal
- **Expo** ~53.0.0 - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação entre telas
- **Expo Linear Gradient** - Gradientes visuais
- **Expo Haptics** - Feedback tátil
- **Expo Blur** - Efeitos de desfoque
- **React Native Animatable** - Animações
- **AsyncStorage** - Armazenamento local
- **Axios** - Cliente HTTP

### Estrutura de Navegação
- **Stack Navigator** - Navegação principal (Login/Register)
- **Bottom Tab Navigator** - Navegação entre telas principais
- **4 Telas principais**: Home, Doações, Necessidades, Perfil

## 🚀 Configuração e Instalação

### ⚠️ IMPORTANTE: Configuração da API

**A API backend deve estar rodando ANTES de iniciar o aplicativo móvel.**

1. **Primeiro, configure e inicie a API backend:**
   ```bash
   # Clone o repositório da API (https://github.com/VitorOnofreRamos/GSAuth)


2. **Verifique se a API está rodando:**
   - A API deve estar disponível em: `http://localhost:5289`
   - Teste o endpoint: `http://localhost:5289/api/Test/public`

3. **Configure a URL da API no app:**
   ```typescript
   // src/services/AuthService.ts
   const BASE_URL = 'http://10.0.2.2:5289/api'; // Para Android Emulator

### 📱 Configuração do App Mobile

#### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm** 
- **Expo CLI** instalado globalmente
- **Android Studio** (para Android) ou **Xcode** (para iOS)

#### Instalação

1. **Clone o repositório:**
   ```bash
   git clone 
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o projeto:**
   ```bash
   npm start
   # ou
   yarn start
   # ou
   expo start
   ```

## 🗂️ Estrutura do Projeto

```
src/
├── screens/           # Telas do aplicativo
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   ├── DonationsScreen.tsx
│   ├── RequestsScreen.tsx
│   └── ProfileScreen.tsx
├── navigation/        # Configuração de navegação
│   └── BottomTabNavigator.tsx
├── services/          # Serviços e APIs
│   └── AuthService.ts
└── App.tsx           # Componente principal
```

### 📱 Telas do Aplicativo

#### 🔐 Autenticação
- **Login**: Autenticação com email/senha
- **Registro**: Criação de conta com seleção de tipo de usuário

#### 🏠 Principais
- **Home**: Dashboard com estatísticas e ações rápidas
- **Doações**: CRUD completo de doações com filtros
- **Necessidades**: Visualização e matching de necessidades
- **Perfil**: Gerenciamento de conta e configurações

## 🔧 Configurações de Desenvolvimento

### Configuração do Android

1. **Configure o emulador Android:**
   ```bash
   # Inicie o Android Studio
   # Crie um AVD (Android Virtual Device)
   # Inicie o emulador
   ```


## 🔐 Autenticação e Segurança

### Fluxo de Autenticação
1. **Login/Registro** → Token JWT recebido
2. **Token armazenado** → AsyncStorage local
3. **Interceptor Axios** → Adiciona token em requests
4. **Validação automática** → Verifica token na inicialização
5. **Logout automático** → Remove tokens em caso de erro 401

### Segurança Implementada
- ✅ Tokens JWT com interceptors
- ✅ Validação de formulários
- ✅ Armazenamento seguro local
- ✅ Timeout de requisições
- ✅ Tratamento de erros de rede

## 🌐 API Integration

### Endpoints Utilizados
```typescript
// Autenticação
POST /api/Auth/login
POST /api/Auth/register
POST /api/Auth/logout
GET  /api/Auth/me
POST /api/Auth/change-password
DELETE /api/Auth/delete-account

// Testes de conectividade
GET /api/Test/public
```

### Configuração de Rede
- **Timeout**: 10 segundos
- **Base URL**: Configurável via AuthService
- **Headers**: JSON + Authorization Bearer
- **Interceptors**: Request (token) + Response (erro 401)

## 🎨 Design System

### Cores Principais
```css
Primary: #3182ce (Blue)
Secondary: #1a365d (Dark Blue)
Success: #38a169 (Green)
Warning: #d69e2e (Orange)
Error: #e53e3e (Red)
Background: #f7fafc (Light Gray)
```

### Componentes Visuais
- **Linear Gradients** para botões e headers
- **Blur Effects** para overlays
- **Shadow System** para cards
- **Haptic Feedback** para interações
- **Icon System** com Ionicons

- Link do video da aplicação rodando: https://youtu.be/ZAl2CDYfFwI


**RESOURCEMAP Team**
- Beatriz Silva - RM552600
- Vitor Onofre Ramos - RM553241
- Pedro Henrique soares araujo - RM553801 

---

**Feito com ❤️ pela equipe RESOURCEMAP**
