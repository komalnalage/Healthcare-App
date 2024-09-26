import React from "react";
import { View, Text, StyleSheet } from "react-native";

const SelectedSpecializations = ({ selectedItems }) => {
  return (
    <View style={styles.selectedItemsContainer}>
      {selectedItems.map((item) => (
        <View style={styles.selectedItem} key={item._id}>
          <Text 
          key={item._id}
          style={styles.selectedItemText}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  selectedItemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  selectedItem: {
    backgroundColor: "#f1f1f1",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedItemText: {
    fontSize: 14,
  },
});

export default SelectedSpecializations;
