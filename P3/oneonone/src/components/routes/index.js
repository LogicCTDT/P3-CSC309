import {useRoutes} from "react-router-dom";
// import LandingPage from "../pages/LandingPage";
// import ViewResponded from "../pages/ViewResponded";
import Profile from "../profile";
import Signup from '../signup/Signup';
import Login from '../login/Login';
import Dashboard from "../token/getsetToken";


export default function Router (){
    return useRoutes([
        {
            path: '/',
            children: [
                // {
                //     path: '/',
                //     element: <LandingPage />
                // },
                // {
                //     path:'/register', 
                //     element: <ViewResponded />
                // },
                {
                    path: '/profile',
                    element: <Profile />
                },
                {
                    path: '/signup',
                    element: <Signup />
                },
                {
                    path: '/login',
                    element: <Login />
                },
                {
                    path: '/dashboard',
                    element: <Dashboard />
                }
            ]
        },
    ]);
}