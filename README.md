# Request-Handling-Application

## Problem Statement
An application has a variety of long-running tasks that require time and resources on the servers. As it stands now, once we have triggered off a long-running task, there is no way to tap into it and pause/stop/terminate the task, upon realizing that an erroneous request went through from one of the clients (mostly web or pipeline).

## Proposed Solution
Written REST API for pausing, resuming and terminating a query which is fired at any time.
I have taken a dummy database having 100000 rows in the table 'user_details'[Schema of Table: user_id, username, first_name, last_name, gender, password, status]. I am firing query of updation of user_details column's 'gender' which for now can have varchar of length 10. In the UI two textfields are mentioned one for the original value(Male or Female) and the updated value can be any string.
Once the query is fired after clicking the submit button, at the bottom status is shown and in console every step is being shown, one can pause and resume that query and for this purpose sleep is added in the query to test these pause/resume functions. One can also terminate that query.

## Technology Stack
* Node.js
* HTML
* MySQL
* Docker

### Screenshots

First Page

<img src="https://github.com/Pragya007/Atlan-Backend-Challenge/blob/master/Screenshots/Front%20Page.PNG" >

Submit

<img src="https://github.com/Pragya007/Atlan-Backend-Challenge/blob/master/Screenshots/Submit.PNG">

Pause/Resume

<img src="https://github.com/Pragya007/Atlan-Backend-Challenge/blob/master/Screenshots/Pause_Resume.PNG" >

Cancel

<img src="https://github.com/Pragya007/Atlan-Backend-Challenge/blob/master/Screenshots/Cancel.PNG">

Database

<img src="https://github.com/Pragya007/Atlan-Backend-Challenge/blob/master/Screenshots/DB1.PNG" >


## Installation
* Import MySql DataBase
* For server(Inside Atlan-Backend-Challenge Folder): 
    ```sh
    $ npm install
    $ npm start
    ```
 * Open ``localhost:3000``
 * Docker Files are also given:
    ```
    docker-compose up --build
    ```


Dummy Database: https://sample-videos.com/download-sample-sql.php
