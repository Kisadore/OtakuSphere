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

/*  JS async, await, and promise:
    promise: object expected to return something if successful or failure
    async/await: create 'async function functionName()' and inside them you can use 'await' on things that return promises to have code run sequentially. You can also wrap the await with a try-catch block to handle errors
*/

// example of async function with await:

// functions to get all of the users from db
async function getAllUsers(){
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
async function getUser(id) {
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
async function createUser(username, email, password){
    const [result] = await db.query(`
        INSERT INTO User(username, email, password)
        VALUES (?, ?, ?)`, [username, email, password]);

    return result.insertId; // the insert returned an object, and now we're returning it's insertId attribute - the user_id value it was given
}


// const allUsers = await getAllUsers();
// console.log(allUsers);

// const getUserTest = await getUser(1);
// console.log(getUserTest);

// const createUserTest = await createUser("TESTING3", "tester3@test.com", "testPassword");
// console.log(createUserTest);

// const allUsers = await getAllUsers();
// console.log(allUsers);