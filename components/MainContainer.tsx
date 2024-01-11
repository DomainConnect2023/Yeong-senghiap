import { SafeAreaView, StyleSheet } from "react-native";
import { IProps } from "../auth-app";

const MainContainer: React.FC<IProps> = ({ children }) => {
  return (
    <SafeAreaView style={styles.setMainContainer}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  setMainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  }
})

export default MainContainer;
