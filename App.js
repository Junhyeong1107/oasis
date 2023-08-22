import React from "react";
import { CommonActions, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TouchableOpacity, Image } from "react-native";

import DogScreen from "./screens/dog";
import MainScreen from "./screens/main";
import ComplainScreen from "./screens/complain";
import StoryScreen from "./screens/story";
import MyPageScreen from "./screens/MyPage/MyPageScreen";
import LoginScreen from "./screens/MyPage/LoginScreen";
import SignupScreen from "./screens/MyPage/SignupScreen";
import LoggedInMyPage from "./screens/MyPage/LoggedInMyPage";
import LoggedOutMyPage from "./screens/MyPage/LoggedOutMyPage";

import { AuthProvider, useAuth } from "./AuthContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const iconMapping = {
  홈: {
    focused: require("./assets/tabBar/홈_포커스.png"),
    unfocused: require("./assets/tabBar/홈.png"),
  },

  산책로: {
    focused: require("./assets/tabBar/산책로_포커스.png"),
    unfocused: require("./assets/tabBar/산책로.png"),
  },
  카메라: {
    focused: require("./assets/tabBar/카메라_포커스.png"),
    unfocused: require("./assets/tabBar/카메라.png"),
  },
  게시판: {
    focused: require("./assets/tabBar/게시판_포커스.png"),
    unfocused: require("./assets/tabBar/게시판.png"),
  },
  마이: {
    focused: require("./assets/tabBar/마이_포커스.png"),
    unfocused: require("./assets/tabBar/마이.png"),
  },
};

const TabBarIcon = ({ focused, iconName }) => {
  const iconInfo = iconMapping[iconName];
  const iconImage = focused ? iconInfo.focused : iconInfo.unfocused;

  return <Image source={iconImage} style={{ width: 25, height: 25 }} />;
};

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: "#8FBF4D",
          }}
        >
          <Tab.Screen
            name="공원"
            component={MainScreen}
            initialRouteName="Main"
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} iconName="홈" />
              ),
            }}
          />
          <Tab.Screen
            name="스토리"
            component={StoryScreen}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} iconName="카메라" />
              ),
            }}
          />
          <Tab.Screen
            name="키우기"
            component={DogScreen}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} iconName="산책로" />
              ),
            }}
          />
          <Tab.Screen
            name="민원"
            component={ComplainScreen}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} iconName="게시판" />
              ),
            }}
          />
          <Tab.Screen
            name="내 정보"
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} iconName="마이" />
              ),
            }}
          >
            {() => (
              <Stack.Navigator>
                <Stack.Screen
                  name="MyPage"
                  component={MyPageScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Login"
                  component={LoginScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Signup"
                  component={SignupScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="LoggedInMyPage"
                  component={LoggedInMyPage}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="LoggedOutMyPage"
                  component={LoggedOutMyPage}
                  options={{ headerShown: false }}
                />
              </Stack.Navigator>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
