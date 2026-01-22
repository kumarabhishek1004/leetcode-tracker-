const Problem = require('../models/Problem');

/*
  POST: Add a new problem (MongoDB)
*/
const addProblem = async (req, res) => {
  try {
    const { title, difficulty, rating } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5'
      });
    }

    // Save problem to MongoDB
    const problem = await Problem.create({
      title,
      difficulty,
      rating
    });

    // Send saved document
    res.json(problem);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating problem'
    });
  }
};

/*
  GET: Fetch all problems from MongoDB
*/
const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching problems'
    });
  }
};

/*
  DELETE: Delete a problem by ID (MongoDB)
*/
const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    await Problem.findByIdAndDelete(id);

    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting problem'
    });
  }
};

/*
  PATCH: Update rating of a problem (MongoDB)
*/
const updateRating = async (req, res) => {
  try {
    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Rating must be between 1 and 5'
      });
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      { rating },
      { new: true } // return updated document
    );

    if (!updatedProblem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json(updatedProblem);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating rating'
    });
  }
};

module.exports = {
  addProblem,
  getAllProblems,
  deleteProblem,
  updateRating
};
