import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Home: React.FC = () => {
  const navigation = useNavigation();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    fetchWorkouts();
    // fetchQuote();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch(
        "https://wger.de/api/v2/exercise/?language=2&limit=5"
      );
      const data = await response.json();
      setWorkouts(data.results);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchQuote = async () => {
  //   const API_KEY = process.env.API_KEY;
  //   try {
  //     const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=fitness', {
  //       headers: {
  //         'X-Api-Key': API_KEY,
  //       },
  //     });
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }  
  //     const data = await response.json();
  //     setQuote(data[0].quote); 
  //   } catch (error) {
  //     console.error('Error fetching quote:', error);
  //     setQuote("The only bad workout is the one that didn’t happen.");
  //   }
  // };
  
  return (
    <ScrollView className="flex-1 bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-6">
      <WelcomeSection />
      <QuickActions navigation={navigation} />
      <FeaturedWorkouts
        workouts={workouts}
        loading={loading}
        navigation={navigation}
      />
      <MotivationalSection quote={quote} />
    </ScrollView>
  );
};

const WelcomeSection: React.FC = () => {
  return (
    <View className="mt-6 mb-6">
      <Text className="text-2xl font-bold text-gray-800">
        Welcome back, King!
      </Text>
      <Text className="text-lg text-gray-600 mt-2">
        Ready for your next workout?
      </Text>
    </View>
  );
};

interface QuickActionsProps {
  navigation: any;
}

const QuickActions: React.FC<QuickActionsProps> = ({ navigation }) => {
  return (
    <View className="mb-6 flex-row justify-between">
      <TouchableOpacity
        className="flex-1 bg-teal-600 p-4 mr-2 rounded-xl items-center justify-center shadow-lg"
        onPress={() => navigation.navigate("Workout")}
      >
        <Ionicons name="barbell" size={24} color="white" />
        <Text className="text-white text-lg font-semibold mt-2">
          Start Workout
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 bg-teal-600 p-4 ml-2 rounded-xl items-center justify-center shadow-lg"
        onPress={() => navigation.navigate("Progress")}
      >
        <Ionicons name="stats-chart" size={24} color="white" />
        <Text className="text-white text-lg font-semibold mt-2">
          View Progress
        </Text>
      </TouchableOpacity>
    </View>
  );
};

interface FeaturedWorkoutsProps {
  workouts: any[];
  loading: boolean;
  navigation: any;
}

const FeaturedWorkouts: React.FC<FeaturedWorkoutsProps> = ({
  workouts,
  loading,
  navigation,
}) => {
  return (
    <View>
      <Text className="text-xl font-bold text-gray-800 mb-4">
        Featured Workouts
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <WorkoutCard workout={item} navigation={navigation} />
          )}
        />
      )}
    </View>
  );
};

const WorkoutCard: React.FC<{ workout: any; navigation: any }> = ({
  workout,
  navigation,
}) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-lg p-4 mr-4 w-64"
      onPress={() => navigation.navigate("WorkoutDetails", { workout })}
    >
      <Text className="text-lg font-semibold text-gray-800 mb-2">
        {workout.name}
      </Text>
      <Text className="text-gray-600 mb-4" numberOfLines={3}>
        {workout.description.replace(/(<([^>]+)>)/gi, "")}
      </Text>
      <View className="mt-auto flex-row justify-between items-center">
        <Text className="text-blue-500 font-semibold">View Details</Text>
        <Ionicons name="chevron-forward-outline" size={20} color="#3b82f6" />
      </View>
    </TouchableOpacity>
  );
};

interface MotivationalSectionProps {
  quote: string;
}

const MotivationalSection: React.FC<MotivationalSectionProps> = ({ quote }) => {
  return (
    <View className="mt-6 bg-white rounded-xl shadow-lg p-4">
      <Text className="text-lg font-semibold text-gray-800 mb-2">
        Motivational Quote
      </Text>
      <Text className="text-gray-600 text-base ">{quote}</Text>
    </View>
  );
};

export default Home;
