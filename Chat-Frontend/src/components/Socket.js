import { io } from "socket.io-client";
import { setOnlineUser, setSocketConnection } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const initSocket = async (dispatch) => {
    const socketConnection = io(process.env.REACT_APP_API_URL, {
        auth: {
        token: localStorage.getItem('token')
        }
    });

    socketConnection.on('onlineUser', (data) => {
        dispatch(setOnlineUser(data));
        localStorage.setItem('onlineUser', JSON.stringify(data));
    });

    dispatch(setSocketConnection(socketConnection));
    // dispatch(setSocketConnection(true));
    return socketConnection;
};

export default initSocket;