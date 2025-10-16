
# DigiClips Project Overview

## Introduction
This README provides a comprehensive overview of the DigiClips project, synthesizing insights from various teams over the years. DigiClips, an evolving project, aims to develop a video editor with innovative features, including creating clips from videos using closed-caption text.

## Historical Overview
- **2017 Team**: Initiated the project, facing challenges in code quality and team coordination, typical in student-led projects.
- **2020 Team**: Provided guidance for future teams, emphasizing the complexity and evolving nature of the project.
- **2023 Team**: Advanced the project significantly by developing a search engine capable of video editing based on closed-caption text selection.

## Current State
As of 2023, DigiClips includes:
- A video editor allowing users to select clips from videos by highlighting text from closed captions.
- An Angular front-end for the web application, offering an interactive user interface.

## For Future Teams
To those taking over this project:
- Please continue to update this README with your contributions and insights.
- Remember the challenges faced by previous teams and learn from them.
- Keep in mind the project's goal: to simplify video editing through innovative features.

## Getting Started
- Watch this video to show how our team got the application started: https://youtu.be/Md9U6aO32Q4
- Check the `~/src/` directory for the front-end application code.
- Familiarize yourself with the project's history and current capabilities.
- Refer to the documentation of previous years for more detailed insights.

Things to download should be: - openvpn - angular - node -
mysql-workbench

## Connecting

1)  Change directories into the project root and
    then type in the command “sudo openvpn --config config.ovpn”.
    Then, it will ask for an Auth Username which should be “Buffalo22”.
    Then it will ask for the password which is “2c@nBird”. If this
    doesn’t work, then ask Henry for the credentials.

2)  In a new terminal, run mysql-workbench anywhere and connect to
    192.168.50.2. Username is “henry_VPN” and the password is “DropInn#12”.
    Ask Henry for credentials if this doesn’t work.

3)  In the server directory in the project root you should run “npm
    install”. This is to install all of the dependencies for the Node
    server. You can find the list of dependencies in the
    server/package.json file. Next, type “npm run debug”. In the project
    root, run “npm install”

4)  Open a new terminal and go into the same root
	and then type “npm start”. After this has finished compiling it
    should tell you where the development server is listening. It should
    say listening at localhost: 4200, but it may have changed. Then, you
    can then open up a browser and type in “localhost:4200/search”. If
    that doesn’t work just try “localhost:4200”. If asked for credentials
	on the login page, then they should be Email: "bobshapiro40@gmail.com"
	and Password(Ask Client for this Password). After logging in you should be met with the
	DigiClips search page.
	
5)	Things to note:
	Currently working on NodeJS v20.9.0, NPM v10.2.3, and Python 3.10.12
	
## Docker Container

The CU Boulder team developed a Docker Container for development without having
to log into the digifrontend. Here's how that works:

There should be a docker-compose.yaml file within the server directory of the repository.

To run the container, you must install Docker Desktop and have it running before starting
terminal commands. Once Docker Desktop is running, connect to the vpn and
change your directory to the server directory with the docker-compose.yaml file and run
"docker compose up" in the console. 

*Note, you must be connected to the vpn before running "docker compose up" or else
*you won't be able to mount the ssh servers.

*Note from Sac State Team: Docker will only work if you remove the node_modules folder within server
*Docker image will reinstall the modules

By using docker, you and your team members will be able to run the Node server without
having to install anything locally. The docker container also
connects to the Digiclips media server via ssh allowing access to the video and television
files currently. If you want to access other files like magazines and radio files,
Henry or Bob must give you the ssh login for those servers and you need to mount it within
the container.

*Note, the container uses up quite a bit of memory so once the container is running,
*you might see some slowdowns to your computer.

The container runs on a custom image made by Adam Bui from CU Boulder. If in any
case the Docker image needs to be changed, there is a Docker Image folder containing
the original Dockerfile to create the image. Follow this tutorial to build the
image if needed. https://www.youtube.com/watch?v=JmyAMcKUNYA

If changes are made on to the Dockerfile and a new image is created, you will also
need to upload it to the docker registry for your team members to be able to access
the image. You can follow this tutorial to push your docker image to the docker registry.
https://www.youtube.com/watch?v=fdQ7MmQNTa0

