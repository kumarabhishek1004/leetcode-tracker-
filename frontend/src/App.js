import { useEffect, useState } from 'react';

function App() {
  // ================= STATES =================
  const [problems, setProblems] = useState([]);

  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [rating, setRating] = useState('');

  const [loading, setLoading] = useState(false);
  const [editRatings, setEditRatings] = useState({});

  // ================= FETCH =================
  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = () => {
    fetch('/api/problems')
      .then(res => res.json())
      .then(data => setProblems(data))
      .catch(err => console.log(err));
  };

  // ================= DELETE =================
  const deleteProblem = (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;

    fetch(`/api/problems/${id}`, { method: 'DELETE' })
      .then(() => fetchProblems())
      .catch(err => console.log(err));
  };

  // ================= UPDATE =================
  const updateRating = (id, newRating) => {
    fetch(`/api/problems/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: Number(newRating) })
    })
      .then(() => fetchProblems())
      .catch(err => console.log(err));
  };

  // ================= CREATE =================
  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    fetch('/api/problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        difficulty,
        rating: Number(rating)
      })
    })
      .then(() => {
        setTitle('');
        setDifficulty('');
        setRating('');
        fetchProblems();
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  // ================= ANALYTICS =================
  const normalize = (value) => value?.toLowerCase().trim();

  const easyCount = problems.filter(p => normalize(p.difficulty) === 'easy').length;
  const mediumCount = problems.filter(p => normalize(p.difficulty) === 'medium').length;
  const hardCount = problems.filter(p => normalize(p.difficulty) === 'hard').length;

  // ================= UI =================
  return (
    <div>
      <h1>LeetCode Tracker</h1>

      {/* ===== Analytics Dashboard ===== */}
      <div style={{ marginBottom: '15px', fontWeight: 'bold' }}>
        Analytics → Easy: {easyCount} | Medium: {mediumCount} | Hard: {hardCount}
      </div>

      {/* ===== Add Problem Form ===== */}
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

      {/* ===== Problems List ===== */}
      <ul>
        {problems.map(problem => (
          <li key={problem._id}>
            {problem.title} - {problem.difficulty} - Rating: {problem.rating}

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

            <button
              type="button"
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

            <button
              type="button"
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
