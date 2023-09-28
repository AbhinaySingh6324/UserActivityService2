import React, { useState } from 'react';
import axios from 'axios';
import './style/App.css'; // Import your CSS file for styling

function App() {
  const [userActivity, setUserActivity] = useState({
    user_id: '', // Make user_id mutable
    name: 'John',
    search_query: '',
    timestamp: new Date().toISOString(),
  });

  const [message, setMessage] = useState('');

  const trackActivity = () => {
    axios
      .post('http://localhost:8000/track_activity/', userActivity)
      .then((response) => {
        setMessage(
          `Activity tracked successfully for ${userActivity.timestamp}: ${response.data.message}`
        );
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
      });
  };

  const getMostSearchedTopics = () => {
    axios
      .get(`http://localhost:8000/most_searched_topics/?name=${userActivity.name}`)
      .then((response) => {
        setMessage(`Top Searched Topics: ${JSON.stringify(response.data.top_searches)}`);
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
      });
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="title">FastAPI and React.js Integration</h1>
      </header>
      <div className="form-container">
        <div className="form-group">
          <label className="label">User ID:</label>
          <input
            className="input"
            type="text"
            value={userActivity.user_id}
            onChange={(e) => setUserActivity({ ...userActivity, user_id: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="label">Name:</label>
          <input
            className="input"
            type="text"
            value={userActivity.name}
            onChange={(e) => setUserActivity({ ...userActivity, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="label">Search Query:</label>
          <input
            className="input"
            type="text"
            value={userActivity.search_query}
            onChange={(e) =>
              setUserActivity({ ...userActivity, search_query: e.target.value })
            }
          />
        </div>
        <div className="buttons">
          <button className="btn green" onClick={trackActivity}>
            Track Activity
          </button>
          <button className="btn black" onClick={getMostSearchedTopics}>
            Get Most Searched Topics
          </button>
        </div>
      </div>
      <div>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default App;
