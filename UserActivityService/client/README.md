Caching with TTL (Time-to-Live):

The cache used in this mechanism is a TTLCache (Time-to-Live Cache) provided by the cachetools library. This type of cache allows you to set a maximum size for the cache (in this case, a maxsize of 1) and a time-to-live (TTL) for cached items (1 hour in this case).
The maxsize specifies the maximum number of items that can be stored in the cache simultaneously. When the cache is full, adding a new item will evict the oldest item to make space for the new one.
Update Function with Database Query:

The update_trending_topics function is responsible for calculating and updating the trending topics.
It queries the MongoDB database for user activities within the last 24 hours (1 day). You can adjust this time window as needed.
It extracts the search queries from the database results and counts the occurrences of each query using a Counter.
Caching the Result:

After calculating the top 4 searched queries, the function creates a cached_data dictionary containing a timestamp and the data itself.
This cached_data is stored in the cache under the key "trending_topics".
The timestamp is used to track when the data was cached.
Periodic Cache Updates:

To ensure that the cache remains up to date without relying on API requests, a separate thread (cache_update_thread) is started when the application starts.
This thread runs the update_trending_topics function periodically, in this case, every hour (time.sleep(3600)).
It ensures that the cache is refreshed with the latest trending topics without impacting the responsiveness of the API.
Cache Initialization on Startup:

When the FastAPI application starts (@app.on_event("startup")), the cache is initialized with the first set of trending topics. This provides initial data to serve until the first cache update occurs.
API Endpoint Using Cache:

The /most_searched_topics/ API endpoint checks if the cache contains "trending_topics" data (cache.get("trending_topics")).
If the data exists and is not expired (based on the TTL), it is served as the response, reducing the need to query the database.
If the cache is empty or expired, the endpoint triggers a cache update by calling update_trending_topics(), ensuring that the next request will have up-to-date data.
This caching mechanism effectively reduces the load on the database, improves API response times, and ensures that the data served to clients is frequently updated without compromising performance. It's particularly useful for scenarios where the same data is requested frequently by multiple clients.