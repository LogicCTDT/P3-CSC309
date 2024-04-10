//import "./meetings.css";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const Meetings = () => {
    const [loading, setLoading] = useState(true);
    const [meetings, setMeetings] = useState([]);

    /////////////////////////////////////////////////////
    // UPDATE USER ID TO WHAT AUTH SAYS
    /////////////////////////////////////////////////////
    useEffect(() => {
        setLoading(true);
        axios.get("http://127.0.0.1:8000/api/11/meetings/").then(response => {

            if (meetings.length == 0) {
            meetings.push(response.data);
            }
            
            setMeetings([...meetings]);
            console.log(meetings);
            setLoading(false);
    }
    ).catch(error => {
        console.log(error);
    });
    }, []);
    
    if (loading) {
        return <h1> Loading... </h1>
    }
    require('./profile.css');
    require('./meetings.css');
    return (
        <body>
        <header class = "bg-black text-white top-0 z-99 h-16 sticky">
            <section class="max-w-4xl mx-auto p-4 flex justify-between items-center">
                <h1 class="text-3xl font-medium">
                    <a href="meetings_page.html">1on1</a>
                </h1>
                <div>
                    <button id="hamburger-button" class="text-3xl md:hidden cursor-pointer">
                        &#9776;
                    </button>
                    <nav class="hidden md:block space-x-8 text-xl" aria-label="main">
                        <a href="/meetings" class="hover:opacity-80">Meetings</a>
                        <a href="create-meeting.html" class="hover:opacity-80">Schedule Meetings</a>
                        <a href="/contacts" class="hover:opacity-80">Contacts</a>
                        <a href="profile.html" class="hover:opacity-80">Profile</a>
                    </nav>
                </div>
            </section>
            <section id="mobile-menu" class = "absolute top-0 bg-black w-full text-5xl flex-col justify-content-center origin-top animate-open-menu hidden overflow-y-hidden">
                <button class = "text 8xl self-end px-6">
                    &times;
                </button>
                <nav class="flex flex-col min-h-screen items-center py-8" aria-label="mobile">
                    <a href="meetings_page.html" class = "w-full text-center py-6 hover:opacity-80 text-2xl">Meetings</a>
                    <a href="create-meeting.html" class = "w-full text-center py-6 hover:opacity-80 text-2xl">Schedule Meetings</a>
                    <a href="contacts.html" class = "w-full text-center py-6 hover:opacity-80 text-2xl">Contacts</a>
                    <a href="profile.html" class = "w-full text-center py-6 hover:opacity-80 text-2xl">Profile</a>
                </nav>
    
            </section>
        </header>
        <div class='meetingContainer' id="meetingContainer">
        <h1 class="meetingTitle"> Your Meetings</h1>
        {meetings[0].map((meeting, index) => {
            const startTime = new Date(meeting.start_time);
            const endTime = new Date(startTime.getTime() + 60 * 60000).toISOString().slice(11, 16);
            const startTimeA = startTime.toISOString().slice(11, 16);
            return (
            <div key={index} class='meetingBox'>
                <h2 class="meetingName"> {meeting.user1_id} </h2>
                <div class="meetingInformation">
                <h6 class="meetingPartner"> With {meeting.user2_id} </h6>
                <p class="meetingTime"> {startTimeA} - {endTime} </p>
                </div>
            </div>
            )
            })}

            <a href="create-meeting.html"><button type="button" class="meetingButton"> New Meeting </button></a>
            <a href="view-created.html"><button type="button" class="meetingButton"> View Sent Meetings </button></a>
            <h1 class="meetingTitle"> Invited Meetings </h1>
        </div>
    </body>
    )
}

export default Meetings;