import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../AuthContext";
import Icon from "react-native-vector-icons/FontAwesome";

const MenuItem = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuItemText}>{title}</Text>
    </TouchableOpacity>
  );
};

const LoggedInMyPage = () => {
  const navigation = useNavigation();
  const {
    isLoggedIn,
    handleLoggedout,
    userEmail,
    userPoints,
    userNickname,
    handleUserPoint,
    handleUserPoint_reset,
  } = useAuth();
  const maxExperience = 100; // 최대 경험치 값
  const handleSettingsPress = () => {
    navigation.navigate("Settings");
  };

  console.log(isLoggedIn);

  return (
    <View style={styles.container}>
      <View style={styles.my_info}>
        <View style={styles.info_lv1}>
          <Text style={styles.info_text}>마이페이지</Text>
          <Icon name="gear" size={20} style={{ color: "#487548" }} />
        </View>
        <View style={styles.info_lv2}>
          <Image
            source={require("../../assets/profile1.png")}
            style={{
              width: 150,
              height: 150,
              borderRadius: 75,
            }}
          />
        </View>
        <View style={styles.info_lv3}>
          <Text style={styles.info_text}>{userNickname}</Text>
        </View>
        {isLoggedIn ? (
          <View style={{ alignItems: "center" }}>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${userPoints}%` }]} />
              <Text style={styles.text}>
                {userPoints % 100} / {maxExperience}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={{ heihgt: 30 }}>로그인 후 이용하세요</Text>
        )}
      </View>
      <View style={styles.split_box}></View>
      <View style={styles.my_navi}>
        <View style={styles.navi_row}>
          <Icon
            name="bell"
            size={20}
            style={{ marginRight: 10, color: "#487548", marginRight: 10 }}
          />
          <Text>알림설정</Text>
        </View>
        <View style={styles.navi_row}>
          <Icon
            name="paw"
            size={20}
            style={{ marginRight: 10, color: "#487548" }}
          />
          <Text>평가 관리</Text>
        </View>
        <View style={styles.navi_row}>
          <Icon
            name="tree"
            size={20}
            style={{ marginRight: 10, color: "#487548" }}
          />
          <Text>포인트</Text>
        </View>
        <View style={styles.navi_row}>
          <Icon
            name="clipboard"
            size={20}
            style={{ marginRight: 10, color: "#487548" }}
          />
          <Text>내가 쓴 글</Text>
        </View>
      </View>
      <View>
        <View style={styles.navi_row}>
          <Icon
            name="phone"
            size={20}
            style={{ marginRight: 10, color: "#487548" }}
          />
          <Text>고객센터</Text>
        </View>
      </View>
      <View>
        <View style={styles.navi_row}>
          <Icon
            name="check"
            size={20}
            style={{ marginRight: 10, color: "#487548" }}
          />
          <Text onPress={handleLoggedout}>로그아웃</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    color: "#487548",
  },
  my_info: {},
  info_text: {
    color: "#487548",
    fontWeight: "bold",
  },
  info_deco_point: {
    backgroundColor: "yellow",
    padding: 10,
  },
  info_lv1: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  info_lv2: {
    alignItems: "center",
    padding: 10,
  },
  info_lv3: {
    alignItems: "center",
    padding: 10,
  },
  info_lv4: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "",
  },
  split_box: {
    width: "100%",
    height: 5,
    backgroundColor: "#487548",
  },
  navi_row: {
    flexDirection: "row",
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1, // 1px border
    borderBottomColor: "#487548", // red color
    alignItems: "center",
  },
  progressContainer: {
    width: "80%",
    height: 30,
    width: 200,
    backgroundColor: "#ccc",
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "blue",
  },
  text: {
    alignSelf: "center",
    position: "absolute",
    fontWeight: "bold",
    color: "white",
  },
});

export default LoggedInMyPage;
