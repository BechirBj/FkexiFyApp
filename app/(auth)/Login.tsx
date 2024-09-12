import {
  View,
  Image,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import { Private_api } from "../API/API";
import APIS from "../API/ENDPOINTS";
import { AxiosError } from "axios";
import { Link, router } from "expo-router";
import { storeRole, storeSub, storeToken } from "../storage/storage";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/AuthProvider";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await Private_api.post(APIS.LOGIN, form);
      if (response.status === 201) {
        console.log(response.data)
        const { access_token, role, sub ,Username} = response.data;

        await login(access_token, role,sub,Username);
      } else {
        Toast.show({
          type: "error",
          text1: "Unexpected status code",
          text2: `Status code: ${response.status}`,
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        Toast.show({
          type: "error",
          text1: "Login failed",
          text2:
            error.response?.data.message ||
            error.message ||
            "Something went wrong",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Unexpected error",
          text2: String(error),
        });
      }
    } finally {
      setIsLoading(false);
      
    }
  };

  return (
    <SafeAreaView className="flex-1 w-full bg-indigo-900">
      <ScrollView>
        <View className="flex-1 justify-center items-center">
          <Image
            source={images.logo}
            className="w-full h-[300px]"
            resizeMode="stretch"
          />
        </View>
        <View className="px-4 mb-8 mt-6">
          <Text className="text-white text-center text-xl font-bold">
            Welcome Back
          </Text>
          <Text className="text-gray-400 text-center text-sm mt-2">
            Login now and destroy the gym
          </Text>
        </View>
        <View className="px-4">
          <FormField
            title="Email"
            value={form.email}
            placeholder="Enter your email"
            handleChangeText={(email: string) => setForm({ ...form, email })}
          />
          <FormField
            title="Password"
            value={form.password}
            placeholder="Enter your password"
            handleChangeText={(password: string) =>
              setForm({ ...form, password })
            }
          />
        </View>
        <View className="flex justify-center mt-6">
          <CustomButton
            title="Se connecter"
            handlePress={handleLogin}
            isLoading={isLoading}
            containerStyles="bg-lime-300 rounded-2xl mb-4 mx-10"
            textStyles="text-lg"
          />
          <View className="flex-row gap-4 justify-center">
            <Text className="text-gray-200 text-base">New to FlexiFy?</Text>
            <TouchableOpacity>
              <Link href="/Register">
                <Text className="text-lime-300 text-base font-bold ml-2">
                  Register
                </Text>
              </Link>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
