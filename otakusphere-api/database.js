// import mysql to connect to db and query data
import mysql from 'mysql2';

// import dotenv to use .env file + configure it to use .env variables
import dotenv from 'dotenv';
dotenv.config();

// pool stores connections to db, same as 'createConnection' but holds more
// use process.env.____ to get credentials from .env file
const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

// functions to get all of the users from db
export async function getAllUsers(){
    try{
        // [allUsers] - brackets will automatically assign to the array[0]
        const [allUsers] = await db.query("SELECT * FROM User;"); // returns an array of a bunch of info. array[0] will be idex of what we need
        return allUsers
    }
    catch(err){
        console.log("WEEEWOOO")
        console.error(err)
    }
}

// function to get only one user from the db specified by their ID
export async function getUser(id) {
    try {
        // don't use ${id}, use ? instead. when using ?, make sure to add the array as a parameter in query(...) method
        const [user] = await db.query(`
            SELECT * FROM User 
            WHERE user_id = ?
            `, [id]);

            return user[0]; // we can return user[0], since the array will only have the 1 user in it we queried
    }
    catch(err) {
        console.log("ERROR: getUser(id) could not retrieve user");
    }
}

// function to insert a user into the db
export async function createUser(username, email, password){
    const [result] = await db.query(`
        INSERT INTO User(username, email, password)
        VALUES (?, ?, ?)`, [username, email, password]);

    return result.insertId; // the insert returned an object, and now we're returning it's insertId attribute - the user_id value it was given
}

// function to update user username with given ID
export async function updateUsername(newUsername, id){
    const [result] = await db.query(`
        UPDATE User
        SET username = ?
        WHERE user_id = ?`, [newUsername, id]);
    
    return result;
}

// function to update user email with given ID
export async function updateUserEmail(newEmail, id){
    const [result] = await db.query(`
        UPDATE User
        SET email = ?
        WHERE user_id = ?`, [newEmail, id]);

    return result;
}

// function to update user password with given ID
export async function updateUserPassword(newPassword, id){
    const [result] = await db.query(`
        UPDATE User
        SET password = ?
        WHERE user_id = ?`, [newPassword, id]);

    return result;
}

// function to get all animes from db
export async function getAllAnimes(){
    const [result] = await db.query(`
        SELECT * 
        FROM Anime`);
    return result;
}

// function to get one anime
export async function getAnime(anime_id){
    const [anime] = await db.query(`
        SELECT * 
        FROM Anime
        WHERE anime_id = ?`, [anime_id]);

    return anime;
}

// function to get a review
export async function getReview(review_id){
    const [review] = await db.query(`
        SELECT * 
        FROM Review
        WHERE review_id = ?`, [review_id]);
    
    return review;
}

// function to create review
export async function createReview(user_id, anime_id, rating, review_text){
    const [result] = await db.query(`
        INSERT INTO Review (user_id, anime_id, rating, review_text)
        VALUES (?, ?, ?, ?)`, [user_id, anime_id, rating, review_text]);
    
    return result
}

// function to get watchlist of user
export async function getUserWatchlist(user_id){
    const [result] = await db.query(`
        SELECT anime_id 
        FROM Watchlist
        WHERE user_id = ?`, [user_id]);
    
    return result;
}

// function to add to watchlist
export async function addToWatchlist(user_id, anime_id){
    const [result] = await db.query(`
        INSERT INTO Watchlist (user_id, anime_id)
        VALUES (?, ?)`, [user_id, anime_id]);
    
    return result;
}
