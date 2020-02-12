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
      attributes: [
        "id",
        "userId",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded"
      ],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "emailAddress"]
        }
      ]
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
      attributes: [
        "id",
        "userId",
        "title",
        "description",
        "estimatedTime",
        "materialsNeeded"
      ],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "emailAddress"]
        }
      ]
    });

    if (course) {
      res
        .status(200)
        .json(course)
        .end();
    } else {
      res
        .status(400)
        .json({ message: "Course not found" })
        .end();
    }
  })
);

router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    // 201 Creates a course, sets the Location header to the URI for the courses, and returns no content
    const course = req.body;
    try {
      await Course.create(course);

      res
        .status(201)
        .location(`/courses/${course.id}`)
        .end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        "SequelizeUniqueConstraintError"
      ) {
        error.message = error.errors.map(error => error.message);
        console.warn(error.message);
        res
          .status(400)
          .json(error.message)
          .end();
      } else {
        throw error;
      }
    }
  })
);

router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    // 204 Updates a course and returns no content
    const course = await Course.findByPk(req.params.id);
    // Ensure course belongs to current authenticated user
    if (course && course.userId == req.currentUser.id) {
      // Ensure ids match to confirm this is not a malformed request
      if (req.params.id == req.body.id) {
        // Ensure both title and description have been provided
        if (req.body.title && req.body.description) {
          course
            .update(req.body)
            .then(() => {
              res
                .status(204)
                .json(course)
                .end();
            })
            .catch(error =>
              res
                .status(400)
                .json({ message: error.message })
                .end()
            );
        } else {
          console.log("Both 'Title' and 'Description' are required.");
          res
            .status(400)
            .json({ message: "Both 'Title' and 'Description' are required." })
            .end();
        }
      } else {
        console.log(
          "The supplied course ID does not match the course ID saved in database."
        );
        res
          .status(400)
          .json({
            message:
              "The supplied course ID does not match the course ID saved in database."
          })
          .end();
      }
    } else {
      console.log("You do not own this course.");
      res
        .status(403)
        .json({ message: "You do not own this course." })
        .end();
    }
  })
);

router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    // 204 Deletes a course and returns no content
    const course = await Course.findByPk(req.params.id);
    if (course && course.userId == req.currentUser.id) {
      await Course.destroy({ where: { id: req.params.id } });
      res.status(204).end();
    } else {
      res
        .status(403)
        .json({ message: "You do not own this course." })
        .end();
    }
  })
);

module.exports = router;
