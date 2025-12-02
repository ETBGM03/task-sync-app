import { useTaskStore } from "@/store/task-store";
import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export const OfflineBanner: React.FC = () => {
  const isOnline = useTaskStore((state) => state.isOnline);
  const translateY = useSharedValue(100);

  useEffect(() => {
    if (!isOnline) {
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 100,
      });
    } else {
      translateY.value = withTiming(100, { duration: 300 });
    }
  }, [isOnline, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.text}>
        📴 Offline Mode - Changes will sync when online
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FF9500",
    padding: 12,
    alignItems: "center",
    zIndex: 1000,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
