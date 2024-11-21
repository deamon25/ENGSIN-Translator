import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const TranslationHistory = () => {
  const [translationHistory, setTranslationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);

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
        setFilteredHistory(data); // Initialize filtered history
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    // Filter translation history based on search term
    const filtered = translationHistory.filter(entry => {
      return (
        entry.inputText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.translatedText.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredHistory(filtered);
  }, [searchTerm, translationHistory]);

  // Handle deleting a translation
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this translation?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/translations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete translation');
      }

      // Remove the deleted translation from the state
      setTranslationHistory((prevHistory) =>
        prevHistory.filter((entry) => entry._id !== id)
      );
      setFilteredHistory((prevFiltered) =>
        prevFiltered.filter((entry) => entry._id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAll = async () => {
    const confirmDeleteAll = window.confirm('Are you sure you want to delete all translation history?');
    if (!confirmDeleteAll) return;

    try {
      const response = await fetch('http://localhost:5000/api/translations', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete all translations');
      }

      // Clear the state
      setTranslationHistory([]);
      setFilteredHistory([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.text('Translation History Report', 15, 18);

    const headers = ['Input Text', 'Translated Text', 'Date'];
    const data = filteredHistory.map(entry => [
      entry.inputText,
      entry.translatedText,
      new Date(entry.createdAt).toLocaleString(),
    ]);

    doc.autoTable({
      head: [headers],
      body: data,
    });

    doc.save('translationHistoryReport.pdf');
  };

  if (loading) {
    return <div className="text-gray-200">Loading translation history...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col max-w-[1280px] mx-auto my-6">
      <div className="flex mb-10 justify-between">
        <h1 className="text-2xl font-semibold leading-7 text-dark">Translation History</h1>
        <div className="flex">
          <input
            type="text"
            placeholder="Search by input or translated text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-md px-2 py-1"
          />
          <button onClick={downloadReport} className="text-sm font-medium rounded-lg text-dark hover:bg-gray-200 p-2 px-3 flex mx-2">
            Download Report
          </button>
          <button onClick={handleDeleteAll} className="text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white p-2">
            Delete All History
          </button>
        </div>
      </div>
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
                {filteredHistory.map((entry) => (
                  <tr key={entry._id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{entry.inputText}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{entry.translatedText}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                      <button
                        type="button"
                        className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 focus:outline-none focus:text-red-800"
                        onClick={() => handleDelete(entry._id)}
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
