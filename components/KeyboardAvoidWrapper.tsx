import React from "react";
import { KeyboardAvoidingView, Keyboard, Pressable, Platform, ScrollView, StyleSheet} from "react-native";
import { IProps } from "../auth-app";

const KeyboardAvoidWrapper: React.FC<IProps> = ({ children }) => {
  return (
    <KeyboardAvoidingView
      style={styles.settheKeyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={60}
    >
      <ScrollView style={styles.setScrollView} showsVerticalScrollIndicator={false}>
        <Pressable onPress={Keyboard.dismiss}>{children}</Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  settheKeyboardView: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  setScrollView: {
    flex: 1,
  }
})

export default KeyboardAvoidWrapper;
