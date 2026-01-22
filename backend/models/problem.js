const mongoose = require('mongoose');

/*
  Problem Schema
  This defines HOW a problem is stored in MongoDB
*/
const problemSchema = new mongoose.Schema(
  {
    // Problem title (e.g., Two Sum)
    title: {
      type: String,      // must be a string
      required: true     // cannot be empty
    },

    // Difficulty level (Easy / Medium / Hard)
    difficulty: {
      type: String,
      required: true
    },

    // User rating (1 to 5)
    rating: {
      type: Number,
      required: true,
      min: 1,            // minimum allowed value
      max: 5             // maximum allowed value
    }
  },
  {
    timestamps: true     // MongoDB auto-adds createdAt & updatedAt
  }
);

// Create and export the model
// "Problem" becomes the collection name (problems)
module.exports = mongoose.model('Problem', problemSchema);
