import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert ,ScrollView,TextInput} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { storage, storef, uploadImage, saveButtonText,saveImageDataToFirestore,getDownloadURL } from "../../firebaseConfig";
import { useAuth } from "../../AuthContext";

import { useNavigation } from "@react-navigation/native";

const UploadScreen = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [activeButtons, setActiveButtons] = useState([]); // Track the active button
  const [addressInput, setAddressInput] = useState(""); // 추가된 부분
  

  const { userNickname } = useAuth();

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

  const handleImageSelect = (selectedImage) => {
    if (!selectedImages.includes(selectedImage)) {
      setSelectedImages([...selectedImages, selectedImage]);
    }
  };
  



  const uploadImagesToFirebase = async () => {
    try {
      if (selectedImages.length === 0 || addressInput === "") { // 텍스트가 비어있으면 업로드 방지
        Alert.alert("Error", "이미지와 텍스트를 모두 입력해주세요.");
        return;
      }
      const uploadPromises = selectedImages.map(async (selectedImage) => {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const imageName = new Date().getTime().toString();
        const storageRef = await uploadImage(blob, imageName);
  
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL; // Return the URL for each uploaded image
      });

      const imageUrls = await Promise.all(uploadPromises);

      // Now you have an array of download URLs, you can save them to Firestore
      await saveImageDataToFirestore(imageUrls, activeButtons,userNickname,addressInput);
  
      setSelectedImages([]);
      setActiveButtons([]); // Reset active button
      setAddressInput(""); // Reset text input

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

    if (!result.cancelled) {
      handleImageSelect(result.uri);
    }
  };

  const launchImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (!result.cancelled && result.assets.length > 0) {
      result.assets.forEach(asset => {
        handleImageSelect(asset.uri);
      });
    }
  };


  return (
    <ScrollView>
      <TouchableOpacity onPress={handleButtonClick}>
        {selectedImages.length > 0 ? (
          <ScrollView horizontal>
            {selectedImages.map((uri, index) => (
              <Image key={index} source={{ uri }} style={{ width: 200, height: 200, margin: 5 }} />
            ))}
          </ScrollView>
        ) : (
          <Text>이미지 선택</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handletextButtonClick("가")}>
        <Text style={activeButtons.includes("가") ? styles.activeButtonText : styles.buttonText}>가</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handletextButtonClick("나")}>
        <Text style={activeButtons.includes("나") ? styles.activeButtonText : styles.buttonText}>나</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handletextButtonClick("다")}>
        <Text style={activeButtons.includes("다") ? styles.activeButtonText : styles.buttonText}>다</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="텍스트 입력"
        onChangeText={setAddressInput}
        value={addressInput}
      />
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity onPress={uploadImagesToFirebase}>
          <Text>이미지 업로드</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
