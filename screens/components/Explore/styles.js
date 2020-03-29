import { StyleSheet } from "react-native";
const styles=StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 40
    },
    brandTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#333"
    },
    textBox: {
      height: 40,
      borderWidth: 1,
      borderColor: "#333",
      padding: 10,
      margin: 10,
      flex: 1,
      fontWeight:'400',
      borderRadius:2,
      backgroundColor:'#dddd',
      fontSize:12,
      fontFamily:'sans-serif-light',
      paddingTop: 7,
      paddingBottom:7,
      paddingHorizontal: 10 }
    ,
    searchBoxContainer: {
      width: "100%",
      flexDirection: "row",
      fontFamily:'sans-serif-light'
    },
    repoContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 10
    },
    repoIcon: {
      fontSize: 40,
      paddingHorizontal: 10,
      color: "#333"
    },
    metaContainer: {
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row"
    },
    starIcon: {
      color: "#333",
      marginRight: 2
    },
    repoTitle: {
      color: "#333",
      fontWeight: "bold"
    },
    repoDescription: {
      color: "black"
    },
    seperator: {
      backgroundColor: "#333",
      height: StyleSheet.hairlineWidth
    }
  });
export default styles;