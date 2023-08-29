import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  storage,
  ref,
  uploadImage,
  saveButtonText,
  getButtonTexts,
} from "../../firebaseConfig";

import { useNavigation } from "@react-navigation/native";

const UploadScreen = () => {
  const [selectedImages, setSelectedImages] = useState(["", "", ""]);
  const [buttonTexts, setButtonTexts] = useState(["", "", "", "", ""]);
  const navigation = useNavigation();

  useEffect(() => {
    loadButtonTexts(); // 컴포넌트가 마운트될 때 버튼 텍스트를 불러옴
  }, []);

  const loadButtonTexts = async () => {
    const loadedButtonTexts = await getButtonTexts();
    const buttonTextArray = Array(5).fill(""); // 기본값으로 초기화
    loadedButtonTexts.forEach((item) => {
      buttonTextArray[item.buttonIndex] = item.buttonText;
    });
    setButtonTexts(buttonTextArray);
  };

  const handleButtonClick = async (buttonIndex) => {
    const newButtonTexts = [...buttonTexts];
    const buttonText = ["가", "나", "다", "라", "마"][buttonIndex]; // 원하는 텍스트로 변경
    newButtonTexts[buttonIndex] = buttonText;
    setButtonTexts(newButtonTexts);
    await saveButtonText(buttonIndex, buttonText);
  };

  const handleImageSelection = async (index) => {
    Alert.alert(
      "이미지 선택",
      "카메라로 사진을 찍을지 갤러리에서 사진을 선택할지 선택해주세요.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "카메라",
          onPress: () => launchCameraWithIndex(index),
        },
        {
          text: "갤러리",
          onPress: () => launchImageLibraryWithIndex(index),
        },
      ]
    );
  };

  const uploadImagesToFirebase = async () => {
    try {
      const uploadTasks = selectedImages.map(async (image) => {
        if (image) {
          const response = await fetch(image);
          const blob = await response.blob();
          const imageName = new Date().getTime().toString();
          return uploadImage(blob, imageName); // 이미지 업로드 함수 호출
    
        }
        navigation.navigate("Board");
      });

      await Promise.all(uploadTasks);
      Alert.alert("Success", "이미지 업로드가 완료되었습니다.");
    } catch (error) {
      console.error("Error uploading images:", error);
      Alert.alert("Error", "이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  const launchCameraWithIndex = async (index) => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const newSelectedImages = [...selectedImages];
      newSelectedImages[index] = result.uri;
      setSelectedImages(newSelectedImages);
    }
  };

  const launchImageLibraryWithIndex = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false, // Only allow selecting one image
    });
  
    if (!result.canceled && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      const newSelectedImages = [...selectedImages];
      newSelectedImages[index] = selectedAsset.uri;
      setSelectedImages(newSelectedImages);
    }
  };
  

  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        {selectedImages.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImageSelection(index)}
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: 100, height: 100 }}
              />
            ) : (
              <Text>이미지 선택</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ marginTop: 20 }}>
        {buttonTexts.map((text, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleButtonClick(index)}
            style={{ marginVertical: 10, alignItems: "center" }}
          >
            <Text>{text || "버튼 " + (index + 1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity onPress={uploadImagesToFirebase}>
          <Text>이미지 업로드</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UploadScreen;
