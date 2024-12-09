// Express code to create HTTP Server

import express from 'express';
import {getAllUsers, getUser, createUser, updateUsername, updateUserEmail, updateUserPassword, updateUserAvatar, getAllAnimes, getAnime, getReview, createReview, getUserWatchlist, addToWatchlist, addAnime, doesAnimeExist} from "./database.js";
import bcrypt from "bcrypt";    // async library to hash passwords
import path from 'path';
import { fileURLToPath } from 'url';
import { title } from 'process';
import cors from 'cors';
import morgan from 'morgan';

// Get the current file URL and directory path - this method works for ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors()); 
app.use(morgan('dev'));
app.use(express.json());

// Serve the otakusphere-ui directory as static files
app.use(express.static(path.join(__dirname, "../otakusphere-ui")));

// Route for the home page
app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "../otakusphere-ui/index.html"));
});


app.get("/test", (req, res) => {
    res.status(200).json({ message: "Server is working!" });
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
        res.status(200).json({message: "Login successful", user: {user_id: user.user_id, username: user.username, email: user.email, avatar: user.avatar_url}});
    }
    catch(err){
        res.status(406).json({error: "Login unsuccessful"});
    }
});

app.post("/addAnime", async (req, res) => {
    try {
        const {title, description} = req.body;
        const result = await addAnime(title, description);
        if (result.status === "Success"){
            res.status(201).json({message: "Anime successfully added", data: result.data[0]});
            return;
        }
        else {
            res.status(400).json({error: "Anime could not be added"});
            return;
        }
    }
    catch(err){
        res.status(400).json({error: "Anime unsuccessfully added"});
    }
});

app.get("/checkExistAnime", async (req, res) => {
    try {
        const {title} = req.body;
        const result = await doesAnimeExist(title);
        res.status(200).json({result: result});
    }
    catch(err){
        res.status(400).json({error: "Error checking anime"});
    }
});

app.post("/addToWatchlist", async (req, res) => {
    try {
        const {user_id, title, description} = req.body;
        const animeExist = await doesAnimeExist(title);
        if (animeExist === true){
            const [animeId] = await getAnime(title)
            const result = await addToWatchlist(user_id, animeId.anime_id);
            res.status(201).json({status: "Successfully added to watchlist", result});
        }
        else if (animeExist === false) {
            const newAnimeId = await addAnime(title, description);
            const result = await addToWatchlist(user_id, newAnimeId.data[0].anime_id)
            res.status(201).json({status: "Successfully added to watchlist", result})
        }
        else {
            res.status(400).json({error: "Unsuccessful adding anime to watchlist"});
        }
    }
    catch(err) {
        res.status(400).json({error: "Unsuccessful adding anime to watchlist"});
    }
});

app.post("/getUserWatchlist", async (req, res) => {
    try {
        const {user_id} = req.body;
        const watchlist = await getUserWatchlist(user_id);
        res.status(200).json(watchlist)
    }
    catch(err) {
        res.status(400).json({error: "Unsuccessful"})
    }
});

app.get("/getUsers", async (req, res) => {
    try {
        console.log("Getting users...");
        const users = await getAllUsers();
        res.json({ users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get users" });
    }
});


app.post("/updateAvatar", async (req, res) => {
    try {
        const { user_id, avatar_url } = req.body;
        
        if (!user_id || !avatar_url) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        const result = await updateUserAvatar(avatar_url, user_id);
        
        if (result.affectedRows > 0) {
            res.status(200).json({ 
                message: "Avatar updated successfully",
                avatar_url: avatar_url
            });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch(err) {
        console.error("Error updating avatar:", err);
        res.status(500).json({ error: "Failed to update avatar" });
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