import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart state from browser storage if present
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sync cart changes with localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add product to cart with quantity validation
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);

      if (existingItem) {
        // Enforce stock limits when increasing quantity
        const updatedQty = existingItem.quantity + quantity;
        const finalQty = updatedQty > product.stock ? product.stock : updatedQty;

        return prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: finalQty } : item
        );
      } else {
        const initialQty = quantity > product.stock ? product.stock : quantity;
        return [...prevItems, { ...product, quantity: initialQty }];
      }
    });
  };

  // Update specific item quantity directly
  const updateQuantity = (productId, newQuantity, maxStock) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const finalQuantity = newQuantity > maxStock ? maxStock : newQuantity;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity: finalQuantity } : item
      )
    );
  };

  // Remove single item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  // Clear all items after placing an order
  const clearCart = () => {
    setCartItems([]);
  };

  // Derived totals
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        cartTotalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartContext;