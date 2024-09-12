import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthProvider'; // Adjust the import path as needed
import { images } from '../../constants'; // Adjust the import path as needed
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Private_api } from '../API/API';
import APIS from '../API/ENDPOINTS';
import Toast from 'react-native-toast-message';

const Profile = () => {
  const { Username,  userRole, logout,userSub } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [editEmail, setEditEmail] = useState(  '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSaveProfile = async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      return;
    }
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    const form: Partial<{
      username: string;
      email: string;
      password: string;
      age: number;
    }> = {};
  
    if (name !== Username) form.username = name;
    if (editEmail ) form.email = editEmail;
    if (password) form.password = password;
    if (age) form.age = parseInt(age, 10);
  
    console.log(form);
    try {
      const response = await Private_api.patch(`${APIS.UPDATE_USER}/${userSub}`, form, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Profile updated successfully",
          text2: "Your changes have been saved",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Unexpected status code",
          text2: `Status code: ${response.status}`,
        });
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: "An error occurred while updating your profile",
      });
    }   
    setModalVisible(false);
    setPassword('');
    setConfirmPassword('');
    setPasswordsMatch(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="items-center p-5 bg-white shadow-md">
        <Image
          source={images.profile}
          className="w-24 h-24 rounded-full mb-3"
        />
        <Text className="text-2xl font-bold">{Username || 'User'}</Text>
        <Text className="text-base text-gray-600">{userRole}</Text>
      </View>

      <TouchableOpacity 
        className="flex-row items-center bg-blue-500 p-4 rounded-lg mx-5 my-2 shadow"
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="create-outline" size={24} color="white" />
        <Text className="text-white text-center font-bold ml-2">Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="flex-row items-center bg-blue-500 p-4 rounded-lg mx-5 my-2 shadow"
        onPress={() => {console.log('settings')}}
      >
        <Ionicons name="settings-outline" size={24} color="white" />
        <Text className="text-white text-center font-bold ml-2">Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="flex-row items-center bg-red-500 p-4 rounded-lg mx-5 my-2 shadow"
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text className="text-white text-center font-bold ml-2">Logout</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-2xl w-11/12 max-h-5/6">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-3xl font-bold mb-6 text-center">Edit Profile</Text>
              
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-semibold">Name</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
                  <Ionicons name="person-outline" size={24} color="gray" className="mr-2" />
                  <TextInput
                    className="flex-1 ml-2"
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-semibold">Email</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
                  <Ionicons name="mail-outline" size={24} color="gray" className="mr-2" />
                  <TextInput
                    className="flex-1 ml-2"
                    placeholder="Email"
                    value={editEmail}
                    onChangeText={setEditEmail}
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-semibold">New Password</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
                  <Ionicons name="lock-closed-outline" size={24} color="gray" className="mr-2" />
                  <TextInput
                    className="flex-1 ml-2"
                    placeholder="New Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-semibold">Confirm New Password</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
                  <Ionicons name="lock-closed-outline" size={24} color="gray" className="mr-2" />
                  <TextInput
                    className="flex-1 ml-2"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                </View>
              </View>

              {!passwordsMatch && (
                <Text className="text-red-500 mb-2">Passwords do not match</Text>
              )}

              <View className="mb-6">
                <Text className="text-gray-700 mb-2 font-semibold">Age</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
                  <Ionicons name="calendar-outline" size={24} color="gray" className="mr-2" />
                  <TextInput
                    className="flex-1 ml-2"
                    placeholder="Age"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <TouchableOpacity 
                className={`p-4 rounded-lg ${passwordsMatch ? 'bg-blue-500' : 'bg-gray-400'} shadow`}
                onPress={handleSaveProfile}
                disabled={!passwordsMatch}
              >
                <Text className="text-white text-center font-bold">Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="bg-gray-200 p-4 rounded-lg mt-3 shadow"
                onPress={() => {
                  setModalVisible(false);
                  setPassword('');
                  setConfirmPassword('');
                  setPasswordsMatch(true);
                }}
              >
                <Text className="text-gray-800 text-center font-bold">Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;