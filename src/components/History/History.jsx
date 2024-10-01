import React, { useState, useEffect } from 'react';

const TranslationHistory = () => {
  const [translationHistory, setTranslationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch translation history from the backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/translations');
        if (!response.ok) {
          throw new Error('Failed to fetch translation history');
        }
        const data = await response.json();
        setTranslationHistory(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div className="text-gray-200">Loading translation history...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black-500 uppercase">Input Text</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black-500 uppercase">Translated Text</th>
                  <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black-500 uppercase">Date</th>
                  <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-black-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {translationHistory.map((entry) => (
                  <tr key={entry._id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{entry.inputText}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{entry.translatedText}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                      <button
                        type="button"
                        className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationHistory;
