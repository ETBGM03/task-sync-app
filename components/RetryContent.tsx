import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  message?: Error | string;
  isLoading: boolean;
  onRetry: () => void;
};

export const RetryContent = ({
  message = "Algo salió mal",
  onRetry,
  isLoading,
}: Props) => {
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  const messageError = typeof message === "string" ? message : message?.message;

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
      <View>
        <Ionicons
          name="alert-circle"
          color="#FF6B6B"
          style={{ fontSize: 60 }}
        />
      </View>

      <Text style={styles.title}>{messageError}</Text>
      <Text style={styles.subtitle}>Oops! Algo salió mal</Text>

      <TouchableOpacity style={styles.button} onPress={onRetry}>
        {isLoading ? (
          <ActivityIndicator color="#FFF" size={"small"} />
        ) : (
          <Text style={styles.buttonText}>Reintentar</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "85%",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: 10,
  },

  icon: {
    fontSize: 28,
  },

  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },

  subtitle: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#4C6EF5",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
