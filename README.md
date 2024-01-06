# TrelloDashboard

![Preview of App](https://i.postimg.cc/hj8vqvVg/image-5.png)

Trello Extension Dashboard for time-critical Project and Time-Management

#### Requirements
- node.js (tested and build on v18.17.0, verified on latest v21.5.0 & lts v20.10.0)

## Getting started

To prepare the App for the first launch, use the following commands to download the App and install all dependencies.

```
$ git clone https://github.com/finncyr/TrelloDashboard
$ cd TrelloDashboard/
$ npm install
$ npm run build
```

Inside the projects folder, there must be an `.env`-File present with the following contains:

```
# .env file
POWER_UP_API_KEY="YOUR_OWN_TRELLO_API_POWER_UP_KEY"
POWER_UP_TOKEN="YOUR_OWN_TRELLO_API_POWER_UP_TOKEN"
```
See [Norbert Teders Trello-Wrapper](https://github.com/norberteder/trello) for more information.

**Now you are ready to start up the App! ⚡️**

## Starting the App

Starting the App via the "start" script, resolves in a self-hosted local app on Port 3001.
If you want to use a different Port instead, set the `PORT` environment variable to the Port to be used.

```
$ npm run start
```
-> http://localhost:3001

## Updating the Swagger API-Documentation

```
$ npm run swagger
$ npm run build && npm run start
```
-> http://localhost:3001/api-docs

### Progress

<details>
    <summary>Earlier stages</summary> 

#### v0.6.0
![Version 0.6.0](https://i.postimg.cc/nhsLh0q3/image-4.png)

#### v0.4.0
![Version 0.4.0](https://i.postimg.cc/c4LHVsCy/image-3.png)

#### v0.2.0 & 0.3.0
![Version 0.2.0](https://i.postimg.cc/rwvw0xJM/image-2.png)

#### v0.1.0
![Screenshot of early development](https://i.postimg.cc/c1mC9KsB/image.png)
![Full Layout](https://i.postimg.cc/Kvpzbd3K/image-1.png)
</details>