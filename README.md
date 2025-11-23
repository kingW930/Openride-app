# OpenRide Frontend Development Guide

## 🚀 Quick Start

```bash
# Navigate to project
cd openride-app

# Install dependencies
npm install

# Start Expo development server
npm start

# Run on specific platform
npm run android    # Android
npm run ios        # iOS
npm run web        # Web
```

## 📁 Project Structure

```
openride-app/
├── app/                      # Expo Router screens
│   ├── _layout.tsx          # Root navigation
│   ├── index.tsx            # Landing/redirect
│   ├── auth/                # Authentication screens
│   ├── rider/               # Rider-specific screens
│   └── driver/              # Driver-specific screens
├── src/
│   ├── api/                 # API clients & endpoints
│   ├── components/          # Reusable components
│   │   ├── ui/             # Base UI components
│   │   ├── map/            # Map-related components
│   │   └── ride/           # Ride-specific components
│   ├── constants/           # App constants
│   ├── hooks/               # Custom React hooks
│   ├── navigation/          # Navigation helpers
│   ├── services/            # Core services
│   ├── store/               # Zustand state management
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
└── assets/                  # Images, fonts, icons
```

## 🏗️ Architecture Overview

### State Management
- **Zustand** for global state (auth, rider, driver, trip)
- **React Query** for server state (future enhancement)
- **SecureStore** for JWT tokens

### Real-time Communication
- **Socket.IO** for driver location updates
- Automatic reconnection with exponential backoff
- Fallback to polling if socket fails

### Navigation
- **Expo Router** (file-based routing)
- Role-based navigation (Rider/Driver)
- AuthGuard for protected routes

## 🔑 Key Features

### Dual-Role Architecture
Single codebase serves both Rider and Driver roles:
```typescript
const role = useAuthStore(state => state.user?.role);
// 'rider' | 'driver'
```

### API Integration
```typescript
// REST endpoints
POST /v1/auth/send-otp
POST /v1/auth/verify-otp
GET  /v1/routes
POST /v1/bookings
GET  /v1/bookings/{id}/ticket

// WebSocket events
driver:location
rider:subscribe
booking:confirmed
trip:update
```

### Real-time Location
- Driver: Background location with <8% battery impact
- Rider: Live tracking with <300ms latency
- Animated markers with smooth interpolation

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Coverage Requirements
- Services: ≥80%
- Components: ≥70%
- Utils: ≥90%

## 🔒 Security

- JWT stored in **Keychain** (never AsyncStorage)
- HTTPS everywhere
- PII redacted before logging to Sentry
- Ticket signatures for offline verification

## 📱 Performance Targets

- Cold start: **<2s**
- Search response: **<300ms** perceived
- Driver location latency: **<300ms**
- Crash-free sessions: **>99.5%**
- Battery drain (driver): **<8%/hour**

## 🛠️ Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Follow File Size Limits
- Max 500-600 lines per file
- Split into logical modules

### 3. Write Tests
```bash
# Create test file alongside component
src/components/MyComponent.tsx
src/components/__tests__/MyComponent.test.tsx
```

### 4. Lint & Format
```bash
npm run lint
npm run format
```

### 5. Submit PR
- Ensure all tests pass
- Coverage meets requirements
- No ESLint errors

## 🚢 Build & Deploy

### Development Build
```bash
npx eas-cli build --profile development --platform android
```

### Production Build
```bash
npx eas-cli build --profile production --platform ios
npx eas-cli build --profile production --platform android
```

### CI/CD
GitHub Actions automatically:
- Runs tests on PR
- Builds artifacts on main merge
- Deploys to TestFlight/Play Console

## 📦 Dependencies

### Core
- **expo**: ~54.0.23
- **react-native**: 0.81.5
- **expo-router**: ~4.0.0

### State & Data
- **zustand**: ^5.0.0
- **axios**: ^1.7.0
- **socket.io-client**: ^4.8.0

### UI & Maps
- **react-native-maps**: 1.18.0
- **react-native-qrcode-svg**: ^6.3.0
- **expo-barcode-scanner**: ~14.0.0

### Storage & Location
- **expo-secure-store**: ~14.0.0
- **expo-location**: ~18.0.0
- **expo-notifications**: ~0.29.0

## 🐛 Debugging

### React Native Debugger
```bash
# Start debugger
npx react-devtools
```

### Network Inspection
```bash
# Enable network inspector in Expo
Settings → Enable Network Inspect
```

### Logs
```bash
# View logs
npx expo start --clear

# Filter logs
npx expo start | grep "ERROR"
```

## 🌍 Environment Variables

Create `.env` file:
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/v1
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Frontend PRD](../OpenRIDE%20—%20Frontend%20PRD%20&%20Technical.txt)
- [Unified Requirements](../OpenRide%20Unified%20Requirements%20Docum.txt)
- [Coding Constraints](../constraints.md)

## 🤝 Contributing

1. Follow the constraints in `constraints.md`
2. Maintain file size limits (<600 lines)
3. Write comprehensive tests (≥80% coverage)
4. Use TypeScript strict mode
5. Document complex logic
6. Update this README for major changes

## 📝 License

Proprietary - OpenRide Platform
