

import  { useEffect, useState, useRef, createRef } from 'react';
import axios from 'axios';
import './suggestedmeetings.css';
import SuggestedMeetingCalendar from './SuggestedMeetingCalendar';

// API CALL TO GET SUGGESTED MEETINGS FOR A CALENDAR, return the meetings in a page. 

// TODO: Finalize meetings buttoncontacts page
const ITEM_WIDTH = 200;


function SuggestedMeetings(props) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingA, setLoadingA] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [calendar, setCalendar] = useState(null);
    const [swapValues, setSwapValues] = useState(null);
    const [user, setUser] = useState(null);
    const [displayArr, setDisplayArr] = useState([]);
    const [indexArr, setIndexArr] = useState([]);
    const [indexOne, setIndexOne] = useState(null);
    const [indexTwo, setIndexTwo] = useState(null); 
    const [key, setKey] = useState(-1);
    const [create, setCreate] = useState(false);
    var curr = 0;
    const containerRef = useRef();
    const meetingRef = useRef([]);

    if (meetingRef.current.length !== 5) {
      meetingRef.current = Array(5).fill().map((_, i) => meetingRef.current[i] || createRef());
    }
    const meetingContainerRef = useRef();
    const swapRef = useRef();
    //scrolling function
    
    const updateSwapRef = (displayArr, responseArr, indexArr, user, indexOne, indexTwo) => {
      setIndexArr(indexArr);
      setIndexOne(indexOne);
      setIndexTwo(indexTwo);
      setDisplayArr(displayArr);
      setUser(user);
      setSwapValues(responseArr); 
      setKey(key + 1);
      console.log(swapValues)
    };

    const swap = (displayArr, indexOne, indexTwo, indexThree, indexFour) => {
      
      let selected = meetingRef.current[key].current.children[0];

      // Go to the element at indexOne, indextwo
      selected.children[1 + indexOne].children[1 + indexTwo].innerHTML = displayArr[indexThree][indexFour][1];
      selected.children[1 + indexThree].children[1 + indexFour].innerHTML = displayArr[indexOne][indexTwo][1];

      setDisplayArr(displayArr);
      setSwapValues(null);
      setUser(null);
    };
    
    const handleScroll = (scrollAmount) => {
        const newScrollPosition = scrollPosition + scrollAmount;
        
        if (newScrollPosition < 0) return;
        else if (newScrollPosition >= meetingContainerRef.current.offsetWidth) return;
        if (scrollAmount > 0) {
          curr += 1;
        }
        else {
          curr -= 1;
        }
        console.log(curr);
        setScrollPosition(newScrollPosition);

        containerRef.current.scrollLeft = newScrollPosition
    };

    const finalize = () => {
      // finalize curr meeting, using the displayArr 
      
      let meetingsarr = []
      for (let i = 0; i < displayArr.length; i++) {
        for (let j = 0; j < displayArr[i].length; j++) {
          
          if (displayArr[i][j][1] !== 0 && displayArr[i][j][1] !== null) {
            meetingsarr.push(displayArr[i][j]);
        }
      }
    }
      console.log(meetingsarr);

      setCreate(true)
      let j = 0;
      console.log(user)
      //////////////////////////////////////////////////////////////////////////////
      // PLEASE CHANGE THIS TO USER AND SET THE CORRECT CURRENT USER OF THE PAGE // 
      //////////////////////////////////////////////////////////////////////////////
      for (let i = 0; i < meetingsarr.length; i++) {
        axios.post('http://127.0.0.1:8000/api/createmeeting/', {
          "user1": "Ty",
          "user2": meetingsarr[i][1],
          "start_time": meetingsarr[i][2],
          "duration": 60,
      }).then(response => {
        // meeting created
        console.log(response.data);
        j += 1;
        if (j >= meetingsarr.length) {
          setCreate(false)
        }
      }).catch(error => {
        console.log(error);
      });

      
      };
    
      // wait
      
    // go to meetings page. 

      // route to meeting page

    }


  useEffect(() => {
    setLoading(true);
    setLoadingA(true);

    // TODO: api call, change 5 to calendar number
    axios.get('http://127.0.0.1:8000/api/5/suggestedmeetings/', {
      //'http://127.0.0.1:8000/api/' + props.calendarID + '/suggestedmeetings/'
        headers: {
            'Content-Type': 'application/json',

    }})
      .then(response => {
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.log(error)
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('Server responded with non-2xx status:', error.response.status);
            console.log('Response data:', error.response.data);
            console.log('Response headers:', error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.log('No response received from server:', error.request);
            console.log('Error Message', error.message);
           
            // Check if it's a CORS error
            if (error.message === 'Network Error' && error.request.url && error.request.url.startsWith('https://')) {
              console.log('Possible CORS error: Request made to a different domain without proper CORS headers');
            }
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error setting up the request:', error.message);
          }
  
        }, []);
        axios.get('http://localhost:8000/api/calendar/5/')
            .then(response => {
              console.log(response.data);
            setCalendar(response.data);
            setLoadingA(false);
            })
            .catch(error => {
            console.log(error);
            });
      }, []);




  useEffect(() => {
    const ITEM_WIDTH = containerRef.current;
    console.log(ITEM_WIDTH);
    }, []);

  if (loading || loadingA) {
    return <div>Loading...</div>;
  }
  return (
    <div className='big-container'>
    <div className="swaps" ref={swapRef} >
      <h4> {user} </h4>
      {swapValues?.map((value, index) => (
        console.log(value),
        <div key={index}>
          
        <p> {value} </p>
        <button key={index} onClick={() => swap(displayArr, indexOne, indexTwo, indexArr[index][0], indexArr[index][1])}> Swap </button>
        </div>
        ))}

      </div>
    <div className='container'>
      <div className='container-ref' ref={containerRef} style={{
        width: "80vw",
        overflowX: "scroll",
        scrollBehavior: "smooth",
      }} >
        <div className='meetings-container' ref={meetingContainerRef}>
            {data.map((meeting, index) => ( (
                <div className="meeting" key={index} ref={meetingRef.current[index]}> 
                      <SuggestedMeetingCalendar key={index} meeting={meeting.meetings} calendar={calendar} updateSwapRef={updateSwapRef} setDisplayArr={setDisplayArr} setUser={setUser}/>
                        
                </div>
            )))}
      </div>
    </div>
        <div className='action-btns'> 
            <button onClick={()=>handleScroll(-meetingRef.current[1].current.offsetWidth)}> Scroll Left</button>
            <button onClick={()=>handleScroll(meetingRef.current[1].current.offsetWidth)}> Scroll Right</button>
            <button onClick={()=>finalize()}> Finalize</button>
        </div>
    </div>
    </div>
  );
}

export default SuggestedMeetings;