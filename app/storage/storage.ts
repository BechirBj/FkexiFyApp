import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('@access_token', token);
  } catch (error) {
    console.error('Failed to store token:', error);
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@access_token');
    return token;
  } catch (error) {
    console.error('Failed to retrieve token:', error);
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('@access_token');
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

// Similar functions for role and sub
export const storeRole = async (role: string) => {
  try {
    await AsyncStorage.setItem('@role', role);
  } catch (error) {
    console.error('Failed to store role:', error);
  }
};

export const getRole = async () => {
  try {
    const role = await AsyncStorage.getItem('@role');
    return role;
  } catch (error) {
    console.error('Failed to retrieve role:', error);
  }
};

export const removeRole = async () => {
  try {
    await AsyncStorage.removeItem('@role');
  } catch (error) {
    console.error('Failed to remove role:', error);
  }
};

export const storeSub = async (sub: string) => {
  try {
    await AsyncStorage.setItem('@sub', sub);
  } catch (error) {
    console.error('Failed to store sub:', error);
  }
};

export const getSub = async () => {
  try {
    const sub = await AsyncStorage.getItem('@sub');
    return sub;
  } catch (error) {
    console.error('Failed to retrieve sub:', error);
  }
};

export const removeSub = async () => {
  try {
    await AsyncStorage.removeItem('@sub');
  } catch (error) {
    console.error('Failed to remove sub:', error);
  }
};
