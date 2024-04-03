import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../App.css';



export default function ViewResponded(){
    const navigate = useNavigate();
    // const handleSubmit = () => navigate('/register', { replace: false });
    // const testSelectProducts = () => navigate('/testPage', { replace: false });

    const [availablilties, setAvailabilities] = useState([]);
    const [calendar, setCalendar] = useState([]);
    const [displayCalendar, setDisplayCalendar] = useState([]);
    const [slots, setSlots] = useState(0);
    const [displayCalendarSeparated, setDisplayCalendarSeparated] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [startDateGlobal, setStartDateGlobal] = useState("")
    const [startTimeGlobal, setStartTimeGlobal] = useState("")




    useEffect(() => {
    axios.get('http://localhost:8000/api/calendar/1/availabilities/')
        .then(response => {
        setAvailabilities(response.data);
        })
        .catch(error => {
        console.log(error);
        });
    }, []);

    useEffect(() => {
    axios.get('http://localhost:8000/api/calendar/1/')
        .then(response => {
        setCalendar(response.data);
        })
        .catch(error => {
        console.log(error);
        });
    }, []);

    const generateCalendar = () => {
        let tempArr = []

        // get info on how many time slots there should be
        ////////////////////////////////////
        // assumes one hour slots, pass in element to check if true and multiply num slots by 2 if 30 min slots
        ////////////////////////////////////
        
        let start_time = calendar.start_time;
        let start_hour = parseInt(start_time.split(":")[0], 10);
        let end_time = calendar.end_time;
        let end_hour = parseInt(end_time.split(":")[0], 10);
        let num_slots = end_hour - start_hour
        setSlots(num_slots)
        setStartTimeGlobal(start_hour)

        // get info on how many days in a calendar
        let startDateString = calendar.start_date
        let endDateString = calendar.end_date
        let startDate = new Date(startDateString);
        let endDate = new Date(endDateString);
        let differenceInMs = endDate - startDate;
        let num_days = (differenceInMs / (1000 * 60 * 60 * 24)) + 1;
        setStartDateGlobal(startDateString)

        for(let i = 0; i < num_days+1; i++){
            for(let j = 0; j < num_slots; j++){
                if(i == 0){
                    let time = (j + start_hour) % 12
                    if (time == 0){ time = 12}
                    let tempStr = time + ":00 - " + (time+1) + ":00";
                    tempArr.push(tempStr)
                } else{
                    let tempStr = "blank";
                    tempArr.push(tempStr)
                }
            }            
        }
        setDisplayCalendar(tempArr);

        // put calendar in the form to display (separate into arrays of arrays, where each inner array is a column)
        let temp = [];
        let newArr = [];
        // console.log(slots)
        for(let i = 0; i < displayCalendar.length; i = i + slots){
            for(let j = 0; j < slots; j++){
                temp.push([displayCalendar[i+j], 0])                
            }
            newArr.push(temp);
            temp = [];
        }
        setDisplayCalendarSeparated(newArr.slice(1))
        setTimeSlots(newArr[0])

        // update calendar for each availablilty
        if(availablilties != undefined){
        for(let i = 0; i < availablilties.length; i++){
            let start = availablilties[i].start_time;
            let avDate = ""

            avDate = start.substring(0, 10)
            avDate = new Date(avDate);
            if(!startDateGlobal){break}
            let startDateGlobaltemp = new Date(startDateGlobal)
            let differenceInMs = avDate - startDateGlobaltemp;
            // how far from the start date it is
            let dayIndex = Math.round(differenceInMs / (1000 * 60 * 60 * 24));

            let timeIndex = 0;

            if(start){
                start = parseInt(start.substring(11, 13));
                timeIndex = start - startTimeGlobal
            }

            let pref = false;
            let user = 0;
            let prefClass = "blank";
            if(typeof availablilties[i].preference === undefined){ continue } else{
                pref = availablilties[i].preference;
                if(pref) {prefClass = "high"} else {prefClass = "low"}
                user = availablilties[i].user;
            }

            if(displayCalendarSeparated.length <1){break}
            let dispCopy = displayCalendarSeparated;

            dispCopy[parseInt(dayIndex)][parseInt(timeIndex)] = [prefClass, user]; 
            setDisplayCalendarSeparated(dispCopy);
        }
        }
    };


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

    return (
        <div>
            <button onClick={generateCalendar}>update / reload calendar</button>
            <div className="display-calendar">
                <div className="time-column">
                    <h2>Time</h2>
                    {timeSlots?.map((item, idx) => (
                        <div key={idx} className="blank">{item[0]}</div>
                    ))}
                </div>
                {displayCalendarSeparated?.map((inner, index) => (
                    <div key={index} className="time-column">
                        <h2>{dateToDay(index)}</h2>
                        {inner.map((time, idx) => (
                            <div key={idx} className={time[0]}>{time[1]}</div>
                        ))}
                    </div>
                ))}
            </div>            
        </div>
    );
}