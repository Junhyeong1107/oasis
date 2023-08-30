import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { auth, signin,doc,db,getDoc } from "../../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import LoginImage from "../../assets/logo_img.png"; // 이미지 경로 수정
import { CommonActions } from "@react-navigation/native";

import { useAuth } from "../../AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation();

  const { handleLoggedin } = useAuth(); // AuthContext에 사용자 정보 저장

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signin(auth, email, password);
      const user = userCredential.user;
  
      // 사용자의 UID로 Firestore에서 사용자 정보를 가져오기
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const nickname = userData.nickname;
  
        handleLoggedin(user.email,nickname,user.uid);
  
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Main" }],
          })
        );
      } else {
        Alert.alert("User Not Found", "사용자 정보를 찾을 수 없습니다.");
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>도시 속 공원찾기 앱</Text>
        <Image source={LoginImage} style={styles.logoImage} />
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            onChangeText={setEmail}
            value={email}
          />
        </View>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomLinkContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={[styles.bottomLink, styles.greenText]}>회원가입</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.spacer} />
        <View style={styles.bottomLinkContainer}>
          <Text style={[styles.bottomLink, styles.greenText]}>
            아이디/비밀번호 찾기
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: -270,
    backgroundColor: "white",
  },
  logoContainer: {
    alignItems: "center",
  },
  logoText: {
    fontSize: 17,
    color: "#B0C1B0", // 변경된 색깔
    marginBottom: -40,
  },
  logoImage: {
    width: 380,
    height: 150,
    marginBottom: -25,
    // 이미지 스타일 추가 (예: resizeMode, borderRadius 등)
  },
  inputContainer: {
    width: "100%",
    alignItems: "center", // 가로 가운데 정렬
  },
  inputWrapper: {
    marginBottom: 15,
    borderWidth: 0.8,
    borderColor: "#8FBF4D", // 테두리 색깔
    borderRadius: 5, // 모서리 둥글게
    width: 320,
    height: 47,
    justifyContent: "center", // 세로 가운데 정렬
    paddingHorizontal: 10,
  },
  input: {
    flex: 1, // 자식 TextInput이 부모 크기를 차지하도록
  },
  loginButton: {
    backgroundColor: "#8FBF4D", // 버튼 배경색
    borderRadius: 5,
    width: 320,
    height: 47,
    justifyContent: "center", // 세로 가운데 정렬
    alignItems: "center", // 가로 가운데 정렬
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center", // 수직 가운데 정렬
    marginTop: 20,
  },
  bottomLinkContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // 왼쪽 정렬
    marginLeft: 27,
  },
  bottomLink: {
    fontSize: 14,
    color: "#487548", // 변경된 색깔
  },
  greenText: {
    color: "#487548", // 변경된 색깔
  },
  spacer: {
    width: 20, // 간격 설정
  },
});
