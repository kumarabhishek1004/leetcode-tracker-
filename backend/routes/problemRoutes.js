const express = require('express');
const router = express.Router();

const {
  addProblem,
  getAllProblems,
  deleteProblem,
  updateRating
} = require('../controllers/problemcontroller');

/*
  DELETE: delete a problem by id (MongoDB)
*/
router.delete('/:id', deleteProblem);

/*
  PATCH: update rating (MongoDB)
*/
router.patch('/:id', updateRating);

/*
  POST: add new problem (MongoDB)
*/
router.post('/', addProblem);

/*
  GET: get all problems (MongoDB)
*/
router.get('/', getAllProblems);

module.exports = router;
