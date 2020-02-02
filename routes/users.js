const express = require("express");
const router = express.Router();
const User = require("../models").models.User;

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
  asyncHandler(async (req, res) => {
    // TODO 200 Returns the currently authenticated user
  })
);

router.post(
  "/users",
  asyncHandler(async (req, res) => {
    // TODO 201 Creates a user, sets the Location header to "/", and returns no content
  })
);

module.exports = router;
