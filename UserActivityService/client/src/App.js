import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style/App.css"; // Import your CSS file for styling

function App() {
  const [userActivity, setUserActivity] = useState({
    user_id: 0, // Make user_id mutable
    name: "",
    search_query: "",
    timestamp: new Date().toISOString(),
  });

  const [message, setMessage] = useState("");
  const [trends, setTrends] = useState(null);

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

  useEffect(()=>{
    getMostSearchedTopics();
  },[])
  const getMostSearchedTopics = () => {
    axios
      .get(
        `http://localhost:8000/most_searched_topics/?name=${userActivity.name}`
      )
      .then((response) => {
        setTrends(
          response.data.top_searches
        );
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
      });
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="title">Datum Intel User Activity</h1>
      </header>
      <div className="form-container">
        <div className="form-group">
          <div className="name">
            <input
              className="input"
              type="text"
              placeholder="Enter your name.."
              value={userActivity.name}
              onChange={(e) =>
                setUserActivity({ ...userActivity, name: e.target.value })
              }
            />
          </div>
        </div>
        <div className="form-group">
          <div className="search-bar">
            <input
              className="input"
              type="text"
              placeholder="Enter text here.."
              value={userActivity.search_query}
              onChange={(e) =>
                setUserActivity({
                  ...userActivity,
                  search_query: e.target.value,
                })
              }
            />
            <div className="buttons">
              <button className="btn green" onClick={trackActivity}>
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="trend">
          <div>
            <div>
              <h2>Trending Searches &#128200;</h2>
            </div>
            <div>
              {trends?(trends.map((trend, index) => {
                return (
                  <div key={index}>
                    <div>{trend}</div>
                    <hr />
                  </div>
                );
              })):null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;