We found Docker an efficient way to develop as it is essentially a development environment
meant to keep everyone on the same page. Using docker allows team members
to run the Node server without any local installation of the node_modules as well as
provide us access to the Digiclips media without locally mounting their ssh servers.

To keep it secure, we made a ShellScripts folder for you to place the mounting script
from Henry in. It should be empty when you get it, but you just need to add in the 
"mnt_recs.sh" shell script into the shellscripts folder then run the docker-compose file.
If any mounting errors occur, make sure you are connected to the vpn or make sure with
Henry that the ssh server isn't down.

If you edit the mnt_recs.sh file in Windows, you might get a weird error when running
the docker. Using WSL or Bash, run this command to get rid of the Windows line terminators.
    
    - sed -i 's/\r//g' mnt_recs.sh

All other documentation for docker will be in docker-compose.yaml

You only need to do all these steps the first time. From then on, you
need to do only steps 1 and 4 every time you want to connect to the
server and access the search page.

## Non-technical documents
There are a couple of documents that may be helpful to have in the "Non-technical
documents" directory in the project root.
1. DigiClips Fall 2017 Search Engine - User Guide.pdf
2. DigiClips Fall 2017 Search Engine - Things done and not done.pdf

### About 
This repository contains two major components of the DigiClips system: 
- Angular front-end web application, which generates the user interface for the web application. 
 ( Located in `~/src/` )
 
- Node.js server, which provides a layer between the data (stored in MySQL database on digiclips-owned machines)
and the Angular app. The server also handles email alert management and delivery.
( Located in `~/server/` )

These two components interact via HTTP requests and require specific configuration to work properly.
It may make more sense for these two application to be separated into their own repositories,
because they are logically independent systems, though they share some npm dependencies. 

It's a little difficult getting started with this application due to the slightly complex structure.
We strongly recommend reading through this document to get started.

// testing digiclips 

this time our sdmay25-05 team was able to add some end-to-end testcases using cypress and able to cover some user workflows like login, testing the search feature. to see cypress in action follow this steps.
1. start server  and SE  by using npm  start.
2. run "npm run cypress:open"  and make sure the cypress is able to connect to the BaseUrl.
3. select end-to-end testing there and hit continue.


## Notes

#### The Database:
The database for Newspapers and Magazines will update automatically whenever the project is deployed via a Scheduler that checks
RSS Feeds for online newspapers and magazines based on a time interval. Currently, the duration that a newspaper/magazine article
will stay in the database is 2 weeks. The scheduler will automatically delete anything older.

#### Report Generation:
When a search query is made, there are options to create and download reports in PDF, doc, XLS, and
HTML formats. DOC Reports are NOT supported by any other document viewer/editor other than Microsoft Word.
If you are developing on Linux and wish to view a report in doc format, LibreOffice will show you a blank page.
This is due to the node module 'html-doc-js' not supporting other document formats.


## Development Guide

#### src/app/
This is where the front end of the application is, the navbar is located in the app.component.html file.

#### src/app/add-magazine
This component handles the adding of a new magazine and its RSS feed to the database.

#### src/app/add-newspaper/
This component handles the adding of a new newspaper and its RSS feed to the database.

#### src/app/media-transfer/
This component handles the media transfer module. 
See handoff documentation to get started improving development.
https://docs.google.com/document/d/1DEnUcpuB0jFeFPFedGC69iHjaMe2QSnIq7KnpCLQ5Fo/edit?usp=sharing

#### src/app/search/
This component creates the search page. The results page and the individual details pages are all
part of the search page, just hidden and shown as needed. This probably should be separated into
separate files and routed separately, we inherited this format and were simply trying to build on top of it.
The Fall 2024 Sac State team is working on the editor for TV and Radio which is currently also implemented in this component.
Please see comments to find where you can find these editors. User should be able to edit clips and export using WeTransfer.

Also the Newspaper and Magazine implementations of this project do not use these fields (email alerts are done in the src/app/login/newAlerts/ module):
- Recipient Email Addresses
- Real Time Alerts
- Format of Reports

