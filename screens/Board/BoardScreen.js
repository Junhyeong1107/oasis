import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { storage, stoRef, getDownloadURL, listAll,storeQuery,collection,db,where,getDocs} from "../../firebaseConfig";
import Swiper from "react-native-swiper"; // react-native-swiper 패키지를 import


import { useNavigation } from "@react-navigation/native";

const BoardScreen = () => {
  const navigation = useNavigation();
  const [imageUrls, setImageUrls] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // refreshing 상태 추가

  const fetchImageUrls = async () => {
    try {
      const storageRef = stoRef(storage, "images");
      const fileList = await listAll(storageRef);
  
      const urlsAndData = await Promise.all(
        fileList.items.map(async (item) => {
          const url = await getDownloadURL(item);
  
          // Fetch additional data from Firestore based on the image's URL
          const q = storeQuery(
            collection(db, "images"),
            where("imageURL", "==", url)
          );
          const querySnapshot = await getDocs(q);
  
          console.log("Query Snapshot:", querySnapshot); // Add this line
  
          if (querySnapshot.docs.length === 0) {
            return {
              url: url,
              associatedText: "", // No associated text found for this URL
            };
          }
  
          const data = querySnapshot.docs[0].data();
  
          return {
            url: url,
            associatedText: data ? data.associatedText : "",
          };
        })
      );
  
      setImageUrls(urlsAndData);
    } catch (error) {
      console.error("Error fetching image URLs from Firebase Storage:", error);
    }
  };
  
  useEffect(() => {
    fetchImageUrls();
  }, []);

  const handleUploadPress = () => {
    // Navigate to the UploadScreen
    navigation.navigate("Upload");
  };

  const onRefresh = () => {
    setRefreshing(true); // 새로고침 시작
    fetchImageUrls();
    setRefreshing(false); // 새로고침 종료
  };

  return (
<ScrollView
  style={styles.container}
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>
  <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPress}>
    <Text style={styles.uploadButtonText}>업로드</Text>
  </TouchableOpacity>
  <Swiper style={styles.wrapper} showsButtons={false}>
    {imageUrls.map((item, index) => (
      <View key={index} style={styles.slide}>
        <Image source={{ uri: item.url }} style={styles.image} />
      </View>
    ))}
  </Swiper>
  <View style={styles.textContainer}>
    {imageUrls.map((item, index) => (
      <Text key={index} style={styles.nametext}>
        {item.associatedText}
      </Text>
    ))}
  </View>
</ScrollView>

  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  postContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 20,
  },
  nametext: {
    fontSize: 14,
    marginLeft: 17,
    marginTop: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC", // 회색 실선의 색상
    marginVertical: 5, // 상하 여백 조절
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  slide: {
    width: "100%",
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  image: {
    width: 380,
    height: 350,
    borderRadius: 10,
  },
  actionButtonImage: {
    width: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 20,
    // 추가적인 스타일링을 적용할 수 있습니다.
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtonText: {
    marginLeft: 5,
    fontWeight: "bold",
  },
  caption: {
    padding: 10,
  },
});

export default BoardScreen;
