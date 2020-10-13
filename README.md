Phonebook App

https://immense-sierra-99999.herokuapp.com/api/persons

The main focus of this project was on the API, the back-end server and MongoDB code, with the front-end React content visible to the end-user there mainly as a way of interacting with the API, so it is largely un-styled, however it is still a fully functional phonebook app.

It is built with a React front-end with a few simple components (filter, notification, person form, person list), with state management handled via pure React Hooks. I used Express and Axios to manage the server and API, and wrote my own middleware using Morgan for message logging. The back-end is written in Node.js, and the phonebook entries are stored in MongoDB, with Mongoose acting as the go-between.

Via all I mentioned above, an end user at the moment can:
* Filter phonebook entries
* Add new names + numbers (with validation checks to make sure the incoming data isn't junk)
* Delete entries
* Update existing entries (by entering an existing name with a new number)
* Notification messages are displayed in the app for each successful/unsuccessful attempt at the above