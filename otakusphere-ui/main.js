// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { Clerk } from "@clerk/clerk-js";

// const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// const clerk = new Clerk(clerkPubKey);
// await clerk.load();

// // Function to mount the Clerk sign-in component
// function showSignIn() {
//   document.getElementById("app").innerHTML = `<div id="sign-in"></div>`;
//   const signInDiv = document.getElementById("sign-in");
//   clerk.mountSignIn(signInDiv);
// }

// // Add event listeners to the buttons
// document.getElementById("signInBtn").addEventListener("click", showSignIn);

// // Mount Clerk's user button if the user is already signed in
// if (clerk.user) {
//   document.getElementById("app").innerHTML = `<div id="user-button"></div>`;
//   const userButtonDiv = document.getElementById("user-button");
//   clerk.mountUserButton(userButtonDiv);
// }

// // if (clerk.user) {
// //   document.getElementById("app").innerHTML = `
// //     <div id="user-button"></div>
// //   `;

// //   const userButtonDiv =
// //     document.getElementById("user-button");

// //   clerk.mountUserButton(userButtonDiv);
// // } else {
// //   document.getElementById("app").innerHTML = `
// //     <div id="sign-in"></div>
// //   `;

// //   const signInDiv =
// //     document.getElementById("sign-in");

// //   clerk.mountSignIn(signInDiv);
// // }

// document.getElementById('currentYear').textContent = new Date().getFullYear();


import './style.css'
import { Clerk } from "@clerk/clerk-js";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerk = new Clerk(clerkPubKey);

// Initialize Clerk
async function initializeClerk() {
  await clerk.load();
  
  // Get the container for auth buttons
  const authContainer = document.querySelector('.auth-buttons');
  
  if (clerk.user) {
    // If user is signed in, show the user button
    const userButtonDiv = document.createElement('div');
    userButtonDiv.id = 'user-button';
    authContainer.innerHTML = ''; // Clear existing buttons
    authContainer.appendChild(userButtonDiv);
    clerk.mountUserButton(userButtonDiv);
  } else {
    // If user is not signed in, show sign-in/sign-up buttons
    const signInBtn = document.getElementById('signInBtn');
    const signUpBtn = document.getElementById('signUpBtn');

    signInBtn.addEventListener('click', () => {
      clerk.openSignIn({
        appearence: {
          elements: {
            rootBox: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }
          }
        }
      });
    });

    signUpBtn.addEventListener('click', () => {
      clerk.openSignUp({
        appearence: {
          elements: {
            rootBox: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }
          }
        }
      });
    });
  }
}

// Update copyright year
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Initialize Clerk when the page loads
initializeClerk().catch(console.error);
