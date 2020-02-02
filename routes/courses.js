const express = require("express");
const router = express.Router();
const Course = require("../models").models.Course;

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
    // TODO 200 List of courses and the user that owns each course
  })
);

router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    // TODO 200 Returns a single course (including the user that owns the course) for the provided course ID
  })
);

router.post(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    // TODO 201 Creates a course, sets the Location header to the URI for the courses, and returns no content
  })
);

router.put(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    // TODO Updates a course and returns no content
  })
);

router.delete(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    // TODO Deletes a course and returns no content
  })
);

module.exports = router;
