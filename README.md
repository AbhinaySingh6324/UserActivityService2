# UserActivityService2
 ## -Client folder is the Frontend part of the service exposed at  port::3000.
 ## -The UserActivityProject.py is the  sole back-end part of the service exposed at port::8000.
 ## -Used a caching strategy to reduce api calls on the database an used a standalone thread for periodic calling of the cache update function.
 ## -Having a separate thread allows us to perform cache updates without hindering the api calling process.
