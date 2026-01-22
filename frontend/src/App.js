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

  // fetch problems when component loads
  useEffect(() => {
    fetchProblems();
  }, []);

  // function to fetch problems from backend
  const fetchProblems = () => {
    fetch('/api/problems') // uses proxy
      .then(res => res.json())
      .then(data => setProblems(data))
      .catch(err => console.log(err));
  };

  // function runs when form is submitted
  const handleSubmit = (e) => {
    e.preventDefault(); // stop page refresh

    // prevent double click / duplicate submit
    if (loading) return;

    setLoading(true);

    fetch('/api/problems', { // uses proxy
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
        // clear form inputs after success
        setTitle('');
        setDifficulty('');
        setRating('');

        // reload problems list
        fetchProblems();
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false); // re-enable button
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
 