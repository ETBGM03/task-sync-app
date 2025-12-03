import React, { ComponentType } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

export interface ButtonAccessoryProps {
  style: StyleProp<any>;
}

export interface ButtonProps extends PressableProps {
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string;
  /**
   * an optional prop to disable buttons.
   */
  disabled?: boolean;
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * An optional style override for the "pressed" state.
   */
  pressedStyle?: StyleProp<ViewStyle>;
  /**
   * An optional style override for the button text.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * An optional style override for the button text when in the "pressed" state.
   */
  pressedTextStyle?: StyleProp<TextStyle>;
  /**
   * An optional component to render on the right side of the text.
   * Example: `RightAccessory={(props) => <View {...props} />}`
   */
  RightAccessory?: ComponentType<ButtonAccessoryProps>;
  /**
   * An optional component to render on the left side of the text.
   * Example: `LeftAccessory={(props) => <View {...props} />}`
   */
  LeftAccessory?: ComponentType<ButtonAccessoryProps>;
  /**
   * Children components.
   */
  children?: React.ReactNode;
}

export function Button(props: ButtonProps) {
  const { LeftAccessory, RightAccessory, disabled, text, children, ...rest } =
    props;

  return (
    <Pressable accessibilityRole="button" disabled={disabled} {...rest}>
      {!!LeftAccessory && <LeftAccessory style={{}} />}

      <Text style={styles.buttonText}>{children}</Text>

      {!!RightAccessory && <RightAccessory style={{}} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
