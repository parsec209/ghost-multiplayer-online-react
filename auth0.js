// You must setup a custom Login / Post Login  action in your Auth0 account for the following reasons:
//   1)  Retrieve the username from the auth state user's user_metadata.
//   2)  Enable a username selection prompt after a user's first login.

//Read more here: https://auth0.com/docs/manage-users/user-accounts/metadata/manage-user-metadata

//Below is example code used for this action:

// const { generateUsername } = require("unique-username-generator");  //install from npm
// /**
// * Handler that will be called during the execution of a PostLogin flow.
// *
// * @param {Event} event - Details about the user and the context in which they are logging in.
// * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
// */
// exports.onExecutePostLogin = async (event, api) => {
//   const namespace = event.secrets.namespace;  // this is your react app's base URL
//   let username = event.user.user_metadata.username
//   let usernameConfirmed = event.user.user_metadata.usernameConfirmed

//   if (event.authorization) {
//     if (!username) {
//       username = generateUsername("-")
//       api.user.setUserMetadata("username", username)
//     }
//     if (!usernameConfirmed) {
//       if (usernameConfirmed === undefined) {
//         usernameConfirmed = false
//       } else {
//         usernameConfirmed = true
//       }
//       api.user.setUserMetadata("usernameConfirmed", usernameConfirmed)
//     }
//
//     api.idToken.setCustomClaim(`${namespace}/username`, username);
//     api.idToken.setCustomClaim(`${namespace}/usernameConfirmed`, usernameConfirmed);
//   }
// };
