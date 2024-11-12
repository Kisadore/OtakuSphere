// Express code to create HTTP Server

import express from 'express';
import {getAllUsers, getUser, createUser, updateUsername, updateUserEmail, updateUserPassword, getAllAnimes, getAnime, getReview, createReview, getUserWatchlist, addToWatchlist} from "./database.js";

const app = express();

app.use(express.json());

// testing get route to get all animes in db
app.get("/animes", async (request, response) => {
    // call db function to get all anime
    const animes = await getAllAnimes();
    // send the result back
    response.send(animes);
});

// get route to return one anime
app.get("/anime/:id", async (request, response) => {
    // get the id from the request with .params.__:
    const id = request.params.id;
    const anime = await getAnime(id);
    response.send(anime);
});

// post route to create review
app.post("/create_review", async (request, response) => {
    // json data is sent in the request
    const {user_id, anime_id, rating, review_text} = request.body;
    // call the db function
    const reviewResult = await createReview(user_id, anime_id, rating, review_text);
    // send result and status 201 (creation successful)
    response.status(201).send(reviewResult);
});

// code for async error handling:
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});