import {useRoutes} from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import ViewResponded from "../pages/ViewResponded";
import FillInCalendar from "../pages/FillInCalendar";


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
                    path: '/ViewResponded', 
                    element: <ViewResponded />
                },
                {
                    path: '/FillInCalendar', 
                    element: <FillInCalendar />
                }
            ]
        },
    ]);
}