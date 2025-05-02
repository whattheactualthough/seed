# NC News Seeding

# Hosted version here:
[https://lulu-newsroom.onrender.com/](https://)

# Project overview
This is the back end project for a news website, key features include:
Read articles,
Filter / categorise articles by topic,
Order by any relevent value such as date, number of votes, author,
Interact with articles by up/down voting,
Filter all comments for a single article,
Remove comments by id.

# Built with: 
Node.js
Express.js
PostgreSQL
PG
Jest
Supertest
dotenv
VS Code

# Clone repo here:
[https://github.com/whattheactualthough/seed](https://)

# Install dependencies 
npm install
* requires node.js and npm. 

# Set up Environment variables
Create the following files in root of project:

`.env.test `
`.env.development `

Ensure .gitignore includes these files.

# Update db credentials in .env files
.env.development: PGDATABASE= *db_name*
.env.test: PGDATABASE= *db_name*

# Seed Local DB
npm run seed

# Run tests
In your terminal run
`npm t `

# Minimum versions:
Node.js v23.9.0.
psql (PostgreSQL) 14.17 (Homebrew)




