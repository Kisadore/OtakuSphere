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

async function getAllUsers(){
    try{
        const allUsers = await db.query("SELECT * FROM User;"); // returns an array of a bunch of info. array[0] will be idex of what we need
        return allUsers
    }
    catch(err){
        console.log("WEEEWOOO")
        console.error(err)
    }
}

// [allUsers] - brackets will automatically assign to the array[0]
const [allUsers] = await getAllUsers();
console.log(allUsers);


