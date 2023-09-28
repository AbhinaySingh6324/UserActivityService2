// SearchBar.js
import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const SearchBar = () => {
    const [message, setMessage] = useState(''); // State for displaying messages
    const [userActivity, setUserActivity] = useState({
        user_id: 1,
        name: 'John', // Add the "name" field
        search_query: '',
        timestamp: new Date().toISOString(),
      });
      
    const trackActivity = () => {
        axios.post('http://localhost:8000/track_activity/', userActivity)
          .then((response) => {
            setMessage(`Activity tracked successfully for ${userActivity.timestamp}: ${response.data.message}`);
           
        })
          .catch((error) => {
            setMessage(`Error: ${error.message}`);
          });

          
      };

      const getMostSearchedTopics = () => {
        axios.get(`http://localhost:8000/most_searched_topics/?name=${userActivity.name}`)
            .then((response) => {
                setMessage(`Top Searched Topics: ${JSON.stringify(response.data.top_searches)}`);
            })
            .catch((error) => {
                setMessage(`Error: ${error.message}`);
            });
      };

  return (
    <div>
    <form >
    <input
          type="text"
          value={userActivity.name}
          onChange={(e) => setUserActivity({ ...userActivity, name: e.target.value })}
        />
      <input
          type="text"
          value={userActivity.search_query}
          onChange={(e) => setUserActivity({ ...userActivity, search_query: e.target.value })}
        />
        <button onClick={trackActivity}>Submit</button>
        <button onClick = {getMostSearchedTopics}>Submit2</button>
    </form>

        {message && <p>{message}</p>}
    </div>
  );
};

export default SearchBar;
