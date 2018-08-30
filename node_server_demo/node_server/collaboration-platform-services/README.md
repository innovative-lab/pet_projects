# collaboration-platform-services
This app is the backend server for the rest apis

# Underlying Technologies
 - [Node.js](https://nodejs.org/en/docs/) (javascript runtime)

 - [Express.js](http://expressjs.com/) (Web Application Framework)

 - [MongoDB](https://www.mongodb.org/)(document database)

#### Prerequisites to run this app

The App requires the following major dependencies:

 - git, for Centralized Version Control Systems and bower packages.

 - Node.js, used to run JavaScript tools from the command line.

 - npm, the node package manager, installed with Node.js and used to install Node.js packages.

#### To install dependencies

1) Check if git is installed using `git --version`.  If not, install git from :
```sh
https://git-scm.com/downloads 
```

2)  Check your Node.js version.

```sh
node --version
```

The version should be at or above 0.10.x.

3)  If you don't have Node.js installed, or you have a lower version, install node from:

```sh
https://nodejs.org
```

## Steps to get started with app

#### Get the Code
1) Check out the code from 

```sh
https://git-cto.mindtree.com/opcoe/collaboration-platform-services
```

2) Copy the clone URL ( `clone with SSH` ) : copy to clip board.

3) Create a new folder and name it. Say, "collaboration-platform".

4) Enter into the "collaboration-platform" folder, open `Git Bash` and do a

```sh
git clone git@git-cto.mindtree.com:opcoe/collaboration-platform-services.git
```

5) You will get the documents folder and services folder. Go to the working directory

```sh
cd collaboration-platform-services
```
#### Run the App
1) Install node dependencies
```sh
npm install
```
2) Run the app and you can see the app running in port 3000 by default
```sh
node server.js
```
#### You can check the swagger url at 

LOCAL
http://localhost:9000/collab-services/swagger

DEVELOPMENT
http://dev-coe-cp.cloudapp.net/collab-services/swagger
### Contributors
* **[@M1023892](https://git-cto.gomindtree.com/M1023892)** *(Saihareesh)*
* **[@M1020387](https://git-cto.gomindtree.com/M1020387)** *(Bhushan Vadgave)*
    
