import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {

    addToCart: (state, action) => {

      const item = action.payload;

      const existing = state.items.find(
        (i) => i._id === item._id
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...item,
          quantity: 1,
        });
      }

      state.totalQuantity += 1;

      state.totalAmount += item.price;
    },

    removeFromCart: (state, action) => {

      const item = state.items.find(
        (i) => i._id === action.payload
      );

      if (!item) return;

      state.totalQuantity -= item.quantity;

      state.totalAmount -=
        item.price * item.quantity;

      state.items = state.items.filter(
        (i) => i._id !== action.payload
      );
    },

    incrementQty: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (!item) return;
      item.quantity += 1;
      state.totalQuantity += 1;
      state.totalAmount += item.price;
    },

    decrementQty: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (!item) return;

      if (item.quantity <= 1) {
        state.totalQuantity -= item.quantity;
        state.totalAmount -= item.price * item.quantity;
        state.items = state.items.filter((i) => i._id !== action.payload);
        return;
      }

      item.quantity -= 1;
      state.totalQuantity -= 1;
      state.totalAmount -= item.price;
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQty,
  decrementQty,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;