#### src/app/login/
This was originally just the login page. Inside this directory are also the subdirectories "alerts", "profile", and "register",
because we thought they were all related to user-accounts. If it makes more sense to move them out, feel free to do so.
The "forgot password" link currently does nothing, since it wasn't a priority. The "remember me" checkbox may be unnecessary,
since most browsers probably already offer that feature.

#### src/app/login/alerts/
This was inherited code along old implementation for email alerts. We are not sure how much of this is functional,
but the typescript should be set up in a way so that it would be relatively easy to display email alerts once the
backend is able to serve that information.

#### src/app/login/newAlerts/
This contains the new code for email alerts setup. The user can create an email alert and select an interval to
receive email updates based on their keywords.

#### src/app/login/profile/
Where users can change their password. Presumably, users can change other things about their user account here too,
as the user system gains more features.

#### src/app/login/register/
Where users can create accounts. An improvement to be made here is to alert the user of various errors that may occur
when trying to register (e.g. "That account already exists.")

#### src/app/login/services/
Most of the front end services are in this directory, such as querying the database (search.service.ts),
adding a media source to the database (addmedia.service.ts), or setting up email alerts (sendemail.service.ts).

#### src/parser/
The parser we designed which uses RSS feed links from the database and parses the feed’s articles
to store the article metadata.

#### server/
Here lives the back end of the application (the Node server).

#### server/routes/
This is where all the routes should be for the front end to contact, such as doing a search
(simpleSearch.js) or downloading a PDF (generatePDF.js).

#### server/services/
This is where all of the back end services are, such as sending emails
(emailService.js) and generating HTML from search results (htmlService.js).

#### server/views/
This directory contains the styling and templating for our generated html (used in report generation). 

## Final Note
As student developers, we understand the challenges of working on such a project. Our collective
experiences are encapsulated here to assist future teams in pushing the boundaries of what DigiClips can achieve.

## Former DigiClips Students Contact Information
Feel free to reach out to any of us if you have any questions over anything.

Newspaper & Magazine:
- Richard Feldtz (rcfeldtz@gmail.com)
- Sam Lewis (lewis.james.sam@gmail.com)
- Steven Park (park.1908@osu.edu)
- Cole Zavar (colezavar@gmail.com)

- Charlette Lin (zenithstorm@gmail.com) 11/25/2017
- Jeff Jarry: jeffrey.jarry@gmail.com (2017)
- Jenn Alarcon: jenniferalarcon96@gmail.com (2017)

Front End Work (Spring 2019):
- Shariah Johnson - johnson.6619@osu.edu
- Zane Clymer - clymer.50@osu.edu
- Harshil Amin - amin.115@osu.edu
- Dan Heavern - heavern.2@osu.edu

SP2020 Team:
- Ben Powell: hello@benspowell.com phone: 6143952008
- Blake Harriman: harriman.28@osu.edu phone: 8186364061
- Markus Ma: ma.1492@osu.edu
- Feifan Lin: lin.2570@osu.edu phone: 614-208-0198

FA2023 Team
- Harry Galdon: hgaldoniii@gmail.com
- Coy Washington: coymw1@gmail.com
- Thomas Barry: lagaba2020@gmail.com
- Ryan Nguyen: ryanguyen736@gmail.com

FA2024 Team
- Dylan Smith: dasmith@csus.edu
- Bejan Maljai: bmaljai@csus.edu
- Nishan Maharjan: nmaharjan@csus.edu
- Daniel Espinoza Diaz: danielespinozadiaz@csus.edu
- Yahir Ocegueda: yocegueda@csus.edu
- Dagem Kebede: Dagemkebede@csus.edu
- Ahmed Ali: ahmedali@csus.edu
- Tyler Swain: tswain@csus.edu
- Jacob Moon: jacobmoon@csus.edu

OSU Media-Transfer SP2025 Team
- Sarah Keck: sarah@keckfamily.org
- Nathan Grabowski: nategrabowski2@gmail.com
- Jisan Amin: jisanamin19111@gmail.com
- Xining Feng: fengxining02@gmail.com
- Aidan Thompson: aidtomjohn624@gmail.com
- Bennett Godinho-Nelson: bennettgodinhonelson@gmail.com







