# Expense Tracker

## Description

Expense Tracker is a financial management application with two levels of access: Basic and Premium.

### Basic Version
In the Basic version, users can add, edit, delete, and view their daily income and expenses. This feature provides users with a simple and effective way to manage their daily finances.

### Premium Version
The Premium version offers a host of advanced features. Users can view a leaderboard that ranks them based on their income, providing a competitive aspect to financial management. Additionally, premium users have the ability to view and download detailed financial reports on a monthly or yearly basis. These reports offer a comprehensive overview of a user's financial health over a longer period. Another notable feature is the ability to view the maximum income earned, which can serve as a motivational tool for users.

## Features

### Basic Features
- **Add Income/Expense**: Users can add their daily income and expenses.
- **Edit Income/Expense**: Users can edit their income and expense entries.
- **Delete Income/Expense**: Users can delete any income or expense entry.
- **View Daily Income/Expense**: Users can view their regular income and expenses.

### Premium Features
- **Leaderboard**: Users can view a leaderboard that shows the expenses of all users.
- **Monthly/Yearly Reports**: Users can check their monthly and yearly income, expenses, and savings.
- **Download Reports**: Users can download their financial reports on a monthly or yearly basis.

## Tech Stack

- HTML, CSS, JavaScript, and Bootstrap: These are used for creating the front-end of the application. HTML is used for structuring the web content, CSS for styling, JavaScript for adding interactivity, and Bootstrap for responsive design.

- Node.js and Express.js: These are used for building the back-end of the application. Node.js is a JavaScript runtime that allows you to run JavaScript on the server-side, and Express.js is a web application framework for Node.js.

- Razorpay: This is a payments solution in India which allows businesses to accept, process, and disburse payments. In this project, it is used to handle payments so users can upgrade to a premium membership.

- SendinBlue: This is an email marketing service. In this project, it is used for sending password reset emails when a user forgets their password.

- AWS S3 (Simple Storage Service): This is a scalable cloud storage service provided by Amazon Web Services. It is used in this project for uploading and downloading files.

- AWS EC2 (Elastic Compute Cloud): This is a web service that provides resizable compute capacity in the cloud. It is used to deploy the application.

- MongoDB Atlas and AWS RDS: These are database services used for storing and retrieving data.In this project, there are two versions of the application: one uses MongoDB Atlas and the other uses AWS RDS with MySQL.
    - MongoDB Atlas is a fully-managed cloud database service for MongoDB,
    - AWS RDS (Relational Database Service) is a web service that makes it easier to set up, operate, and scale a relational database in the cloud.

## Screenshots
- Homepage Page
    - Basic
      ![image](https://github.com/1-ankush-1/ExpenseTracker/assets/95346389/4e3b7f9f-c3c9-4ecd-a56f-9bfec2624554)
    - Premium
      ![image](https://github.com/1-ankush-1/ExpenseTracker/assets/95346389/c3135fb5-95d1-42bf-af27-5f70cd3f3ff7)
- Income Page
  ![image](https://github.com/1-ankush-1/ExpenseTracker/assets/95346389/48cb61f8-5ac5-4412-aa55-c2af5d64410c)

- LeaderBoard Page
  ![image](https://github.com/1-ankush-1/ExpenseTracker/assets/95346389/518510bc-db1e-4bf5-b5f9-c035d7959c27)

- Report Page
  ![image](https://github.com/1-ankush-1/ExpenseTracker/assets/95346389/9bebad7e-d836-4704-aa72-f842f5be120c)
 
## Usage

1. **Register**: First, you need to register on the application. Fill in the required details and create your account.

2. **Login**: After registering, login to the application using your credentials.

3. **Home Page**: Once you login, you will be directed to the home page where the expense page will open.

4. **Expense Page**: Here, you can add, view, edit, and delete expenses.

5. **Income Page**: Navigate to the income section from the navbar. Here, you can add, view, edit, and delete income just like in the expense page.

6. **Premium Membership**: If you want to access premium features, click on 'Buy Premium' from the navbar and follow the steps to become a premium member.

7. **Leaderboard and Reports**: Once you are a premium member, you can access the leaderboard and reports section from the tab.


## Setup

1. **Clone the repository**: Use the command `git clone <repository-url>`. Replace `<repository-url>` with the URL of this repository. This will copy all the files from this repository to your local machine.

2. **Navigate to the backend directory**: Use the command `cd backend`. This will take you to the `backend` directory where the server-side code is located.

3. **Install the dependencies**: Use the command `npm i`. This will install all the dependencies required for the project which are listed in the `package.json` file.

4. **Create a .env file**: You need to create a `.env` file in the `backend` directory. This file should contain all the environment variables which the project needs to run. You can use the `example.env` file as a reference.

5. **Start the server**: Use the command `npm start`. This will start the server on a certain port number. You will see a message in the console with the port number.

6. **Access the application**: Open a web browser and go to `localhost:<port>`. Replace `<port>` with the port number you saw in the console. This will open the application.



