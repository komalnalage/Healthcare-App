import React, { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AppRoutes from "../RouteKeys/appRoutes";
import AuthStack from "../auth/AuthStack";
import { LocalizationContext } from "../../localization/localization";
import { strings } from "../../constants/variables";
import DrawerStack from "./drawerStack";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setLanguageCode } from "../../redux/Reducers/userData";
import Loader from "../../screens/modals/Loader";

export default function MainStack({ navigation }) {
  const { initializeAppLanguage, setAppLanguage } = useContext(LocalizationContext);
  const Stack = createNativeStackNavigator();
  const auth = useSelector((state) => state.userData.auth);
  const loader = useSelector((state) => state.userNewData.loader);

  const [isAuth, setisAuth] = useState(false)
  useEffect(() => {
    console.log(auth,"KKKKK");
  setisAuth(auth)
  }, [auth])
  

  const dispatch = useDispatch();

  useEffect(() => {

    AsyncStorage.getItem('Langauge', (err, language) => {
      if (language) {
        if (language == 'Spanish') {
          dispatch(setLanguageCode("es"))
        } else if (language == 'French') {
          dispatch(setLanguageCode("fr"))
        }
        setAppLanguage(language);
        initializeAppLanguage();
      } else {
        setAppLanguage(strings?.english);
        dispatch(setLanguageCode("en"))
        initializeAppLanguage();
      }
    })
  }, []);

  return (
    <>
    <Stack.Navigator initialRouteName={auth?AppRoutes.DrawerStack:AppRoutes.AuthStack} screenOptions={{ headerShown: false }}>
       <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.DrawerStack} component={DrawerStack} /> 
        <Stack.Screen name={AppRoutes.AuthStack} component={AuthStack} />
        
    </Stack.Navigator>
    {/* {loader&&<Loader/>} */}
    </>
  );
}
