import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { initStripe } from '@stripe/stripe-react-native';

const PaymentScreen = ({ children, onInit }) => {
  useEffect(() => {
    async function initialize() {
      const publishableKey = "pk_test_51NZrS8G1gSgjoP5m8fcD0OsQYx5YWkclDqudHslhpKXW9w1q8mUVOwfBoaoc8jWEaycnbnsLYrqZecaYYj5RTqLY00yV9SIF1B"
      if (publishableKey) {
        await initStripe({
          publishableKey,
        });

        onInit?.();
      }
    }
    initialize();
  }, []);

  return (
    <ScrollView
    
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      accessibilityLabel="payment-screen"
      style={styles.container}
      keyboardShouldPersistTaps="always"
    >
      {children}
    </ScrollView>

  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 0,
  },
});

export default PaymentScreen;
