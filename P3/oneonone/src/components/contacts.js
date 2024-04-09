
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Contacts = () => {

    const [loading, setLoading] = useState(true);
    const [contacts, setContacts] = useState([]);
    /////////////////////////////////////////////////////
    // UPDATE USER ID TO WHAT AUTH SAYS
    /////////////////////////////////////////////////////
    useEffect(() => {
        setLoading(true);
        axios.get("http://127.0.0.1:8000/api/10/contacts/").then(response => {

            if (contacts.length == 0) {
                contacts.push(response.data);
            }
            
            setContacts([...contacts]);
            console.log(contacts);
            setLoading(false);
    }
    ).catch(error => {
        console.log(error);
        setLoading(false);
    });
    }, []);
    
    if (loading) {
        return <h1> Loading... </h1>
    }
    require('./profile.css');
    require('./contacts.css');
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
                        <a href="meetings_page.html" class="hover:opacity-80">Meetings</a>
                        <a href="create-meeting.html" class="hover:opacity-80">Schedule Meetings</a>
                        <a href="contacts.html" class="hover:opacity-80">Contacts</a>
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
        <div class="mainContainer" id="mainContainer"> 
            <div class="addContainer">
                <form action="http://127.0.0.1:8000/api/10/contacts/" method="post"> 
                    <label for="email" > Email: </label>
                    <input type="email" name="email"/>
                    <input type="hidden" value="10" name="user"/>
                    <input type="submit" value="Submit" class="submit"/>
                </form>
            </div>
            <div class="contactsContainer">
                <h2 class="contactsName"> Contacts </h2>
                
                {contacts[0].map((contact, index) => (
                    <div key={index} class="contactBox"> 
                    <img src="Clouds.png" height="80px" width="80px"/> 
                    <div class="textBox">
                    <h4> {contact.contact_id} </h4>
                    <p> {contact.contact_email} </p>
                    <p> {contact.id} </p>
                    </div>
                </div>
                ))} 
                
            </div>
        </div>

    </body>

    )
}

export default Contacts;
