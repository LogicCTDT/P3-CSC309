import {useRoutes} from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import ViewResponded from "../pages/ViewResponded";


export default function Router (){
    return useRoutes([
        {
            path: '/',
            children: [
                {
                    path: '/',
                    element: <LandingPage />
                },
                {
                    path: '/register', 
                    element: <ViewResponded />
                }
            ]
        },
    ]);
}