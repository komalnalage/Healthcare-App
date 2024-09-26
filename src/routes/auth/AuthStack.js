import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Welcome from "../../screens/auth/Welcome";
import AppRoutes from "../RouteKeys/appRoutes";
import Walkthrough from "../../screens/auth/Walkthrough";
import ChooseLang from "../../screens/auth/ChooseLang";
import Login from "../../screens/auth/Login";
import SignUp from "../../screens/auth/SignUp";
import ForgotPwd from "../../screens/auth/ForgotPwd";
import Verification from "../../screens/auth/Verification";
import ResetPwd from "../../screens/auth/ResetPwd";
import ChangePassword from "../../screens/auth/ChangePassword";
import TermsCondition from "../../screens/nonAuth/TermsCondition";
import PrivacyPolicy from "../../screens/nonAuth/PrivacyPolicy";
import { useSelector } from "react-redux";

export default function AuthStack() {
  const Stack = createNativeStackNavigator();
  const intro =      useSelector((state) => state.userData.intro);
console.log(intro);

  return (
    <Stack.Navigator
      initialRouteName={AppRoutes.Walkthrough}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AppRoutes.Welcome} component={Welcome} />
      {intro!="done"&&<Stack.Screen name={AppRoutes.Walkthrough} component={Walkthrough} />}
      <Stack.Screen name={AppRoutes.ChooseLang} component={ChooseLang} />
      <Stack.Screen name={AppRoutes.Login} component={Login} />
      <Stack.Screen name={AppRoutes.SignUp} component={SignUp} />
      <Stack.Screen name={AppRoutes.ForgotPwd} component={ForgotPwd} />
      <Stack.Screen name={AppRoutes.Verification} component={Verification} />
      <Stack.Screen name={AppRoutes.ResetPwd} component={ResetPwd} />
      <Stack.Screen name={AppRoutes.ChangePassword} component={ChangePassword} />
      <Stack.Screen name={AppRoutes.TermsCondition} component={TermsCondition} />
      <Stack.Screen name={AppRoutes.PrivacyPolicy} component={PrivacyPolicy} />
    </Stack.Navigator>
  );
}
