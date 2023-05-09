# LiveCricketHub - a cricket news and score application

LiveCricketHub is a web application for live cricket updates. It features news articles and live scores of cricket matches. It also includes text ball by ball commentary, player stats and series list. The web application allows the users to comment, reply and like the comments. It also allows the users to add their favourite players and matches to their profile. The application also features a chat room for live matches where the users can chat with other users. The application also allows the users to predict the match results and view the overall prediction.

## Walkthrough video:

## Features

- You can watch the live score of a match.
- Get any match data.
- Visit Player profile and see their stat. Add them your favourite player list.
- Comment, reply and add like to them in the match page.
- Our built-in elastic search engine will search through the users database, and provide most relevant results.
- Can add Favourite player and Save match into your profile.
- In Live matches, there is an option of chat room where you can chat with other users.
- Give match prediction. Watch real time overall predication.

> One stop shop for all cricket fans

## Team Members

- Kaustubh Lohani
- Priyanka Zala
- Rohit Reddy
- Thaarani Subramaniam
- Thirunaavukkarasu Murugesan

## Tech

Technologies we used to build this application!

> Core Technologies

- **React.js** - Front-end framework
- **MongoDb** - our NoSQL database
- **Node.js + Express.js** - Backend server for application serving
- **Redis** - Used for caching user data
- **Firebase** - Used for dynamic authentication
- **Material-UI** - for beautiful front-end components and templates
- **Socket.io** - for real time chat room in the match page

> Independent Technologies

- **Netlify** - The application front end is hosted on Netlify and the backend server is hosted on Heroku
- **ElasticSearch** - fast, text-based search engine to retrieve users from our database

## Setting everything up

What you'll need:

- [Redis](https://redis.io/docs/getting-started/)
- [ElasticSearch](https://www.elastic.co/downloads/elasticsearch)

### ElasticSearch installation

- Download and unzip the Elasticsearch official distribution (available at https://www.elastic.co/downloads/elasticsearch).
- Open the elastic search folder and go to config folder
- Open elasticsearch.yml file and add the following lines

```
xpack.security.enabled: false
```

- Run bin/elasticsearch (or bin\elasticsearch.bat on Windows) from the Elasticsearch root directory.
- Open the browser and go to http://localhost:9200/\_aliases to check if elastic search is running
- Should see something like this

```
{}
```

- Should see something like this, after the users' indices are added to the elastic search database

```
{
  "users": {
    "aliases": {}
  }
}
```

##### Exceptional Cases

- Very rarely you might get an error saying that the port 9200 is already in use, you can run the following command to kill the process

```
sudo kill -9 $(sudo lsof -t -i:9200)
```

## Usage of .env files and firebase service account details

- Please make sure to add the .env files in the root folder of the project [attached with the submission]
- Add the firebase_service_account.json file in the Server folder of the project [attached with the submission]

## Installation

- Clone the repository.
- Run npm i in the server folder.
- Run npm i --force in the client folder. Incase of any errors, run npm audit fix and then npm i --force.
- Run npm start in the server folder.
- Run npm start in the client folder.

## seeding the database

- Run npm run seed in the server folder to seed the database with users. We made sure to add unique users[username and email] to the database which is in sync with the firebase database.
- The matches data is populated into the database automatically once you open the match.
- The comment data is also populated into the database automatically once you add a comment.
