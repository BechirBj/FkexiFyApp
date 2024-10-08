import React, { useState, useEffect } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Text,
  ScrollView,
  Button,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Private_api } from "../API/API";
import APIS from "../API/ENDPOINTS";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

interface ExList {
  id: string;
  name: string;
  muscle: string;
}

interface Set {
  id?: string;
  serie: number;
  reps: number;
  kg: number;
  completed?: boolean; 
}

const Sets: React.FC = () => {
  const [sets, setSets] = useState<Set[]>([]);
  const [loading, setLoading] = useState(true);

  const { item } = useLocalSearchParams();
  let Exercise: ExList | null = null;
  if (typeof item === "string") {
    try {
      Exercise = JSON.parse(item) as ExList;
    } catch (error) {
      console.error("Error parsing Exercise object:", error);
    }
  }

  useEffect(() => {
    if (Exercise) {
      handleShowSets(Exercise.id);
    }
  }, []);

  const handleShowSets = async (ExerciseId: string) => {
    setLoading(true);
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      Toast.show({
        text1: "No token found",
        type: "error",
      });
      setLoading(false);
      return;
    }
    try {
      const response = await Private_api.get(
        `/sets/GetByExerciseId/${ExerciseId}`
      );
      if (response.status === 200) {
        const setsData = response.data.map((set: any) => ({
          id: set.id,
          serie: set.serie || 1,
          reps: set.reps || 0,
          kg: set.kg || 0,
        }));
        setsData.sort((a: Set, b: Set) => a.serie - b.serie);
        setSets(setsData);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setSets([]);
    } finally {
      setLoading(false);
    }
  };

  const addSet = () => {
    setSets((prevSets) => {
      const nextSerie = prevSets.length > 0 
        ? Math.max(...prevSets.map(set => set.serie)) + 1 
        : 1;
      const newSet = {
        serie: nextSerie,
        reps: 0,
        kg: 0,
      };
      return [...prevSets, newSet].sort((a, b) => a.serie - b.serie);
    });
  };

  const updateSetValue = (
    index: number,
    field: "reps" | "kg",
    value: string
  ) => {
    setSets((prevSets) =>
      prevSets.map((set, i) =>
        i === index ? { ...set, [field]: parseInt(value) || 0 } : set
      )
    );
  };

  const handleDeleteSet = async (index: number) => {
    const setToDelete = sets[index];
    if (setToDelete.id) {
      try {
        const response = await Private_api.delete(
          `${APIS.REMOVE_SET}/${setToDelete.id}`
        );
        if (response.status === 200 || response.status === 204) {
          Toast.show({
            text1: "Set deleted successfully!",
            type: "success",
          });
        } else {
          throw new Error("Failed to delete set");
        }
      } catch (error) {
        console.error("Failed to delete set:", error);
        Toast.show({
          text1: "Can't delete set",
          type: "error",
        });
        return;
      }
    }
    setSets((prevSets) => {
      const updatedSets = prevSets.filter((_, i) => i !== index);
      return updatedSets.map((set, i) => ({
        ...set,
        serie: i + 1,
      }));
    });  };

  const handleSaveSets = async () => {
    if (!Exercise?.id) {
      Toast.show({
        text1: "No Exercise ID found",
        type: "error",
      });
      return;
    }
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      Toast.show({
        text1: "No token found",
        type: "error",
      });
      return;
    }
    try {
      const updatedSets = await Promise.all(
        sets.map(async (set) => {
          if (set.id) {
            const response = await Private_api.put(
              `${APIS.UPDATE_SET}/${set.id}`,
              {
                serie: set.serie,
                kg: set.kg,
                reps: set.reps,
              }
            );
            if (response.status === 200) {
              return response.data;
            }
          } else {
            const response = await Private_api.post(
              `${APIS.ADD_SET}/${Exercise.id}`,
              {
                serie: set.serie,
                kg: set.kg,
                reps: set.reps,
              }
            );
            if (response.status === 201) {
              return response.data;
            }
          }
          throw new Error("Set operation failed");
        })
      );
      setSets(updatedSets.sort((a, b) => a.serie - b.serie));
      Toast.show({
        text1: "Sets saved successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to save sets:", error);
      Toast.show({
        text1: "Failed to save sets",
        type: "error",
      });
    }
  };

  const toggleSetCompletion = (index: number) => {
    setSets((prevSets) =>
      prevSets.map((set, i) =>
        i === index ? { ...set, completed: !set.completed } : set
      )
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 mt-6 ">
      <ScrollView className="flex-1 px-4 pt-4 ">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">{Exercise?.name}</Text>
          <View className="flex-row gap-3">

          <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-lg"
            onPress={handleSaveSets}
          >
            <Text className="text-white font-semibold">Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=" px-4 py-2 rounded-lg"
            // onPress={handleSaveSets}
          >
            <Ionicons
            name="timer-sharp"
            size={28}
            color="black"
            />
          </TouchableOpacity>
          </View>

        </View>
        <View className="flex-row mb-4 bg-gray-200 p-3 rounded-lg">
          <Text className="flex-1 font-bold text-gray-600 text-center">
            <Ionicons
              name="checkmark-done"
              color="#4A5568"
              size={20}
            />
          </Text>
          <Text className="flex-1 font-bold text-gray-600 text-center">SETS</Text>
          <Text className="flex-1 font-bold text-gray-600 text-center">KG</Text>
          <Text className="flex-1 font-bold text-gray-600 text-center">REPS</Text>
          <Text className="flex-1 font-bold text-gray-600 text-center">
            <Ionicons
              name="trash-bin"
              color="#4A5568"
              size={20}
            />
          </Text>
        </View>
        {sets.map((set, index) => (
          <View key={set.id || index} className={`flex-row mb-3 items-center ${set.completed ? 'bg-green-200' : 'bg-white'} rounded-lg p-3 shadow-sm`}>
            <TouchableOpacity onPress={() => toggleSetCompletion(index)} className="flex-1 items-center">
              <Ionicons 
                name={set.completed ? "checkmark-circle" : "checkmark-circle-outline"} 
                color={set.completed ? "#48BB78" : "#A0AEC0"}
                size={28}
              />
            </TouchableOpacity>
            <Text className="flex-1 text-center font-semibold text-gray-700">{set.serie}</Text>
            <TextInput
              className="flex-1 border-b border-gray-300 text-center text-gray-700 px-2 py-1"
              keyboardType="numeric"
              onChangeText={(value) => updateSetValue(index, "kg", value)}
              value={set.kg.toString()}
            />
            <TextInput
              className="flex-1 border-b border-gray-300 text-center text-gray-700 px-2 py-1"
              keyboardType="numeric"
              onChangeText={(value) => updateSetValue(index, "reps", value)}
              value={set.reps.toString()}
            />
            <TouchableOpacity onPress={() => handleDeleteSet(index)} className="flex-1 items-center">
              <Ionicons name="trash" size={24} color="#E53E3E" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-lg mt-6 mb-8"
          onPress={addSet}
        >
          <Text className="text-white text-center font-semibold">+ Add Set</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Sets;