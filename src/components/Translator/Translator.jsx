import { useEffect, useState } from 'react';
import idioms from './idioms';
import lang from './languages';

function Translator() {
    const [fromText, setFromText] = useState('');
    const [toText, setToText] = useState('');
    const [fromLanguage, setFromLanguage] = useState('en-GB');
    const [toLanguage, setToLanguage] = useState('si-LK');
    const [languages, setLanguages] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [listening, setListening] = useState(false); // New state for listening

    useEffect(() => {
        setLanguages(lang);
    }, []);

    const copyContent = (text) => {
        navigator.clipboard.writeText(text);
    };

    const utterText = (text, language) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        synth.speak(utterance);
    };

    const handleExchange = () => {
        let tempValue = fromText;
        setFromText(toText);
        setToText(tempValue);

        let tempLang = fromLanguage;
        setFromLanguage(toLanguage);
        setToLanguage(tempLang);
    };

    const handleTranslate = () => {
        setLoading(true);
        setError(null);
    
        let sentences = fromText.match(/[^.!?]+[.!?]*/g) || [];
    
        let translatedSentences = sentences.map((sentence) => {
            let foundIdiom = false;
            let translatedSentence = sentence;
    
            for (const [idiom, translation] of Object.entries(idioms)) {
                const regex = new RegExp(`\\b${idiom}\\b`, 'gi');
                if (regex.test(sentence)) {
                    translatedSentence = sentence.replace(regex, translation);
                    foundIdiom = true;
                    break;
                }
            }
    
            if (foundIdiom) {
                return Promise.resolve(translatedSentence);
            }
    
            let url =
                'https://api.mymemory.translated.net/get?q=' +
                encodeURIComponent(sentence) +
                '&langpair=' +
                fromLanguage +
                '|' +
                toLanguage;
    
            return fetch(url)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then((data) => {
                    return data.responseData.translatedText || sentence;
                })
                .catch((err) => {
                    setError(err.message);
                    return sentence;
                });
        });
    
        Promise.all(translatedSentences)
            .then((translatedArray) => {
                const finalTranslation = translatedArray.join(' ');
                setToText(finalTranslation);
                setLoading(false);
    
                // Call saveTranslation after the translation is complete
                saveTranslation(fromText, finalTranslation);
            })
            .catch((err) => {
                setError('Error translating the text');
                setLoading(false);
            });
    };
    

    const handleIconClick = (target, id) => {
        if (!fromText || !toText) return;

        if (target.classList.contains('fa-copy')) {
            if (id === 'from') {
                copyContent(fromText);
            } else {
                copyContent(toText);
            }
        } else {
            if (id === 'from') {
                utterText(fromText, fromLanguage);
            } else {
                utterText(toText, toLanguage);
            }
        }
    };

    const handleSpeechToText = (speechText) => {
        setFromText(speechText);
    };

    useEffect(() => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = fromLanguage;
        if (listening) {
            recognition.start();
            recognition.onresult = (event) => {
                const speechToText = event.results[0][0].transcript;
                handleSpeechToText(speechToText);
            };
        } else {
            recognition.stop();
        }

        return () => recognition.stop(); // Cleanup on component unmount or listening change
    }, [listening, fromLanguage]);

    const saveTranslation = async (fromText, toText) => {
        console.log('Saving translation:', { fromText, toText });
        await fetch('http://localhost:5000/api/translations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fromText, toText }),
        });
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-[#e7f2f8]">
    <div className="max-w-xl w-full bg-white rounded-xl p-8 shadow-xl">
        <div className="flex border-b border-gray-300">
            <textarea
                name="from"
                className="w-full h-64 border-none rounded-tl-xl p-4 text-lg placeholder-gray-400"
                placeholder="Enter Text"
                id="from"
                value={fromText}
                onChange={(e) => setFromText(e.target.value)}
            />
            <textarea
                name="to"
                className="w-full h-64 border-none rounded-tr-xl p-4 text-lg bg-gray-50 border-l border-gray-300"
                id="to"
                value={toText}
                readOnly
            />
        </div>
        <ul className="flex justify-between items-center mt-4 space-x-4">
            <li className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <i id="from" className="fa-solid fa-volume-high text-gray-500 cursor-pointer" onClick={(e) => handleIconClick(e.target, 'from')}></i>
                    <i id="from" className="fa-solid fa-copy text-gray-500 cursor-pointer" onClick={(e) => handleIconClick(e.target, 'from')}></i>
                    <i
                        id="from-mic"
                        className={`fa fa-microphone cursor-pointer ${listening ? 'text-black animate-pulse' : 'text-gray-500'}`}
                        onClick={() => setListening(!listening)}
                    ></i>
                </div>
                <select
                    value={fromLanguage}
                    onChange={(e) => setFromLanguage(e.target.value)}
                    className="border-none outline-none text-lg p-2"
                >
                    {Object.entries(languages).map(([code, name]) => (
                        <option key={code} value={code}>
                            {name}
                        </option>
                    ))}
                </select>
            </li>
            <li className="cursor-pointer" onClick={handleExchange}>
                <i className="fa-solid fa-arrow-right-arrow-left text-xl text-gray-500"></i>
            </li>
            <li className="flex items-center space-x-4">
                <select
                    value={toLanguage}
                    onChange={(e) => setToLanguage(e.target.value)}
                    className="border-none outline-none text-lg p-2"
                >
                    {Object.entries(languages).map(([code, name]) => (
                        <option key={code} value={code}>
                            {name}
                        </option>
                    ))}
                </select>
                <div className="flex items-center space-x-2">
                    <i id="to" className="fa-solid fa-copy text-gray-500 cursor-pointer" onClick={(e) => handleIconClick(e.target, 'to')}></i>
                    <i id="to" className="fa-solid fa-volume-high text-gray-500 cursor-pointer" onClick={(e) => handleIconClick(e.target, 'to')}></i>
                </div>
            </li>
        </ul>
        {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
        <button
            onClick={handleTranslate}
            disabled={loading}
            className="w-full py-3 mt-6 bg-blue-500 text-white rounded-md text-lg hover:bg-blue-600 disabled:bg-blue-300"
        >
            {loading ? 'Translating...' : 'Translate Text'}
        </button>
    </div>
</div>
        </>
    );
}

export default Translator;