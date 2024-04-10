import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// currently the calendar is hard coded at 3 and the editing user is user 4
// need to change to get calendar associated with login user etc.

export default function FillInCalendar(){
    require("../../App.css");
    const navigate = useNavigate();
    const handleSubmit = () => navigate('/FillInCalendar', { replace: false });
    // const testSelectProducts = () => navigate('/testPage', { replace: false });

    // holds api availability data
    const [availablilties, setAvailabilities] = useState([]);
    // calendar in the form to display
    const [displayCalendarSeparated, setDisplayCalendarSeparated] = useState([]);
    // array of a column of time slots for calendar
    const [timeSlots, setTimeSlots] = useState([]);
    // variables to be used in calculations
    const [startDateGlobal, setStartDateGlobal] = useState("");
    const [startTimeGlobal, setStartTimeGlobal] = useState("");
    // calendar to edit
    const [editCal, setEditCal] = useState([]);
    // preference for selection of slots
    const [editPref, setEditPref] = useState("high");
    // hold api invited data
    const [invList, setInvList] = useState([]);
    // invited data in the form to display
    const [invDisp, setInvDisp] = useState([]);
    // user data
    const [userData, setUserData] = useState([]);
    // username for input for adding a new invited user
    const [userToAdd, setUserToAdd] = useState("");

    // create calendar arrays from api
    useEffect(() => {
        axios.get('http://localhost:8000/api/calendar/1/')
            .then(response => {
                var tempArr = []
                var start_time = response.data.start_time;
                var start_hour = parseInt(start_time.split(":")[0], 10);
                var end_time = response.data.end_time;
                var end_hour = parseInt(end_time.split(":")[0], 10);
                var num_slots = end_hour - start_hour;
                setStartTimeGlobal(start_hour)

                var startDateString = response.data.start_date;
                setStartDateGlobal(startDateString)
                var endDateString = response.data.end_date;
                var startDate = new Date(startDateString);
                var endDate = new Date(endDateString);
                var differenceInMs = endDate - startDate;
                var num_days = (differenceInMs / (1000 * 60 * 60 * 24)) + 1;

                for(var i = 0; i < num_days+1; i++){
                    for(var j = 0; j < num_slots; j++){
                        if(i == 0){
                            var time = (j + start_hour) % 12;
                            if (time == 0){time = 12}
                            var tempStr = time + ":00 - " + (time+1) + ":00";
                            tempArr.push(tempStr);
                        } else{
                            var tempStr = "blank";
                            tempArr.push(tempStr);
                        }
                    }            
                }
                var temp = [];
                var temp2 = [];
                var newArr = [];
                var newArrayEdit = [];

                for(let i = 0; i < tempArr.length; i = i + num_slots){
                    for(let j = 0; j < num_slots; j++){
                        temp.push([tempArr[i+j], 0, 0]) 
                        temp2.push([tempArr[i+j], 0, 0])                               
                    }
                    newArr.push(temp);
                    newArrayEdit.push(temp2);
                    temp = [];
                    temp2 = [];
                }

                var tempSliceDisplay = newArr.slice(1);
                newArrayEdit = newArrayEdit.slice(1);
                setDisplayCalendarSeparated(tempSliceDisplay);
                setEditCal(newArrayEdit);
                setTimeSlots(newArr[0]);
                console.log("successfully extracted calendar");
            })
            .catch(error => {
            console.log(error);
            });
        }, []);

    // grab availabilities from api
    useEffect(() => {
    axios.get('http://localhost:8000/api/calendar/1/availabilities/')
        .then(response => {
        setAvailabilities(response.data);
        })
        .catch(error => {
        console.log(error);
        });
    }, []);

    // grab all user info from api
    useEffect(() => {
        axios.get('http://localhost:8000/api/allUsers/')
            .then(response => {
            setUserData(response.data);
            // console.log(response.data);
            })
            .catch(error => {
            console.log(error);
            });
        }, []);

    // grab all invited users to a calendar
    useEffect(() => {
        axios.get('http://localhost:8000/api/calendar/1/invited/')
            .then(response => {
            setInvList(response.data);
            })
            .catch(error => {
            console.log(error);
            });
        }, []);

    // generate the calendar with availabilities, generate invited contacts
    useEffect(() => {
        // update calendar for each availablilty
        if(availablilties.length == 0){return}
        if(invList.length == 0){return}
        if(userData.length == 0){return}
        for(let i = 0; i < availablilties.length; i++){
            let start = availablilties[i].start_time;
            let avDate = ""

            avDate = start.substring(0, 10)
            avDate = new Date(avDate);
            if(startDateGlobal == ""){break}

            let startDateGlobaltemp = new Date(startDateGlobal)
            let differenceInMs = avDate - startDateGlobaltemp;
            // how far from the start date it is
            let dayIndex = Math.round(differenceInMs / (1000 * 60 * 60 * 24));

            let timeIndex = 0;

            start = parseInt(start.substring(11, 13));
            timeIndex = start - startTimeGlobal

            let pref = false;
            let user = 0;
            let prefClass = "blank";
            if(typeof availablilties[i].preference === undefined){ continue } else{
                pref = availablilties[i].preference;
                if(pref) {prefClass = "high"} else {prefClass = "low"}
                user = availablilties[i].user;
            }

            // console.log(displayCalendarSeparated);

            if(displayCalendarSeparated.length < 1){return}
            var dispCopy = displayCalendarSeparated;

            var id = availablilties[i].id;

            var username = ""
            // get relevant user info
            for(let k = 0; k < userData.length; k++){
                if(userData[k].id == user){
                    username = userData[k].username;
                }
            }

            dispCopy[parseInt(dayIndex)][parseInt(timeIndex)] = [prefClass, username, id]; 
            // console.log(dispCopy);
            setDisplayCalendarSeparated(dispCopy);
            console.log("generated availabilities");
        }
        // generate contacts into a form to display
        // console.log(invList);
        var InvDispTemp = [];
        for(let d = 0; d < invList.length; d++){
            var invusername = ""
            var invemail = ""
            // get relevant user info
            for(let k = 0; k < userData.length; k++){
                if(userData[k].id == invList[d].invUser){
                    invusername = userData[k].username;
                    invemail = userData[k].email;
                }
            }
            var emailStr = "mailto:" + invemail + "?subject=More%20info...?body=Please%20follow%20up%20on%20this%20meeting%20http://localhost:3000/FillInCalendar%0D%0A%20%0D%0A";
            // fourth col is email for their username
            InvDispTemp.push([invusername, invList[d].id, invList[d].answered, emailStr]);
        }
        setInvDisp(InvDispTemp);
    //};
    }, [availablilties, displayCalendarSeparated, startDateGlobal, startTimeGlobal, invList, userData]);

    const dateToDay = (date) => {
        let i = date;
        if (i == 0){return("Monday")}
        else if (i == 1){return("Tuesday")}
        else if (i == 2){return("Wednesday")}
        else if (i == 3){return("Thursday")}
        else if (i == 4){return("Friday")}
        else if (i == 5){return("Saturday")}
        else if (i == 6){return("Sunday")}
        else {console.log("error in dateToDay")}
    }

    const handlePref = () => {
        if(editPref == "high"){
            setEditPref("low")
        } else {
            setEditPref("high")
        }
    }

    const handleAddInvited = () => {
        
        console.log("user to add:");
        console.log(userToAdd);

        // get user id for that username
        var un = ""
        for(let k = 0; k < userData.length; k++){
            if(userData[k].username == userToAdd){
                un = userData[k].id;
            }
        }

        if(un == ""){setUserToAdd("user does not exist")} else {
        console.log("user id found");
        console.log(un);

        axios({
            method: 'post',
            url: 'http://localhost:8000/api/' + un + '/invitedpost/1/',
            data: {
                "answered": "false"
            }                
        });


        setUserToAdd("");}
    }

    const handleDeleteContact = (contactID) => {
        axios({
            method: 'delete',
            url: 'http://localhost:8000/api/invited/' + contactID +"/",
            data: {}                
        });
    }

    // update button if needed <button onClick={handlePref}>update</button>
    // nav button <button  onClick={handleSubmit}>go to fill in calendar page</button> 


    return (
        <div>
            <div className="wrapper">
                <div className="cal-wrapper">
                    <h1>Current Responses</h1>
                    <div className="display-calendar">
                        <div className="time-column">
                            <h4 className="show">Time</h4>
                            {timeSlots?.map((item2, idx2) => (
                                <div key={idx2} className="blank show">{item2[0]}</div>
                            ))}
                        </div>
                        {displayCalendarSeparated?.map((inner2, index2) => (
                            <div key={index2} className="time-column">
                                <h4>{dateToDay(index2)}</h4>
                                {inner2.map((time2, idx2) => (
                                    <div key={idx2} className={time2[0]}>{time2[1]}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>  
                <div className="invited-wrapper">
                    <div className="invited-contacts">
                        {invDisp?.map((item2, idx2) => (
                                <div key={idx2} className="contact">
                                    <h3>{item2[0]}</h3>
                                    {item2[2]
                                        ? <p>user has already responded</p>
                                        : <a href={item2[3]}>send reminder</a>
                                    }
                                    <button onClick={() => handleDeleteContact(item2[1])}>remove from invited</button>
                                </div>
                        ))}
                    </div>
                    <input type="text" placeholder="Enter username" value={userToAdd} onChange={(e) => setUserToAdd(e.target.value)} />
                    <button className="add-invited" onClick={handleAddInvited}>add contact</button>
                </div>
            </div>
            <div className="bottom">
                <button className="gen">generate possible schedules</button>
            </div> 
        </div>
    );
}