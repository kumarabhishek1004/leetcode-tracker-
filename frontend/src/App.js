import { useEffect, useState } from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

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

  // ===== Chart Data with Colors =====
  const chartData = [
    { name: 'Easy', value: easyCount, fill: '#22c55e' },
    { name: 'Medium', value: mediumCount, fill: '#eab308' },
    { name: 'Hard', value: hardCount, fill: '#ef4444' },
  ];
  // =================================

  // ================= UI =================
  return (
    <div className="p-4 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        LeetCode Tracker
      </h1>

      {/* ===== Analytics Dashboard ===== */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <p className="text-sm text-green-700">Easy</p>
          <p className="text-2xl font-bold text-green-900">{easyCount}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <p className="text-sm text-yellow-700">Medium</p>
          <p className="text-2xl font-bold text-yellow-900">{mediumCount}</p>
        </div>

        <div className="bg-red-100 p-4 rounded-lg text-center">
          <p className="text-sm text-red-700">Hard</p>
          <p className="text-2xl font-bold text-red-900">{hardCount}</p>
        </div>
      </div>

      {/* ===== Bar Chart ===== */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Difficulty Distribution
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />

            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== Add Problem Form ===== */}
      <form onSubmit={handleSubmit} className="mb-6 space-x-2">
        <input
          type="text"
          placeholder="Problem Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-2 py-1 rounded"
          required
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border px-2 py-1 rounded"
          required
        >
          <option value="">Select Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <input
          type="number"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
          className="border px-2 py-1 rounded w-20"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          {loading ? 'Adding...' : 'Add Problem'}
        </button>
      </form>

      {/* ===== Problems List ===== */}
      <ul className="space-y-2">
        {problems.map(problem => (
          <li
            key={problem._id}
            className="border p-3 rounded-lg bg-white shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="font-semibold">{problem.title}</p>
              <p className="text-sm text-gray-600">
                {problem.difficulty} · Rating: {problem.rating}
              </p>
            </div>

            <input
              type="number"
              min="1"
              max="5"
              value={editRatings[problem._id] ?? problem.rating}
              onChange={(e) =>
                setEditRatings({
                  ...editRatings,
                  [problem._id]: e.target.value
                })
              }
              className="w-16 border rounded px-2 py-1 ml-2"
            />

            <button
              type="button"
              className="bg-blue-500 text-white px-3 py-1 rounded ml-2"
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
              className="bg-red-500 text-white px-3 py-1 rounded ml-2"
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
