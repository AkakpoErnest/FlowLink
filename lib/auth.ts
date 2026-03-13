import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  walletAddress?: string
  isWalletConnected: boolean
  isEmailVerified: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  connectWallet: (address: string) => void
  disconnectWallet: () => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const user: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            isWalletConnected: false,
            isEmailVerified: true,
          }
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          })
          
          return true
        } catch (error) {
          set({ isLoading: false })
          return false
        }
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true })
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const user: User = {
            id: '1',
            email,
            name,
            isWalletConnected: false,
            isEmailVerified: false,
          }
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          })
          
          return true
        } catch (error) {
          set({ isLoading: false })
          return false
        }
      },

      connectWallet: (address: string) => {
        const { user } = get()
        if (user) {
          set({
            user: {
              ...user,
              walletAddress: address,
              isWalletConnected: true,
            }
          })
        }
      },

      disconnectWallet: () => {
        const { user } = get()
        if (user) {
          set({
            user: {
              ...user,
              walletAddress: undefined,
              isWalletConnected: false,
            }
          })
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
