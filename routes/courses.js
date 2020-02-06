const express = require("express");
const router = express.Router();
const auth = require("basic-auth");
const bcryptjs = require("bcryptjs");
const { Course } = require("../models").models;
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
  "/courses",
  asyncHandler(async (req, res) => {
    // 200 List of courses and the user that owns each course
    const courses = await Course.findAll({
      include: [User]
    });
    res
      .status(200)
      .json(courses)
      .end();
  })
);

router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    // 200 Returns a single course (including the user that owns the course) for the provided course ID
    const course = await Course.findOne({
      where: {
        id: req.params.id
      },
      include: [User]
    });

    res
      .status(200)
      .json(course)
      .end();
  })
);

router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    // 201 Creates a course, sets the Location header to the URI for the courses, and returns no content
    const course = req.body;
    await Course.create(course);

    res
      .status(201)
      .location("/")
      .end();
  })
);

router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    // 204 Updates a course and returns no content
    await Course.update(req.body, { where: { id: req.body.id } });
    res.status(204).end();
  })
);

router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    // 204 Deletes a course and returns no content
    await Course.destroy({ where: { id: req.params.id } });
    res.status(204).end();
  })
);

module.exports = router;
