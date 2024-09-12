import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Private_api } from "../API/API";
import APIS from "../API/ENDPOINTS";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";

const Workout: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [savedWorkouts, setSavedWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [WorkoutTitle, setWorkoutTitle] = useState("");
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newWorkoutTitle, setNewWorkoutTitle] = useState("");

  const toggleExpand = () => setExpanded(!expanded);

  useEffect(() => {
    handleShowWorkouts();
  }, []);

  const handleShowWorkouts = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      const response = await Private_api.get(APIS.GET_ALL_WORKOUTS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setSavedWorkouts(response.data);
      } else {
        setError("Failed to fetch workouts");
      }
    } catch (error) {
      setError("Error fetching data");
      console.error("Error fetching data:", error);
    }
  };

  const handleAddWorkout = async () => {
    if (!WorkoutTitle) {
      Toast.show({
        text1: "Please enter a workout title",
        type: "error",
      });
      return;
    }
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      setError("No token found");
      return;
    }
    const TX = {
      name: WorkoutTitle,
    };
    try {
      const response = await Private_api.post(APIS.ADD_WORKOUT, TX, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        setModalVisible(false);
        handleShowWorkouts();
        Toast.show({
          text1: "Workout added successfully",
          type: "success",
        });
      } else {
        setError("Failed to create Workout");
      }
    } catch (error) {
      setError("Failed to create workout");
      console.error("Error creating workout:", error);
    }
  };

  const handleDelete = async (WorkoutId: string) => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      const response = await Private_api.delete(
        `${APIS.DELETE_WORKOUT}/${WorkoutId}`
      );
      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Workout deleted successfully",
        });
        setActionModalVisible(false);
        handleShowWorkouts();
      }
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  const handleLongPress = (workout: any) => {
    setSelectedWorkout(workout);
    setActionModalVisible(true);
  };

  const handleEdit = async (workoutId: string, newTitle: string) => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      setError("No token found");
      return;
    }
    try {
      const response = await Private_api.put(
        `${APIS.UPDATE_WORKOUT}/${workoutId}`,
        { name: newTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Workout updated successfully",
        });
        setIsEditing(false);
        setActionModalVisible(false);
        handleShowWorkouts();
      } else {
        setError("Failed to update workout");
      }
    } catch (error) {
      setError("Failed to update workout");
      console.error("Error updating workout:", error);
    }
  };

  const handlePress = (item: any) => {  
    router.push({
      pathname: "/screens/Exercise",
      params: {
        workout: JSON.stringify(item), 
      },
    });
  };
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView className="flex-1 bg-teal-100 px-4 py-6">
        <View className="flex-row items-center justify-center mb-4 mt-6">
          <View className="flex-1 items-center justify-center">
            <Text className="text-2xl text-black font-bold items-start mb-4">
              Fast Search
            </Text>
            <View className="flex-1 flex-row justify-center items-center">
              <TextInput
                className="border border-gray-300 rounded-full p-2 w-3/4 bg-white"
                placeholder="Search workouts..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Ionicons
                name="search"
                size={24}
                color="gray"
                style={{ marginLeft: 8 }}
              />
            </View>
          </View>
        </View>
        <View className="flex gap-5">
          <Text className="text-2xl text-gray-800 font-bold items-start">
            Start Your Workout Now
          </Text>
          <View className="flex-row justify-between mb-4">
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                className="flex-1 justify-center items-center"
              >
                <View className="bg-white rounded-lg p-4 w-4/5 items-center">
                  <TextInput
                    className="border border-gray-400 rounded-md p-2 w-full mb-4"
                    placeholder="Workout Title"
                    value={WorkoutTitle}
                    onChangeText={setWorkoutTitle}
                  />
                  <View className="items-center mb-4">
                    <Ionicons name="barbell" size={50} color="teal" />
                    <Text className="text-gray-600 mt-2 text-center">
                      Add exercises to your workout
                    </Text>
                  </View>
                  <View className="flex gap-6">
                    <TouchableOpacity
                      className="bg-teal-500 p-3 rounded-lg items-center"
                      onPress={handleAddWorkout}
                    >
                      <View className="flex-row content-center items-center gap-3">
                        <Ionicons name="add" size={24} color="white" />
                        <Text className="text-white text-lg font-semibold">
                          Add Workout
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-red-500 p-3 rounded-lg items-center"
                      onPress={() => setModalVisible(false)}
                    >
                      <View className="flex-row content-center items-center gap-3">
                        <Ionicons name="exit" size={24} color="white" />
                        <Text className="text-white text-lg font-semibold">
                          Cancel
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            <TouchableOpacity
              className="flex-1 bg-teal-600 p-4 rounded-xl items-center shadow-lg"
              onPress={() => setModalVisible(true)}
            >
              <View className="flex-row gap-2 items-center justify-center">
                <Ionicons
                  name="barbell"
                  size={24}
                  color="white"
                  style={{ marginLeft: 8 }}
                />
                <Text className="text-white text-lg font-semibold">
                  New workout
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-teal-600 p-4 rounded-xl items-center shadow-lg ml-2"
              onPress={() => console.log("Explore Workouts")}
            >
              <View className="flex-row gap-2 items-center justify-center">
                <Ionicons
                  name="search"
                  size={24}
                  color="white"
                  style={{ marginLeft: 8 }}
                />
                <Text className="text-white text-lg font-semibold">
                  Explore
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View className="bg-white rounded-lg shadow-md p-4 mb-6 mt-2">
          <TouchableOpacity
            className="flex-row justify-between items-center"
            onPress={toggleExpand}
          >
            <View className="flex-row  items-center gap-1">
              <Text className="text-xl font-semibold text-gray-800">
                Your Saved Workouts
              </Text>
              <Text className="text-xs font-black text-gray-400">
                ({savedWorkouts.length})
              </Text>
            </View>
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator size="large" color="teal" />
          ) : error ? (
            <Text className="text-red-500">{error}</Text>
          ) : (
            expanded && (
              <FlatList
                className="mt-3"
                data={savedWorkouts.filter((workout) =>
                  workout.name.toLowerCase().includes(searchQuery.toLowerCase())
                )}
                renderItem={({ item }) => (
                  <View className="mb-2 p-3 border rounded-md bg-white shadow-sm">
                    <TouchableOpacity
                      onPress={() => handlePress(item)}
                      onLongPress={() => handleLongPress(item)}
                    >
                      <Text className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  <Text className="text-gray-500 text-center">
                    No saved workouts
                  </Text>
                }
              />
            )
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={actionModalVisible}
        onRequestClose={() => setActionModalVisible(false)}
      >
        <View
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          className="flex-1 justify-center items-center"
        >
          <View className="bg-white rounded-lg p-4 w-4/5 items-center">
            <Text className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Workout Title" : "Make some changes ?"}
            </Text>

            {isEditing ? (
              <>
                <TextInput
                  className="border border-gray-400 rounded-md p-2 w-full mb-4"
                  placeholder="New workout title"
                  value={newWorkoutTitle}
                  onChangeText={setNewWorkoutTitle}
                />
                <View className="flex-row justify-around w-full">
                  <TouchableOpacity
                    className="bg-teal-500 p-3 rounded-lg items-center flex-1 mr-2"
                    onPress={() => {
                      if (selectedWorkout && newWorkoutTitle) {
                        handleEdit(selectedWorkout.id, newWorkoutTitle);
                      }
                    }}
                  >
                    <Text className="text-white text-lg font-semibold">
                      Save
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-gray-500 p-3 rounded-lg items-center flex-1 ml-2"
                    onPress={() => {
                      setIsEditing(false);
                      setActionModalVisible(false);
                    }}
                  >
                    <Text className="text-white text-lg font-semibold">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View className="flex-row justify-around w-full">
                <TouchableOpacity
                  className="bg-red-500 p-3 rounded-lg items-center flex-1 mr-2"
                  onPress={() => {
                    if (selectedWorkout) {
                      handleDelete(selectedWorkout.id);
                    }
                  }}
                >
                  <Text className="text-white text-lg font-semibold">
                    Delete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-blue-500 p-3 rounded-lg items-center flex-1 mr-2"
                  onPress={() => setIsEditing(true)}
                >
                  <Text className="text-white text-lg font-semibold">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-gray-500 p-3 rounded-lg items-center flex-1 ml-2"
                  onPress={() => setActionModalVisible(false)}
                >
                  <Text className="text-white text-lg font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

export default Workout;
