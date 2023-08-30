import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { auth, createUser, db, collection, addDoc,doc ,setDoc} from "../../firebaseConfig";

import { useNavigation } from "@react-navigation/native";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [nickname, setNickname] = useState(""); // 추가된 부분

  const navigation = useNavigation();

  const handleSignup = async () => {
    try {
      const userCredential = await createUser(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        name: name,
        address: address,
        nickname: nickname, // 추가된 부분
        exp: 0,
      });
      // Additional actions on successful signup
      navigation.navigate("Main");
    } catch (error) {
      console.error("Signup Error", error);
      // Handle signup failure
    }
  };

  return (
    <View style={styles.container}>
      <Text>회원가입 화면</Text>
      <TextInput
        style={styles.input}
        placeholder="이메일"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="이름"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="닉네임" // 추가된 부분
        onChangeText={setNickname} // 추가된 부분
        value={nickname} // 추가된 부분
      />
      <TextInput
        style={styles.input}
        placeholder="주소"
        onChangeText={setAddress}
        value={address}
      />
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  signupButton: {
    backgroundColor: "blue",
    borderRadius: 5,
    width: "100%",
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
