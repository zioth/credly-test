Eli's Credly project, based on the defaul laravel project, at https://github.com/laravel/laravel .

To install, just copy .env.example to .env, and set CREDLY_API_KEY and CREDLY_API_SECRET using your Credly app credentials.


== Known issues ==
* The client sends the username and password in url parameters for the authenticate action. The Angular documentation says I'm calling $http() the way
  I should if I want to move the params into the request body, but it does not seem to be working. This would obviously block the release of production code.
* I’m including bootstrap CSS, but using only a tiny fraction of it. The page could be made much lighter weight with custom CSS.
* There's no loading state when you click "show badges" on a member.
* I would like to have loaded the members’ badges right away, rather than having a “show badges” button, but the API throttling got in the way. I could
  have throttled the http requests, but that could result in a poor user experience if multiple users were logged in at once. A Credly API call to get
  an abbreviated view of multiple members’ badges would solve this problem.

== Features I would like to have added ==
* The UI looks a little strange right now -- why do you see a list of created badges if you can't do anything with them? The reason is that I wanted to
  make it possible to drag a badge onto a contact using a POST to the /member_badges API. Unfortunately, I ran out of time before I could implement this feature.
* I used custom authentication code in CredlyAPI.php. I would like to have created new Laravel middleware to do Credly authentication.
* Pagination: It would have been easy to copy the infinite scrolling code from the demo interview project, and that would have told you nothing about my coding ability, so I decided to defer it.
* If this app were to become more complex, it would be necessary to break the UI into multiple Laravel and Angular components.
* Browser compatibility: Making this app work on older browsers (IE 8-10) would take an additional hour or so.
* Better error handling. Login-related errors are handled, but I did not handle API throttling errors and other API errors.


== My process ==
I wanted to use as much of the Credly stack as possible, so in addition to Laravel, I used Angular and a cloud hosting instance (Digital Ocean instead of AWS).
Since I started out with no Angular or Laravel experience, I spent several hours familiarizing myself with the Credly API and Laravel, and used your credly-php-js
project as a starting point for the Angular code. I tried to leave comments on the parts that I copied wholesale. In the end, it wasn't very much.

Since your main concern about me was ramp-up time, I'll say that I spent several hours figuring out the best way to install Laravel, learning how it works, figuring out
angular interoperability, and getting a very basic project up. After that, I did the actual project that was requested. Most of this happened over the course of one
non-exclusive day.


- Problems with Credly API:
	- Can’t get multiple member’s data at once.
	- Requests are generally very small.
	- Can’t do anything and fetch data at the same time.
	- “Member badges” API response is incredibly verbose.
- Say to Alex:
	- Ramp-up time.
