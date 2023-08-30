import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { storage, storef, uploadImage, saveButtonText,saveImageDataToFirestore,getDownloadURL } from "../../firebaseConfig";

import { useNavigation } from "@react-navigation/native";

const UploadScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeButtons, setActiveButtons] = useState([]); // Track the active button
  const navigation = useNavigation();

  const handleButtonClick = async () => {
    Alert.alert(
      "이미지 선택",
      "카메라로 사진을 찍을지 갤러리에서 사진을 선택할지 선택해주세요.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "카메라",
          onPress: () => launchCamera(),
        },
        {
          text: "갤러리",
          onPress: () => launchImageLibrary(),
        },
      ]
    );
  };

  const handletextButtonClick = (buttonText) => {
    if (activeButtons.includes(buttonText)) {
      setActiveButtons(activeButtons.filter((btn) => btn !== buttonText));
    } else {
      setActiveButtons([...activeButtons, buttonText]);
    }

  };




  const uploadImageToFirebase = async () => {
    try {
      if (!selectedImage) {
        Alert.alert("Error", "이미지를 선택해주세요.");
        return;
      }

      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const imageName = new Date().getTime().toString();
      const storageRef = await uploadImage(blob, imageName);

      const downloadURL = await getDownloadURL(storageRef); 
   
      await saveImageDataToFirestore(downloadURL, activeButtons); 

      setSelectedImage(null);
      setActiveButtons(null); // Reset active button

      Alert.alert("Success", "이미지 업로드가 완료되었습니다.");
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  const launchCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setSelectedImage(result.uri);
    }
  };

  const launchImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false, // Only allow selecting one image
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };



  return (
    <View>
      <TouchableOpacity onPress={handleButtonClick}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />
        ) : (
          <Text>이미지 선택</Text>
        )}
        </TouchableOpacity>
      <TouchableOpacity onPress={() => handletextButtonClick("가")}>
        <Text style={activeButtons === "가" ? styles.activeButtonText : styles.buttonText}>가</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handletextButtonClick("나")}>
        <Text style={activeButtons === "나" ? styles.activeButtonText : styles.buttonText}>나</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handletextButtonClick("다")}>
        <Text style={activeButtons === "다" ? styles.activeButtonText : styles.buttonText}>다</Text>
      </TouchableOpacity>
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity onPress={uploadImageToFirebase}>
          <Text>이미지 업로드</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = {
  buttonText: {
    fontSize: 16,
    fontWeight: "normal",
  },
  activeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "blue", // Customize the active button style
  },
};

export default UploadScreen;
