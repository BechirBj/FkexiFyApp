import {
  Image,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { images } from "../../constants";
import { AxiosError } from "axios";
import Toast from "react-native-toast-message";
import { Private_api } from "../API/API";
import APIS from "../API/ENDPOINTS";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    
    setIsLoading(true);
    try {
      const response = await Private_api.post(APIS.REGISTER, form);
      if (response.status === 201) {
        Toast.show({
          type: "success",
          text1: "Registration successful",
          text2: "You can now log in",
        });
        router.replace("/Login");
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
            JOIN NOW
          </Text>
          <Text className="text-gray-400 text-center text-sm mt-2">
            Register and be one of the family members
          </Text>
        </View>
        <View className="px-4">
          <FormField
            title="Username"
            value={form.username}
            placeholder="Enter your username"
            handleChangeText={(username: string) =>
              setForm({ ...form, username })
            }
          />
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
          <FormField
            title="Age"
            value={form.age}
            placeholder="Enter your Age"
            handleChangeText={(age: string) => setForm({ ...form, age })}
          />
        </View>
        <View className="flex justify-center mt-6">
          <CustomButton
            title="Se connecter"
            handlePress={handleRegister}
            isLoading={isLoading}
            containerStyles="bg-lime-300 rounded-2xl mb-4 mx-10"
            textStyles="text-lg"
          />
          <View className="flex-row gap-4 justify-center">
            <Text className="text-gray-200 text-base">Already a member ?</Text>
            <TouchableOpacity>
              <Link href="/Login">
                <Text className="text-lime-300 text-base font-bold ml-2">
                  Login now
                </Text>
              </Link>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;
