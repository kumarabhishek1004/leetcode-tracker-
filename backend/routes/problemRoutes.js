const express = require('express');
const router = express.Router();

const { addProblem,getAllProblems,deleteProblem,updateRating } = require('../controllers/problemController');


// temporary in-memory storage
let problems = [];

/*
  DELETE: delete a problem by id
*/
router.delete('/:id' ,deleteProblem);

/*
  PATCH: update rating
*/
router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { rating } = req.body;

  // validate rating
  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      message: 'Rating must be between 1 and 5'
    });
  }

  // find problem
  const problem = problems.find(p => p.id === id);

  if (!problem) {
    return res.status(404).json({ message: 'Problem not found' });
  }

  // update rating
  problem.rating = rating;

  res.json(problem);
});

/*
  POST: add new problem
*/
router.post('/', addProblem);

/*
  GET: get all problems
*/
router.get('/', getAllProblems);

module.exports = router;
