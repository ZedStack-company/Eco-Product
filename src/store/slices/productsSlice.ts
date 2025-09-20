import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  hoverImage?: string;
  category: string;
  description?: string;
  inStock: boolean;
}

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