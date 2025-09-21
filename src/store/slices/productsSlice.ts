import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types/product';

interface ProductsState {
  items: Product[];
  categories: string[];
  loading: boolean;
  selectedCategory: string | null;
}

const initialState: ProductsState = {
  items: [],
  categories: ['All', 'Candles', 'Kitchen', 'Textiles', 'Body Care', 'Home'],
  loading: false,
  selectedCategory: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setProducts, setSelectedCategory, setLoading } = productsSlice.actions;
export default productsSlice.reducer;