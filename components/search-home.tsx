import { useThemeColor } from "@/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { Button } from "./ui/button";

interface SearchHomeProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchHome({
  searchQuery,
  setSearchQuery,
}: SearchHomeProps) {
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");

  return (
    <View
      style={[
        styles.searchContainer,
        {
          backgroundColor: useThemeColor(
            { light: "#F2F2F7", dark: "#2C2C2E" },
            "background"
          ),
        },
      ]}
    >
      <Ionicons
        name="search"
        size={20}
        color={iconColor}
        style={styles.searchIcon}
      />
      <TextInput
        style={[styles.searchInput, { color: textColor }]}
        placeholder="Buscar tareas..."
        placeholderTextColor={iconColor}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.length > 0 && (
        <Button onPress={() => setSearchQuery("")}>
          <Ionicons name="close-circle" size={20} color={iconColor} />
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffd",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
});
