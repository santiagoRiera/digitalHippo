import { Product } from '@/payload-types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type CartItem = {
  product: Product
}

type CartState = {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          return { items: [...state.items, { product }] }
        }),
      removeItem: (id) =>
        set((state) => {
          const index = state.items.findIndex((item) => item.product.id === id)
          if (index === -1) return state // No item found, return state as is
          
          const newItems = [...state.items]
          newItems.splice(index, 1) // Remove only the first occurrence
          return { items: newItems }
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
