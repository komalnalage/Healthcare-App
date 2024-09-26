import { createSlice } from '@reduxjs/toolkit';
import { strings } from '../../constants/variables';
import { act } from 'react-test-renderer';
import { useContext } from 'react';
import { LocalizationContext } from '../../localization/localization';

export const userDataSlice = createSlice({
    name: 'userNewData',
    initialState: {
        therapistSearchModal: false,
        userSearch: false,
        drawerSelectedTab:"Home",
        loader:false,
        lastLogin:"user",
        isChatScreenOpened: false,

    },
    reducers: {
        settherapistSearchModal: (state, action) => {
            state.therapistSearchModal = action.payload
        },
        setUserSearch: (state, action) => {
            state.userSearch = action.payload
        },
        setdrawerSelectedTab: (state, action) => {
            state.drawerSelectedTab = action.payload
        },
        setloader: (state, action) => {
            state.loader = action.payload
        },
        setlastLogin: (state, action) => {
            state.lastLogin = action.payload
        },
        setIsChatScreenOpened: (state, action) => {
            state.isChatScreenOpened = action.payload;
          },


    },
});
export const {
    settherapistSearchModal,
    setUserSearch,
    setdrawerSelectedTab,
    setloader,
    setlastLogin,
    setIsChatScreenOpened

} = userDataSlice.actions;

export default userDataSlice.reducer;
