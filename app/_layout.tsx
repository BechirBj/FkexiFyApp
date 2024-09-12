import { View, StatusBar } from "react-native";
import React from "react";
import { Slot, Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { AuthProvider } from "../context/AuthProvider";
import { SafeAreaProvider } from 'react-native-safe-area-context';

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <StatusBar translucent backgroundColor="transparent" />
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="screens/Exercise" />
            <Stack.Screen name="screens/Sets" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </AuthProvider>
        <Toast />
      </View>
    </SafeAreaProvider>
  );
};

export default RootLayout;