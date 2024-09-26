import { createSlice } from '@reduxjs/toolkit';
import { strings } from '../../constants/variables';
import { act } from 'react-test-renderer';
export const userDataSlice = createSlice({
    name: 'userData',
    initialState: {
        auth: false,
        token: '',
        user: { type: 'user' },
        userData: {},
        appLanguage: strings.english,
        initialRouteName: 'Home',
        token: '',
        languageCode: "en",
        navigateFrom: "",
        verificationEnabled: false,
        therapistProfileDetail: {},
        therapistSearchModal: false,
        userSearch: false,
        lat: "",
        long: "",
        isNavigate: false,
        isCallCompleted: false,
        userDetail: {},
        notificationType: "",
        loader:false,
        intro :"not",
        lastLoginDetails:{type:"user"},
        appActiveState:false
    },
    reducers: {
        setAuth: (state, action) => {
            state.auth = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setappActiveState: (state, action) => {
            state.appActiveState = action.payload;
        },
        setIntro: (state, action) => {
            state.intro = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        SetAppLanguage: (state, action) => {
            state.appLanguage = action.payload;
        },
        SetinitialRouteName: (state, action) => {
            state.initialRouteName = action.payload;
        },
        setuserData: (state, action) => {
            state.userData = action.payload;
        },
        settoken: (state, action) => {
            state.token = action.payload;
        },
        setLanguageCode: (state, action) => {
            state.languageCode = action.payload
        },
        setTherapistProfileDetail: (state, action) => {
            state.therapistProfileDetail = action.payload
        },
        setNavigateFrom: (state, action) => {
            state.navigateFrom = action.payload
        },
        setVerificationEnabled: (state, action) => {
            state.verificationEnabled = action.payload
        },
        setlatitude: (state, action) => {
            state.lat = action.payload
        },
        setlongitude: (state, action) => {
            state.long = action.payload
        },
        setUserSearch: (state, action) => {
            state.userSearch = action.payload
        },
        setIsNavigate: (state, action) => {
            state.isNavigate = action.payload
        },
        setIsCallCompleted: (state, action) => {
            state.isCallCompleted = action.payload
        },
        setUserDetail: (state, action) => {
            state.userDetail = action.payload
        },
        setnotificationType: (state, action) => {
            state.notificationType = action.payload
        },
        setloading: (state, action) => {
            state.loader = action.payload
        },
        setlastLoginDetails: (state, action) => {
            state.lastLoginDetails = action.payload
        },
        

    },
});
export const {
    setAuth,
    setUser,
    setToken,
    SetAppLanguage,
    SetinitialRouteName,
    setuserData,
    settoken,
    setIntro,
    setLanguageCode,
    setTherapistProfileDetail,
    setNavigateFrom,
    setVerificationEnabled,
    // settherapistSearchModal,
    setlatitude,
    setlongitude,
    setUserSearch,
    setIsNavigate,
    setIsCallCompleted,
    setUserDetail,
    setnotificationType,
    setloading,
    setlastLoginDetails,
    setappActiveState

} = userDataSlice.actions;

export default userDataSlice.reducer;
