import { useEffect, useState } from 'react';

function App() {
  // state to store problems list from backend
  const [problems, setProblems] = useState([]);

  // state to store form input values
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [rating, setRating] = useState('');

  // loading state to prevent double submit
  const [loading, setLoading] = useState(false);

  // state to store edited ratings (for Update button)
  const [editRatings, setEditRatings] = useState({});

  // fetch problems when component loads
  useEffect(() => {
    fetchProblems();
  }, []);

  // function to fetch problems from backend
  const fetchProblems = () => {
    fetch('/api/problems')
      .then(res => res.json())
      .then(data => setProblems(data))
      .catch(err => console.log(err));
  };

  // delete a problem by id
  const deleteProblem = (id) => {
    const ok = window.confirm('Are you sure you want to delete this problem?');
    if (!ok) return;

    fetch(`/api/problems/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => {
        fetchProblems();
      })
      .catch(err => console.log(err));
  };

  // update rating of a problem
  const updateRating = (id, newRating) => {
    fetch(`/api/problems/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rating: Number(newRating)
      })
    })
      .then(res => res.json())
      .then(() => {
        fetchProblems();
      })
      .catch(err => console.log(err));
  };

  // function runs when form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    fetch('/api/problems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        difficulty,
        rating: Number(rating)
      })
    })
      .then(res => res.json())
      .then(() => {
        setTitle('');
        setDifficulty('');
        setRating('');
        fetchProblems();
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>LeetCode Tracker</h1>

      {/* FORM TO ADD A PROBLEM */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Problem Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Difficulty (Easy / Medium / Hard)"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Problem'}
        </button>
      </form>

      <hr />

      {/* DISPLAY PROBLEMS */}
      <ul>
        {problems.map(problem => (
          <li key={problem._id}>
            {problem.title} - {problem.difficulty} - Rating: {problem.rating}

            {/* rating input */}
            <input
              type="number"
              min="1"
              max="5"
              value={editRatings[problem._id] ?? problem.rating}
              style={{ width: '50px', marginLeft: '10px' }}
              onChange={(e) =>
                setEditRatings({
                  ...editRatings,
                  [problem._id]: e.target.value
                })
              }
            />

            {/* update button */}
            <button
               type ="button"
              style={{ marginLeft: '6px' }}
              onClick={() =>
                updateRating(
                  problem._id,
                  editRatings[problem._id] ?? problem.rating
                )
              }
            >
              Update
            </button>


            {/* delete button */}
            <button
              style={{ marginLeft: '6px' }}
              onClick={() => deleteProblem(problem._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
