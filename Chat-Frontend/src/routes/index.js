import App from "../App";
import MessagePage from "../components/MessagePage";
import Room from "../components/Room";
import AuthLayouts from "../layout";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import RegisterPage from "../pages/RegisterPage";

const { createBrowserRouter } = require("react-router-dom");

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/register',
                element: <AuthLayouts><RegisterPage /></AuthLayouts>
            },
            {
                path: 'email',
                element: <AuthLayouts><CheckEmailPage /></AuthLayouts>
            },
            {
                path: 'password',
                element: <AuthLayouts><CheckPasswordPage /></AuthLayouts>
            },
            {
                path: 'forgot-password',
                element: <AuthLayouts><ForgotPassword /></AuthLayouts>
            },
            {
                path: 'room/:roomId',
                element: <Room />
            },
            {
                path: '',
                element: <Home />,
                children: [
                    {
                        path: ':userId',
                        element: <MessagePage />
                    }
                ]
            }
        ]
    }
]);

export default router;  