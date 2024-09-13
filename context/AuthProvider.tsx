import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import Toast from "react-native-toast-message";

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (
    token: string,
    role: string,
    sub: string,
    Username: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  userRole: string | null;
  userSub: string | null;
  Username: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userSub, setUserSub] = useState<string | null>(null);
  const [Username, setUsername] = useState<string | null>(null);

  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const role = await AsyncStorage.getItem("user_role");
        const sub = await AsyncStorage.getItem("user_sub");
        const username = await AsyncStorage.getItem("Username");

        if (token && role && sub) {
          setIsLoggedIn(true);
          setUserRole(role);
          setUserSub(sub);
          setUsername(username);

        }
      } catch (error) {
        console.error("Failed to load auth data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);
  useEffect(() => {
    if (!navigationState?.key || isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isLoggedIn && inAuthGroup) {
      router.replace("/Home");
    } else if (!isLoggedIn && !inAuthGroup) {
      router.replace("/Login");
    }
  }, [isLoggedIn, segments, navigationState?.key, isLoading]);

  const login = async (
    token: string,
    role: string,
    sub: string,
    Username: string
  ) => {
    try {
      await AsyncStorage.setItem("access_token", token);
      await AsyncStorage.setItem("user_role", role);
      await AsyncStorage.setItem("user_sub", sub);
      await AsyncStorage.setItem("Username", Username || "");


      setIsLoggedIn(true);
      setUserRole(role);
      setUserSub(sub);
      setUsername(Username || "");

      Toast.show({
        type: "success",
        text1: "Logged in successfully!",
      });

      router.replace("/Home");
    } catch (error) {
      console.error("Failed to login:", error);
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: "Please try again",
      });
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("user_role");
      await AsyncStorage.removeItem("user_sub");
      await AsyncStorage.removeItem("Username");
      setIsLoggedIn(false);
      setUserRole(null);
      setUserSub(null);
      setUsername(null);
      router.replace("/Login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, userRole, userSub, Username }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
