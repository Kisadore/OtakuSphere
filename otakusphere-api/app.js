// Express code to create HTTP Server

import express from 'express';
import {getAllUsers, getUser, createUser, updateUsername, updateUserEmail, updateUserPassword, getAllAnimes, getAnime, getReview, createReview, getUserWatchlist, addToWatchlist} from "./database.js";
import bcrypt from "bcrypt";    // async library to hash passwords
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file URL and directory path - this method works for ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(express.json());

// Serve the otakusphere-ui directory as static files
app.use(express.static(path.join(__dirname, "../otakusphere-ui")));

// Route for the home page
app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../otakusphere-ui/index.html"));
});

// get route for user register - displays register page to user
app.get("/register", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../otakusphere-ui/register.html"));
});

// post route for user to register new account: use bcrypt to hash and salt password
app.post("/register", async (req, res) => {
    try {
        // get data from user response
        const {username, email, password} = req.body;
        if (!username || !email || !password){
            res.status(406).json({error: "All fields required"});
            return;
        }
        // hash and salt password with bcrpyt
        const hashedPassword = await bcrypt.hash(password, 10);
        // create new user entry in db
        const newUser = await createUser(username, email, hashedPassword);
        // send successful status code and result
        res.status(201).json({message: "User successfully created", newUser});
    }
    catch(err){
        res.status(406).json({error: "Registration unsuccessful"});
    }
});

// get route for login page
app.get("/login", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../otakusphere-ui/login.html"));
});

// post route for users to login
app.post("/login", async (req, res) => {
    try{
        // get data user sent
        const {username, password} = req.body;
        // query db for the user
        const user = await getUser(username);
        if (user === undefined){
            res.status(400).json({error: "Invalid username"})
            return;
        }
        // verify password with bcrpyt
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid){
            res.status(400).json({error: "Invalid Password"});
            return;
        }
        res.status(200).json({message: "Login successful", user});
    }
    catch(err){
        res.status(406).json({error: "Login unsuccessful"});
    }
});

// code for async error handling:
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({error: "Internal server error"})
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});