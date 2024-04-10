import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// currently the calendar is hard coded at 3 and the editing user is user 4
// need to change to get calendar associated with login user etc.

export default function FillInCalendar(){
    require("../../App.css")
    const navigate = useNavigate();
    const handleSubmit = () => navigate('/ViewResponded', { replace: false });

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
    }, [editPref]);

    // generate the calendar with availabilities
    useEffect(() => {
        // update calendar for each availablilty
        if(availablilties.length == 0){return}
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

            if(displayCalendarSeparated.length < 1){return}
            var dispCopy = displayCalendarSeparated;

            if(user != 4){prefClass = "other-sep"}

            var id = availablilties[i].id;

            if(dispCopy[parseInt(dayIndex)][parseInt(timeIndex)][2] != 0 && dispCopy[parseInt(dayIndex)][parseInt(timeIndex)][1] != user){
                dispCopy[parseInt(dayIndex)][parseInt(timeIndex)] = ["shared", user, id]; 
            } else{
                dispCopy[parseInt(dayIndex)][parseInt(timeIndex)] = [prefClass, user, id]; 
            }
            setDisplayCalendarSeparated(dispCopy);
            if(user == 4){
                dispCopy = editCal;
                dispCopy[parseInt(dayIndex)][parseInt(timeIndex)] = [prefClass, user, id];
                setEditCal(dispCopy);
            }
            console.log("generated availabilities");
        }
    //};
    }, [availablilties, displayCalendarSeparated, startDateGlobal, startTimeGlobal]);

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

    const handleButton = (index, idx) => {
        // console.log(index);
        // console.log(idx);
        let temp = editCal;
        var id = temp[index][idx][2];
        if(temp[index][idx][0] == "blank"){
            temp[index][idx] = [editPref, 4, id];

            // configure current date and time from array placement
            var date = parseInt(startDateGlobal.substring(9, 10));
            var currDate = date + index;
            var currTime = startTimeGlobal + idx;
            currDate = currDate.toString();
            if(currDate.length == 1){currDate = "0" + currDate}
            var endTime = currTime + 1
            currTime = currTime.toString();
            endTime = endTime.toString();
            if(currTime.length == 1){currTime = "0" + currTime}
            if(endTime.length == 1){endTime = "0" +  endTime}
            var startString = startDateGlobal.substring(0, 8) + currDate + "T" + currTime + ":00:00Z";
            var endString = startDateGlobal.substring(0, 8) + currDate + "T" + endTime + ":00:00Z";
            var pref = false;
            if(editPref == "high"){pref = true;}

            axios({
                // add availability to api
                method: 'post',
                url: 'http://localhost:8000/api/1/availabilitypost/',
                data: {
                    "start_time": startString,
                    "end_time": endString,
                    "preference": pref
                }                
            });
        } else {
            // delete availability from api. need to reload to see changes
            temp[index][idx] = ["blank", 0, 0];

            axios({
                method: 'delete',
                url: 'http://localhost:8000/api/availability/' + id +"/",
                data: {}                
            });
        }
        setEditCal(temp);
    }

    const handlePref = () => {
        if(editPref == "high"){
            setEditPref("low")
        } else {
            setEditPref("high")
        }
    }

    useEffect(() => {
        console.log("editCal was updated");
    }, [editCal]);

    // <button onClick={handleSubmit}>go to view responded page</button>         


    return (
        <div>
            <div className="fill-title-wrapper">
                <h1>Temp Calendar</h1>
                <h3>choose preference type</h3>
                <button className={editPref == "high" ? "high-toggle" : "low-toggle"} onClick={handlePref}>{editPref}</button>
            </div>
            <div className="display-calendar">
                <div className="time-column">
                    <h4>Time</h4>
                    {timeSlots?.map((item, idx) => (
                        <div key={idx} className="blank show">{item[0]}</div>
                    ))}
                </div>
                {editCal?.map((inner, index) => (
                    <div key={index} className="time-column">
                        <h4>{dateToDay(index)}</h4>
                        {inner.map((time, idx) => (
                            <div key={idx} className={time[0]} onClick={() => handleButton(index, idx)}>
                                <button className={time[0]+"button"} >.</button>
                            </div>
                        ))}
                    </div>
                ))}
            </div> 
            <div className="fill-title-wrapper">
                <h1 className="updated">Updated Calendar</h1>
                <div className="legend">
                    <div className="legend-item-shared">overlap</div>
                    <div className="legend-item-taken">other user</div>
                    <div className="legend-item-high">you (high)</div>
                    <div className="legend-item-low">you (low)</div>
                </div>
            </div>
            <div className="display-calendar">
                <div className="time-column">
                    <h4>Time</h4>
                    {timeSlots?.map((item2, idx2) => (
                        <div key={idx2} className="blank show">{item2[0]}</div>
                    ))}
                </div>
                {displayCalendarSeparated?.map((inner2, index2) => (
                    <div key={index2} className="time-column">
                        <h4>{dateToDay(index2)}</h4>
                        {inner2.map((time2, idx2) => (
                            <div key={idx2} className={time2[0]}>.</div>
                        ))}
                    </div>
                ))}
            </div>   
        </div>
    );
}