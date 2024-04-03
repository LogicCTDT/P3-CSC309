

import  { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './suggestedmeetings.css';
// API CALL TO GET SUGGESTED MEETINGS FOR A CALENDAR, return the meetings in a page. 
URL = '127.0.0.1:8000'

const ITEM_WIDTH = 200;


function SuggestedMeetings(props) {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);

    const containerRef = useRef();
    const meetingRef = useRef();
    const meetingContainerRef = useRef();
    //scrolling function
    const handleScroll = (scrollAmount) => {
        const newScrollPosition = scrollPosition + scrollAmount;
        
        if (newScrollPosition < 0) return;
        else if (newScrollPosition >= meetingContainerRef.current.offsetWidth) return;
        setScrollPosition(newScrollPosition);

        containerRef.current.scrollLeft = newScrollPosition
    };
  useEffect(() => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/5/suggestedmeetings/', {
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
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const ITEM_WIDTH = containerRef.current;
    console.log(ITEM_WIDTH);
    }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className='container'>
      <div className='container-ref' ref={containerRef} style={{
        width: "80vw",
        overflowX: "scroll",
        scrollBehavior: "smooth",
      }} >
        <div className='meetings-container' ref={meetingContainerRef}>
            {data.map((meeting, index) => ( (
                <div className="meeting" key={index} ref={meetingRef}> 
                    <p> {meeting.user}</p>
                    {meeting.meetings.map((meetinginfo, index) => (
                        <div className="meetinginfo" key={index}>
                        <p>{meetinginfo.start_time} {meetinginfo.end_time} {meetinginfo.preference1} {meetinginfo.preference2} {meetinginfo.user}</p>
                        </div>
                        ))}
                </div>
            )))}
      </div>
    </div>
        <div className='action-btns'> 
            <button onClick={()=>handleScroll(-meetingRef.current.offsetWidth)}> Scroll Left</button>
            <button onClick={()=>handleScroll(meetingRef.current.offsetWidth)}> Scroll Right</button>
        </div>
    </div>
  );
}

export default SuggestedMeetings;