# cache = TTLCache(maxsize=1, ttl=3600)
# cached_data = None
# @app.post("/track_activity/")
# async def track_activity(activity: UserActivity):
#     # Insert the activity into the MongoDB collection
#     collection.insert_one(activity.dict())
#     return JSONResponse(content={"message": "Activity tracked successfully"})

# @app.get("/most_searched_topics/")
# async def most_searched_topics():
#     global cached_data

#     # Check if cached data exists and is not expired
#     if cached_data is not None and cached_data["timestamp"] + cache.ttl > time.time():
#         return JSONResponse(content=cached_data["data"])

#     end_date = datetime.now(timezone.utc)  # Make end_date an aware datetime
#     start_date = end_date - timedelta(days=1)
    
#     # Convert start_date to an aware datetime
#     start_date = start_date.replace(tzinfo=timezone.utc)
    
#     # Query MongoDB for user activities within the specified date range
#     filtered_activities = collection.find({
#         "timestamp": {"$gte": start_date, "$lte": end_date}
#     })

#     # Extract search queries and count occurrences
#     search_queries = [activity["search_query"] for activity in filtered_activities]
#     query_counts = Counter(search_queries)
    

#     top_searches = query_counts.most_common(4)
#     top_search_queries = [t[0] for t in top_searches]

#                                                                                              # Caching the result
#     cached_data = {"timestamp": time.time(), "data": {"top_searches": top_search_queries}}
#     print(cached_data,type(cached_data)) # debugging purposes
#     return JSONResponse(content=cached_data["data"])

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)


import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel
from collections import Counter
from typing import List
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from cachetools import TTLCache
import threading

MONGODB_URL = "mongodb+srv://abhinay:abhinay@cluster0.rgz9j.mongodb.net/?retryWrites=true&w=majority"
DB_NAME = "mydatabase"
mongo_client = MongoClient(MONGODB_URL)
db = mongo_client[DB_NAME]
collection = db["user_activity2"]

app = FastAPI()

# CORS (Cross-Origin Resource Sharing) setup to allow requests from your React.js app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # by default url of reactapp
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserActivity(BaseModel):
    user_id: int
    name: str
    search_query: str
    timestamp: datetime

cache = TTLCache(maxsize=1, ttl=60)  


def update_trending_topics():
    end_date = datetime.now(timezone.utc)  
    start_date = end_date - timedelta(days=1)
    
    # Convert start_date to an aware datetime
    start_date = start_date.replace(tzinfo=timezone.utc)
    
    # Query MongoDB for user activities within the specified date range
    filtered_activities = collection.find({
        "timestamp": {"$gte": start_date, "$lte": end_date}
    })

    # Extract search queries and count occurrences
    search_queries = [activity["search_query"] for activity in filtered_activities]
    query_counts = Counter(search_queries)

    # Get the top 4 searched queries
    top_searches = query_counts.most_common(4)
    top_search_queries = [t[0] for t in top_searches]
    
    # Cache the result
    cached_data = {"timestamp": time.time(), "data": {"top_searches": top_search_queries}}
    cache["trending_topics"] = cached_data
    print(cached_data)

def cache_update_thread():
    while True:
        update_trending_topics()
        time.sleep(60)  # Sleep for 1 hour

update_thread = threading.Thread(target=cache_update_thread)
update_thread.daemon = True
update_thread.start()

@app.on_event("startup")
async def startup_event():
    update_trending_topics()

@app.post("/track_activity/")
async def track_activity(activity: UserActivity):
    # Insert the activity into the MongoDB collection
    collection.insert_one(activity.dict())
    return JSONResponse(content={"message": "Activity tracked successfully"})

@app.get("/most_searched_topics/")
async def most_searched_topics():
    cached_data = cache.get("trending_topics")
    if cached_data:
        return JSONResponse(content=cached_data["data"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
