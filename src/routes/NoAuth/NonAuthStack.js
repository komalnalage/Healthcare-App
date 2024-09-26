import React, {useState,useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../screens/nonAuth/Home";
import AppRoutes from "../RouteKeys/appRoutes";
import PrivacyPolicy from "../../screens/nonAuth/PrivacyPolicy";
import TermsCondition from "../../screens/nonAuth/TermsCondition";
import Feedback from "../../screens/nonAuth/Feedback";
import Notifications from "../../screens/nonAuth/Notifications";
import Therapist from "../../screens/nonAuth/Therapist";
import Appointments from "../../screens/nonAuth/Appointments";
import ContactUs from "../../screens/nonAuth/ContactUs";
import BookTherapist from "../../screens/nonAuth/BookTherapist";
import SelectTimeAndDate from "../../screens/nonAuth/SelectTimeAndDate";
import SelectCategories from "../../screens/nonAuth/SelectCategories";
import Profile from "../../screens/nonAuth/Profile";
import EditProfile from "../../screens/nonAuth/EditProfile";
import TherapistProfile from "../../screens/nonAuth/TherapistProfile";
import TherapistEditProfile from "../../screens/nonAuth/TherapistEditProfile";
import ChatScreen from "../../screens/nonAuth/ChatScreen";
import AddCard from "../../screens/nonAuth/AddCard";
import Availability from "../../screens/nonAuth/Availability";
import Video from "../../screens/nonAuth/Video";
import ForgotPwd from "../../screens/auth/ForgotPwd";
import Verification from "../../screens/auth/Verification";
import ResetPwd from "../../screens/auth/ResetPwd";
import { useDispatch, useSelector } from "react-redux";
import IncomingCall from "../../screens/nonAuth/IncomingCall";
import ChangePassword from "../../screens/auth/ChangePassword";
import SavedCard from "../../screens/nonAuth/SavedCard";
import Bimetric from "../../screens/nonAuth/Bimetric";
import BiometricVerification from "../../screens/nonAuth/BiometricVerification";
import Setting from "../../screens/nonAuth/Setting";
import Calender from "../../screens/nonAuth/Calender";
import { setloader, settherapistSearchModal } from "../../redux/Reducers/UserNewData";
import { therapistAcceptCall, therapistRejectCall } from "../../api/Services/services";
import { SetinitialRouteName } from "../../redux/Reducers/userData";
import AppUtils from "../../utils/appUtils";
import moment from "moment";
import ServiceCall from "../../screens/modals/ServiceCall";
import Loader from "../../screens/modals/Loader";
import DrawerStack from "../mainStack/drawerStack";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function NonAuthStack({ navigation }) {
  const Stack = createNativeStackNavigator();
  const initialRouteName = useSelector((state) => state.userData.initialRouteName);
  const isVerificationStoreEnabled = useSelector((state) => state.userData.verificationEnabled);
  const [isVerificationEnabled,setVerification] = useState(false);
  const userDetail = useSelector((state) => state.userData.userDetail);
  const token = useSelector((state) => state.userData.token);
  const loader = useSelector((state) => state.userNewData.loader);


  const currentDateTime = moment().utc();
  const dispatch = useDispatch()
  const therapistSearchModal = useSelector(
    (state) => state.userNewData.therapistSearchModal
  );

  const acceptCallRequest = async () => {
    try {
      dispatch(setloader(true))
      let res = null;
      res = await therapistAcceptCall(currentDateTime, userDetail?.appointment_id, token)
      console.log(res,"dhjfgsdjkfsjfdtvusbfkzgdvsdu");
      if (res?.data?.status) {
        try {
          dispatch(setloader(false))
          dispatch(settherapistSearchModal(false))
          dispatch(SetinitialRouteName("Video"))
          setTimeout(() => {
            //  navigation.navigate(AppRoutes.NonAuthStack , { screen: AppRoutes.Video })
            
            navigation?.navigate( AppRoutes.Video )
          }, 500);
        } catch (error) {
          console.log(error, "shjdfahgfsdhjas");
        }



      } else {
        setTimeout(() => {
          dispatch(setloader(false))
        }, 500);;
        AppUtils.showToast(res?.data?.message);
      }
    } catch (error) {
      dispatch(setloader(false))
      console.log(error, "error");
    }
  };
  const getBiometricDetails =  async () => {
      try {
        const isVerificationEnabled = await AsyncStorage.getItem('IsBiometric');
          if (isVerificationEnabled !== null) {
            // We have data!!
            console.log("Value",isVerificationEnabled);
            return isVerificationEnabled;
          }
      } catch (error) {
       console.log(error);
      }
    };

  const rejectCallRequest = async () => {
    try {
      dispatch(setloader(true))
      let res = null;
      res = await therapistRejectCall(currentDateTime, userDetail?.appointment_id, token)
      if (res?.data?.status) {
        dispatch(setloader(false))

        setTimeout(() => {
          dispatch(settherapistSearchModal(false))
        }, 500);
        AppUtils.showToast(res?.data?.message);

      } else {
        setTimeout(() => {
          dispatch(setloader(false))

        }, 500);;
        AppUtils.showToast(res?.data?.message);
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("IsBiometric", (err, IsBiometric) => {
      console.log("Enabled",IsBiometric);
          return setVerification(IsBiometric);
      
    });
  }, []);

  return (
    <>
      {loader && <Loader />}
      {console.log("metric",isVerificationStoreEnabled)}
      <Stack.Navigator
        initialRouteName={getRouteName() }
        screenOptions={{ headerShown: false }}>
           <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.DrawerStack} component={DrawerStack} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.SelectCategories} component={SelectCategories} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.Home} component={Home} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.SelectTimeAndDate} component={SelectTimeAndDate} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.BookTherapist} component={BookTherapist} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.Therapist} component={Therapist} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.ContactUs} component={ContactUs} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.Notifications} component={Notifications} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.PrivacyPolicy} component={PrivacyPolicy} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.TermsCondition} component={TermsCondition} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.Feedback} component={Feedback} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.Appointments} component={Appointments} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.Profile} component={Profile} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.EditProfile} component={EditProfile} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.TherapistProfile} component={TherapistProfile} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.TherapistEditProfile} component={TherapistEditProfile} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.ChatScreen} component={ChatScreen} />
        <Stack.Screen  name={AppRoutes.AddCard} component={AddCard} options={{
          gestureEnabled: false
        }} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.Availability} component={Availability} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.Video} component={Video} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.ForgotPwd} component={ForgotPwd} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.Verification} component={Verification} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.ResetPwd} component={ResetPwd} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.IncomingCall} component={IncomingCall} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.ChangePassword} component={ChangePassword} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.SavedCard} component={SavedCard} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.Bimetric} component={Bimetric} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.BiometricVerification} component={BiometricVerification} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.Setting} component={Setting} />
        <Stack.Screen options={{gestureEnabled:false}} name={AppRoutes.Calender} component={Calender} />
      </Stack.Navigator>
      {
        therapistSearchModal &&
        <ServiceCall
          appointmentID={userDetail?.appointment_id}
          serviceCallImg={userDetail?.user_detail?.profile_pic}
          isVisible={therapistSearchModal}
          onPressAccept={() => {
            acceptCallRequest();
          }}
          onBackDropPress={() => {
            rejectCallRequest();
          }}
        />
      }
    </>
  );

  function getRouteName() {
    console.log("Verification", isVerificationEnabled);
    if(isVerificationStoreEnabled)
      return initialRouteName
    else
    return AppRoutes.Bimetric;
  }
}
