# LiveCricketHub - a cricket news and score application

LiveCricketHub is a web application for live cricket updates. It features news articles and live scores of cricket matches. It also includes text ball by ball commentary, player stats and series list. The web application allows the users to comment, reply and like the comments. It also allows the users to add their favourite players and matches to their profile. The application also features a chat room for live matches where the users can chat with other users. The application also allows the users to predict the match results and view the overall prediction.

## Walkthrough video:

[Live Cricket Hub](https://youtu.be/0HzfVhjCL9M)

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

- **Amazon EC2** - The application backend is hosted on Amazon EC2
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
- Run npm ci --force in the client folder. Incase of any errors, run npm audit fix --force.
- Run npm start in the server folder.
- Run npm start in the client folder.

## Seeding the database

- There is no need to seed the database, as the database is already seeded (MongoDB Atlas).

## The Backend:

`Note: If you're just looking to run the backend on your local machine, skip to point 3 under "EC2 Public URL" heading`

By default, the app depends on a server that runs locally. However, our backend is also hosted on an EC2 instance running in AWS infrastructure. The server is currently turned off, but to login and start the server, follow the below steps:

1. Navigate to: https://516997594963.signin.aws.amazon.com/console
2. Enter the credentials provided along with the given submission:
3. Once logged into the console, navigate to the EC2 service (https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#Instances:instanceState=running) and you will find an instance called 'cs554-livecrickapp'
4. Select the instance and start it by navigating to "Instance State -> Start Instance"
5. The server is configured in a way that all the necessary services are started on boot, and you shouldn't have to ssh into the instance to start anything manually.

## The EC2 Public URL:

1. Once the server is started, copy the _public DNS name_ of the running instance from the instance details below. Usually, it looks something like `ec2-3-**-**-***.compute-1.amazonaws.com`.
2. Navigate to the Client's root directory and paste this URL inside the .env file under entries `EC2_HOST`, `CHAT_SERVER_HOST` as :

```
REACT_APP_EC2_HOST=http://ec2-3-**-**-***.compute-1.amazonaws.com:3001
REACT_APP_CHAT_SERVER_HOST=http://ec2-3-**-**-***.compute-1.amazonaws.com:3002
```

3. If you're just looking to run the backend locally, fill the .env file like this:

```
REACT_APP_EC2_HOST=http://localhost:3001
REACT_APP_CHAT_SERVER_HOST=http://localhost:3002
```

_IMP: Make sure NOT to include any trailing slashes in the URL._

# INSTANCE SHUTDOWN

Please remember to shutdown the instance once you're done with your work. This is to avoid unnecessary charges to the account.
