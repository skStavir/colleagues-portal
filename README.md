# Stavir-colleague
## About
This repo contains both the backend and front ent code of the colleague portal
## How to run the server
the server code is in the directory backend/server
configure the database details in the fole config/app.properties

run `npm install`
run `node app.js` to start the server


## How to run the server in docker (optional)
`docker build -t colleague-portal-1.4 .`
`docker-componse up`
### To stop
`docker-compose down`

## Server APIs
#### Create Employee - POST /api/v1/employees 
#### Get Employee details - GET /api/v1/employees
#### Update Employee - PUT /api/v1/employees/:employee_id
#### Create Timesheet - POST /api/v1/timesheet 
#### GET employee Timesheet - GET /api/v1/timesheet/employees/:employeeId/month/:yearAndMonth
#### GET Timesheet of all employees reporting to manager - GET /api/v1/timesheet/employees/:reporting_manager_id/subordinates/month/:yearAndMonth



## Git commands
### To push your code to GitHub, you'll need to follow these steps:
If you don't already have a GitHub account, you'll need to create one
On your local machine, navigate to the directory where you want to store your project  
git clone REPO_URL
### To check the status of your Git repository,
git status
### Place your code files inside the cloned repository folder. use the following commands to add and commit your changes:
git add . or git add filename
git commit -m "Your commit message here"
###9 Use the git push command to push your code to GitHub. You'll need to specify the remote name (usually "origin") and the branch name (usually "main" or "master"). Replace these as needed.
git push origin main

![image](https://github.com/skStavir/colleagues-portal/assets/146941497/0f168735-4d57-4cd0-9647-c216599f5d2f)

