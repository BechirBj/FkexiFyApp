import {
  Button,
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Text,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Private_api } from "../API/API";
import APIS from "../API/ENDPOINTS";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface Workout {
  id: string;
  name: string;
  owner: {
    id: string;
    username: string;
    email: string;
    age: number;
    roles: string[];
  };
}

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
}

const Exercise: React.FC = () => {
  const [exercises, setExercises] = useState<ExList[]>([]);
  const [exList, setExList] = useState<ExList[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<ExList[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [Sets, setSets] = useState<Set[]>([]);
  const { workout } = useLocalSearchParams();
  let workoutObject: Workout | null = null;
  if (typeof workout === "string") {
    try {
      workoutObject = JSON.parse(workout) as Workout;
    } catch (error) {
      console.error("Error parsing workout object:", error);
    }
  }

  const filteredExList = exList.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderExerciseItem = ({ item }: { item: ExList }) => {
    return (
      <TouchableOpacity
        className="p-4 rounded-lg mb-4 border border-gray-300 bg-white shadow-lg"
        onPress={() => {
          if (item) {
            router.push({
              pathname: "/screens/Sets",
              params: {
                item: JSON.stringify(item),
              },
            });
          } else {
            console.error("Item is null");
          }
        }}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-lg font-semibold text-gray-800">
              {item.name}
            </Text>
            <Text className="text-sm text-gray-500">{item.muscle}</Text>
          </View>
          <TouchableOpacity onPress={() => DeleteExercise(item.id)}>
            <Ionicons name="remove-circle" size={28} color="red" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const DeleteExercise = async (workoutId: string) => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      await Private_api.delete(`${APIS.DELETE_EXERCISE}/${workoutId}`);
      showExercisesFromAPI(workoutObject?.id || "");
      Toast.show({
        text1: "Exercise deleted successfully",
        type: "success",
      });
    } catch (error) {
      setError("Failed to delete exercise");
      console.error("Error deleting exercise:", error);
    }
  };

  const toggleSelect = (item: ExList) => {
    setSelectedExercises((prevSelected) => {
      const isSelected = prevSelected.some(
        (exercise) => exercise.id === item.id
      );
      if (isSelected) {
        return prevSelected.filter((exercise) => exercise.id !== item.id);
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const showExercisesFromAPI = async (workoutId: string) => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      const response = await Private_api.get(
        `${APIS.GET_EXERCISES}/${workoutId}`
      );
      if (response.status === 200) {
        setExercises(response.data);
      } else {
        setError("Failed to fetch data");
      }
    } catch (error) {
      setError("Error fetching data");
      console.error("Error fetching data:", error);
    }
  };

  const handleShowExercisesList = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      const response = await Private_api.get(APIS.GET_EXLIST);
      if (response.status === 200) {
        setExList(response.data);
      } else {
        setError("Failed to fetch data");
      }
    } catch (error) {
      setError("Error fetching data");
      console.error("Error fetching data:", error);
    }
  };

  const handleAddExercises = async (workoutId: string) => {
    const token = await AsyncStorage.getItem("access_token");

    if (!token) {
      setError("No token found");
      return;
    }
    const List = selectedExercises.map((exercise) => ({
      name: exercise.name,
      muscle: exercise.muscle,
    }));
    for (const exercise of List) {
      try {
        const response = await Private_api.post(
          `${APIS.ADD_EXERCISE}/${workoutId}`,
          {
            name: exercise.name,
            muscle: exercise.muscle,
          }
        );
        if (response.status === 201) {
          Toast.show({
            text1: "Exercises added successfully",
            type: "success",
          });
        }
      } catch (error) {
        setError("Failed to create workout");
        Toast.show({
          text1: "Failed to add exercises",
          type: "error",
        });
      }
    }
  };

  const toggleModal = () => {
    handleShowExercisesList();
    setModalVisible(!modalVisible);
    setSearchText("");
  };

  useEffect(() => {
    if (workoutObject?.id) {
      showExercisesFromAPI(workoutObject.id);
    }
  }, [workoutObject]);

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setTime(0);
    setIsTimerRunning(false);
  };

  return (
    <SafeAreaView className="flex-1  px-4 mt-6">
      <View>
        <Text className="text-2xl font-bold my-4">
          Add Exercises to "{workoutObject?.name ?? "Workout"}"
        </Text>
      </View>
      <View className="bg-gray-200 p-4 rounded-lg mb-4">
        <Text className="text-3xl font-bold text-center">{formatTime(time)}</Text>
        <View className="flex-row justify-center mt-2">
          <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-lg mr-2"
            onPress={toggleTimer}
          >
            <Text className="text-white font-bold">
              {isTimerRunning ? "Pause" : "Start"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 px-4 py-2 rounded-lg"
            onPress={resetTimer}
          >
            <Text className="text-white font-bold">Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseItem}
        className="flex-1"
      />

      <View className="mt-4 mb-6">
        <Button title="Add Exercises" onPress={toggleModal} color="#FFA001" />
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <SafeAreaView className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-11/12 max-h-[80%]">
            <Text className="text-xl font-bold mb-4">
              Review Selected Exercises
            </Text>
            <TextInput
              className="h-12 border border-gray-300 rounded-lg px-3 mb-4"
              placeholder="Search exercises..."
              value={searchText}
              onChangeText={setSearchText}
            />

            <FlatList
              data={filteredExList} 
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedExercises.some(
                  (exercise) => exercise.id === item.id
                );
                return (
                  <TouchableOpacity
                    className={`p-4 rounded-lg mb-3 border ${
                      isSelected
                        ? "bg-blue-100 border-blue-500"
                        : "bg-white border-gray-300"
                    }`}
                    onPress={() => toggleSelect(item)}
                  >
                    <Text className="text-lg font-semibold">{item.name}</Text>
                    <Text className="text-sm text-gray-500">{item.muscle}</Text>
                  </TouchableOpacity>
                );
              }}
            />
            <View className="flex-row justify-between mt-4">
              <Button color="#FF6347" title="Cancel" onPress={toggleModal} />
              <Button
                color="#00FF00"
                title="Save"
                onPress={() => {
                  if (workoutObject?.id) {
                    handleAddExercises(workoutObject.id);
                    toggleModal();
                  } else {
                    console.error("Workout ID is not available");
                  }
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};
export default Exercise;
