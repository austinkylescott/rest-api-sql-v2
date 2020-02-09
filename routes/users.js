const express = require("express");
const router = express.Router();
const auth = require("basic-auth");
const bcryptjs = require("bcryptjs");
const { User } = require("../models").models;

const authenticateUser = async (req, res, next) => {
  let message = null;
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  // If the user's credentials are available...
  if (credentials) {
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key"
    // from the Authorization header).

    const user = await User.findOne({
      where: {
        emailAddress: credentials.name
      }
    });

    // If a user was successfully retrieved from the data store...
    if (user) {
      // Use bcryptjs to compare the user's password(from the Authorization header)
      // to the user's password that was retrieved from the data store.
      const authenticated = bcryptjs.compareSync(
        credentials.pass,
        user.password
      );

      // If the passwords match...
      if (authenticated) {
        console.log(
          `Authentication successful for username: ${user.emailAddress}`
        );
        // Then store the retrieved user object on the request object
        // so any middleware functions that follow this middleware function
        // will have access to the user's information.
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Auth header not found";
  }

  // If user authentication failed...
  if (message) {
    console.warn(message);
    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: "Access Denied" });
  } else {
    // Or if user authentication succeeded...
    // Call the next() method.
    next();
  }
};

//Async Handler for database errors
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      console.log(error);
      const status = 500 || error.status;
      res.status(status);
    }
  };
}

router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    //  200 Returns the currently authenticated user
    const user = req.currentUser;
    res
      .status(200)
      .json({
        username: user.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      })
      .end();
  })
);

router.post(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    // 201 Creates a user, sets the Location header to "/", and returns no content
    const user = req.body;
    try {
      if (user.password) {
        user.password = bcryptjs.hashSync(user.password);
      }

      await User.create(user);

      res
        .status(201)
        .location("/")
        .end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        "SequelizeUniqueConstraintError"
      ) {
        error.message = error.errors.map(error => error.message);
        console.warn(error.message);
        res.status(400).end();
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;
