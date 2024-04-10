 
 
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SuggestedMeetingCalendar = (props) => {
    // const handleSubmit = () => navigate('/register', { replace: false });
    // const testSelectProducts = () => navigate('/testPage', { replace: false });
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [displayCalendarSeparated, setdispalyCalendarSeparated] = useState(null);
    var startDateGlobal = null;
    var startTimeGlobal = null;
    var calendar = props.calendar;



    require('../App.css');
    useEffect(() => {
        setLoading(true);
    const generateCalendar = () => {
        
        var tempArr = []

        // get info on how many time slots there should be
        ////////////////////////////////////
        // assumes one hour slots, pass in element to check if true and multiply num slots by 2 if 30 min slots
        ////////////////////////////////////
        var calendar = props.calendar;
        let start_time = calendar.start_time;
        var start_hour = parseInt(start_time.split(":")[0], 10);
        startTimeGlobal = start_hour;
        let end_time = calendar.end_time;
        let end_hour = parseInt(end_time.split(":")[0], 10);
        var num_slots = end_hour - start_hour
        var slots = num_slots
        
        // get info on how many days in a calendar
        var startDateString = calendar.start_date
        let endDateString = calendar.end_date
        let startDate = new Date(startDateString);
        let endDate = new Date(endDateString);
        let differenceInMs = endDate - startDate;
        let num_days = (differenceInMs / (1000 * 60 * 60 * 24)) + 1;
        startDateGlobal = startDate;
        
        for(let i = 0; i < num_days+1; i++){
            if (i === 0) {
            for(let j = 0; j < num_slots; j++){
                    let time = (j + start_hour) % 12
                    if (time == 0){ time = 12}
                    let tempStr = time + ":00 - " + (time+1) + ":00";
                    tempArr.push(tempStr)
            }}
            else {
                for(let j = 0; j < num_slots ; j++){
                    let tempStr = "blank";
                    tempArr.push(tempStr)
                }
            }            
        }
       
        
        var displayCalendar = tempArr;
        // put calendar in the form to display (separate into arrays of arrays, where each inner array is a column)
        let temp = [];
        let newArr = [];
        // console.log(slots)
        for(let i = 0; i < displayCalendar.length; i = i + slots){
            let temp = [];
            if (i !== 0) {
                temp.push(['blank', 0])
            }
            for(let j = 0; j < slots; j++){
                temp.push([displayCalendar[i+j], 0])
       
            }
            
            newArr.push(temp);
        }
        
        var displayCalendarSeparated = newArr.slice(1)
        setTimeSlots(newArr[0])

        let availablilties = props.meeting; // start time, end time, user
        // update calendar for each availablilty // change for my purposes
        for (let i = 0; i < displayCalendarSeparated.length; i++) {
            var dispCopy = displayCalendarSeparated;
            let startDateGlobaltemp = new Date(startDateGlobal)
            startDateGlobaltemp.setDate(startDateGlobaltemp.getDate() + i);
            dispCopy[i][0] = [null , null, null, startDateGlobaltemp.getDay()];   
        }
        if(availablilties != undefined){
            for(let i = 0; i < availablilties.length; i++){
            let start = availablilties[i].start_time;
            let avDate = ""

            avDate = start.substring(0, 10)
            avDate = new Date(avDate);
            
            if(startDateGlobal) {
            let startDateGlobaltemp = new Date(startDateGlobal)
            let differenceInMs = avDate - startDateGlobaltemp;
            // how far from the start date it is
            let dayIndex = Math.round(differenceInMs / (1000 * 60 * 60 * 24)); // start from 0

            let timeIndex = 0;
            
            if(start){
                start = parseInt(start.substring(11, 13));
                timeIndex = start - startTimeGlobal
            }

            let pref = false;
            let user = "";
            let prefClass = "blank";
            user = availablilties[i].user;
            
            
            if(displayCalendarSeparated.length >=1){
            
            dispCopy[parseInt(dayIndex)][parseInt(timeIndex)] = [prefClass, user, availablilties[i].start_time, avDate.getDay(), availablilties[i].end_time];   
            
            setdispalyCalendarSeparated(dispCopy);
            setLoading(false);
            props.setDisplayArr(dispCopy);
            }
            }
        }
        
        }
    };
    generateCalendar();
    }, []);

    const swapPositions = (indexOne, indexTwo, indexThree, indexFour) => {
        displayCalendarSeparated[indexThree][indexFour] = displayCalendarSeparated[indexOne][indexTwo];
        displayCalendarSeparated[indexOne][indexTwo] = 0;
        props.updateSwapRef([], "");
    }
    

    const swapAvailabilities = (indexOne, indexTwo) => {
        // given indexOne, get the user's temp availabilities and then show all timeslots that are available for that user
        // in the special case that there is another user's availability at that time, send an api request to determine if the users can swap availabilities

        // get the user's availabilities
        let user = displayCalendarSeparated[indexOne][indexTwo][1];
        let curr = displayCalendarSeparated[indexOne][indexTwo];
        console.log(displayCalendarSeparated)

        axios.post("http://127.0.0.1:8000/api/tempavailbitiesbyname/", {
            "username": user,
            "calendar": 5
        
        }).then(response => {
            // response
            
            let availabilities = response.data;
            let responseArr = [];
            let indexArr = [];
            var startDateString = calendar.start_date
            let startDate = new Date(startDateString);
            startDateGlobal = startDate;
            let start_time = calendar.start_time;
            var start_hour = parseInt(start_time.split(":")[0], 10);
            startTimeGlobal = start_hour;
            
            let tempavail = []
            // need to convert avalibities to one hour time slots
            for (let i = 0; i < availabilities.length; i++) {
                let temp = new Date(availabilities[i].start_time);
                let end = new Date(availabilities[i].end_time);
                while (temp < end) {
                    let next = new Date(temp.valueOf())
                    next.setHours(next.getHours() + 1);
                    tempavail.push([temp, next, user]);
                    temp = next;

                }

            }

            availabilities = tempavail;
            for (let i = 0; i < availabilities.length; i++) {
                
                let start = availabilities[i][0].toISOString();
                let avDate = ""

                avDate = start.substring(0, 10)
                avDate = new Date(avDate);
               
                if(startDateGlobal === "undefined") {break}
                let startDateGlobaltemp = new Date(startDateGlobal)
                let differenceInMs = avDate - startDateGlobaltemp;
                // how far from the start date it is
                let dayIndex = Math.round(differenceInMs / (1000 * 60 * 60 * 24));

                let timeIndex = 0;
             
                if(start){
                    start = parseInt(start.substring(11, 13));
                    timeIndex = start - startTimeGlobal
                }

                
              
                let temp = null;
                console.log(curr)
                if (curr[2]) {
                temp = new Date(curr[2])
                console.log(temp.valueOf() === availabilities[i][0].valueOf())
                console.log(!curr[2] || !curr[4] || !curr[1]|| !temp)
                }
                if (temp && temp.valueOf() === availabilities[i][0].valueOf()) {

                    continue;
                }
                else if (curr[1] !== "" || curr[1] !== 0) {
                    let date = avDate.getDay();
                    responseArr.push(dateToDay(date) + " from: " + start + ":00 to " + (start+1) +":00.");
                    indexArr.push([dayIndex, timeIndex])
                }
                else{
                    // there is something here, check if the users can swap
                    ///////////////////////////////////////
                    // TODO: Change 5 to calendarid
                    ///////////////////////////////////////
                    axios.post("http://127.0.0.1:8000/api/5/movingsuggested/", 
                    {
                            "first": {
                                "start_time": availabilities[i][0].toISOString(),
                                "end_time": availabilities[i][1].toISOString(),
                                "preference1": false,
                                "preference2": false,
                                "user": user,
                        },
                            "second": {
                                "start_time": curr[2],
                                "end_time": curr[4],
                                "preference1": false,
                                "preference2": false,
                                "user": curr[1],
                            }
                        
                    }).then(response => {
                        if (response.data === "Valid Swap") {
                            // add to responseArr
                            let date = avDate.getDay();
                            responseArr.push("Day: " + dateToDay(date) + ". From: " + start + " to " + (start+1) +".");
                            indexArr.push([dayIndex, timeIndex])
                        }
                        
                    }).catch(error => {
                        console.log(error)
                    });
                
                
                }
            }
            console.log(responseArr)
            // take data in responseArr, push it into html element
            console.log(indexArr)
            props.updateSwapRef(displayCalendarSeparated, responseArr, indexArr, user, indexOne, indexTwo);
        }).catch(error => {
            console.log(error)
        });


    }



    const dateToDay = (date) => {
        let i = date ;
        
        if (i === 0){return("Monday")}
        else if (i === 1){return("Tuesday")}
        else if (i === 2){return("Wednesday")}
        else if (i === 3){return("Thursday")}
        else if (i === 4){return("Friday")}
        else if (i === 5){return("Saturday")}
        else if (i === 6){return("Sunday")}
        else {console.log("error in dateToDay")}
    };
    if (!loading) {
    return (
        <>
            <div className="display-calendar">
                <div className="time-column">
                    <h2>Time</h2>
                    {timeSlots?.map((item, idx) => (
                        <div key={idx} className="blank">{item[0]}</div>
                    ))}
                </div>
                {displayCalendarSeparated?.map((inner, index) => (

                    <div key={index} className="time-column">
                        <h2>{dateToDay(inner[0][3])}</h2>
                        {inner?.map((time, idx) => (
                            <div key={idx} className={time[1] !==0 ? time[0] + " clickable": time[0] } onClick={time[1] !== 0 ? () => swapAvailabilities(index, idx) : undefined}> {time[1]}  </div>
                            
                        ))}
                    </div>
                ))}
            </div>            
        </>
    );
    } 
};

export default SuggestedMeetingCalendar;

