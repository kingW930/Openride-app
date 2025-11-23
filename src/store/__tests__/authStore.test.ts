import { useAuthStore } from '../src/store/authStore';

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
    });
  });

  it('should initialize with null user and token', () => {
    const { user, token } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();
  });

  it('should set auth correctly', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      phone: '+2341234567890',
      role: 'rider' as const,
      kycStatus: 'VERIFIED' as const,
    };
    const mockToken = 'test-token';

    await useAuthStore.getState().setAuth(mockToken, mockUser);

    const { user, token } = useAuthStore.getState();
    expect(user).toEqual(mockUser);
    expect(token).toEqual(mockToken);
  });

  it('should logout correctly', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      phone: '+2341234567890',
      role: 'rider' as const,
      kycStatus: 'VERIFIED' as const,
    };

    await useAuthStore.getState().setAuth('token', mockUser);
    await useAuthStore.getState().logout();

    const { user, token } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();
  });
});
