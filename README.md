## Weird game!!!
A game I made for my mom because she needed a game to host for people.

I used this project to learn the basics of connecting devices with databases. I also used this project to learn the basic of SolidJS. 

I used supabase to connect devices, and SolidJS for the frontend.

I removed my supabase url and anon key from the project, so you would have to use your own. In the src directory, add a file called `AppConfig.ts`. Add your url and anon key there, and import it wherever you need. You could also use a `.env` file, but I didn't know how to do that, so I just created a typescript config file.

Also, for the database table name and column name, the only place you should have to change them is the `GameData.ts` file. That's the file that connects the app to the database. If there is somewhere else where I referenced the database, then... shit
