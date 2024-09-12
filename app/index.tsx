import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { router, Redirect } from "expo-router";
import React from "react";
import { AuthProvider } from "../context/AuthProvider";

export default function App() {

  return (
    <SafeAreaView className="bg-red-300 h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
        >
        <View className="w-full flex justify-center items-center min-h-[84vh] px-4">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
            />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
            />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Track Your workout {"\n"}
              Possibilities with{" "}
              <Text className="text-lightYellow">Flexify</Text>
            </Text>
            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
              />
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where creativity meets innovation: embark on a Journey of limitless
            Workout
          </Text>
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/Login")}
            containerStyles="w-full mt-7"
            />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
