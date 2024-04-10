import {useRoutes} from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import ViewResponded from "../pages/ViewResponded";
import SuggestedMeetings from "../SuggestedMeetings";
import Meetings from "../Meetings.js";
import Contacts from "../contacts.js";
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
                },
                {
                    path: '/suggested',
                    element: <SuggestedMeetings />
                },
                {
                    path: '/meetings',
                    element: <Meetings />
                },
                {
                    path: '/contacts',
                    element: <Contacts/>
                }
            ]
        },
    ]);
}