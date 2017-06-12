Eli's Credly project, based on the defaul laravel project, at https://github.com/laravel/laravel .

To install, just copy .env.example to .env, and set CREDLY_API_KEY and CREDLY_API_SECRET using your Credly app credentials.


== Known issues ==
* Drag and drop: The drag and drop UI adds the badge visually, but the badge is gone on page refresh. The response to the /member_badges POST is the current list of badges. I'm probably misinterpreting the API.
* CSS size: I’m including bootstrap CSS, but using only a tiny fraction of it. The page could be made much lighter weight with custom CSS.
* Loading states: There's no loading state when you click "show badges" on a member.
* “Show Badges” UI: I would like to have loaded the members’ badges right away, rather than having a “show badges” button, but the API throttling got in the way. I could have throttled the http requests, but that could result in a poor user experience if multiple users were logged in at once. A Credly API call to get an abbreviated view of multiple members’ badges would solve this problem.
* Multiple JS files: Angular is fetched from a public URL, and the drag and drop code is not rolled up into app.js. There should be two rollups – app.js for project code (short cache duration) and a second file for Angular and other third party code (long cache duration).

== Features I would like to have added ==
* Authentication: I used custom authentication code in CredlyAPI.php. It would have been more appropriate to create new Laravel middleware to do Credly authentication.
* Pagination: Only the first 20 contacts and badges are shown. I decided to defer pagination, because it wouldn’t have shown you anything about my coding ability to simply have copied and pasted infinite scroll code.
* Modularization: If this app were to become more complex, it would be necessary to break the UI into multiple Laravel and Angular components.
* Browser compatibility: Making this app work on older browsers (IE 8-10) would take an additional hour or so.
* Better error handling: Login-related errors are handled, but I did not handle API throttling errors and other API errors. There are TODOs in the code to represent this.
* Badge Creation / Adding Contacts: To make this app complete, it should be possible to create new badges and add contacts.
