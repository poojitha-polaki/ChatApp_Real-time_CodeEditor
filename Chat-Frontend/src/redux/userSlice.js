import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    name: '',
    email: '',
    password: '',
    profile_pic: '',
    _id: '',
    onlineUser: [],
    socketConnection: null,
};

// const initialState = {
//     name: '',
//     email: '',
//     password: '',
//     profile_pic: '',
//     _id: '',
//     onlineUser: [],
//     isSocketConnected: false, // Replace socketConnection with this
// };

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state._id = action.payload._id
            state.name = action.payload.name
            state.email = action.payload.email
            state.password = action.payload.password
            state.profile_pic = action.payload.profile_pic
        },
        setToken: (state, action) => {
            state.token = action.payload
        },
        logout: (state) => {
            state._id = ''
            state.name = ''
            state.email = ''
            state.password = ''
            state.profile_pic = ''
            state.socketConnection = null
        },
        // logout: (state) => {
        //     state._id = ''
        //     state.name = ''
        //     state.email = ''
        //     state.password = ''
        //     state.profile_pic = ''
        //     state.isSocketConnected = false // Reset this instead of socketConnection
        // },
        setOnlineUser: (state, action) => {
            state.onlineUser = action.payload
        },
        setSocketConnection: (state, action) => {
            state.socketConnection = action.payload
        }
        // setSocketConnection: (state, action) => {
        //     state.isSocketConnected = action.payload;
        // }
    },
});

export const {setUser , setToken , logout , setOnlineUser , setSocketConnection} = userSlice.actions;
// export const {setUser, setToken, logout, setOnlineUser, setSocketConnection} = userSlice.actions;

export default userSlice.reducer;