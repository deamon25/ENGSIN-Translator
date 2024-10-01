import { useEffect, useState } from 'react';
import lang from '../../languages';
import './style/trans.css';


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

    const idioms = {
        "it's raining cats and dogs": "බර වැසි වැටෙනවා",
        "break a leg": "සාර්ථක වන්න",
        // Add more idioms as needed
    };

    const handleTranslate = () => {
        setLoading(true);
        setError(null); // Reset error state
        
        // Check for idioms in the input text and replace them first
        let translatedText = fromText;
        for (const [idiom, translation] of Object.entries(idioms)) {
            const regex = new RegExp(`\\b${idiom}\\b`, 'gi'); // Match whole words
            translatedText = translatedText.replace(regex, translation);
        }

        // If idioms were replaced, set the output text directly
        if (translatedText !== fromText) {
            setToText(translatedText);
            setLoading(false);
            saveTranslation(fromText, translatedText);
            return; // Exit if no translation API call is needed
        }

        // Call your translation API if needed after replacing idioms
        let url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(translatedText) + '&langpair=' + fromLanguage + '|' + toLanguage;

        fetch(url)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                // If API returns a translated text, use it
                if (data.responseData.translatedText) {
                    setToText(data.responseData.translatedText);
                    // Save to the backend after translation is successful
                    saveTranslation(fromText, data.responseData.translatedText);
                } else {
                    setToText(translatedText); // Fallback to the idiom translated text if no API response
                    saveTranslation(fromText, translatedText); // Save fallback translation
                }
                setLoading(false);

               
            })
            .catch((err) => {
                setError(err.message); // Handle errors
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

    // Handle speech recognition and transcription
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

   

    // Save translation to the backend
  const saveTranslation = async (fromText, toText) => {
    console.log('Saving translation:', { fromText, toText }); // Add this line to debug
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
            <div className="wrapper">
                <div className="text-input">
                    <textarea 
                        name="from" 
                        className="from-text" 
                        placeholder="Enter Text" 
                        id="from" 
                        value={fromText} 
                        onChange={(e) => setFromText(e.target.value)}
                    />
                    <textarea 
                        name="to" 
                        className="to-text" 
                        id="to" 
                        value={toText} 
                        readOnly
                    />
                </div>
                <ul className="controls">
                    <li className="row from">
                        <div className="icons">
                            <i id="from" className="fa-solid fa-volume-high" onClick={(e) => handleIconClick(e.target, 'from')}></i>
                            <i id="from" className="fa-solid fa-copy" onClick={(e) => handleIconClick(e.target, 'from')}></i>
                            <i 
                                id="from-mic" 
                                className={`fa fa-microphone ${listening ? 'mic-listening' : ''}`} 
                                onClick={() => setListening(!listening)}
                            ></i>
                        </div>
                        <select value={fromLanguage} onChange={(e) => setFromLanguage(e.target.value)}>
                            {Object.entries(languages).map(([code, name]) => (
                                <option key={code} value={code}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </li>
                    <li className="exchange" onClick={handleExchange}>
                        <i className="fa-solid fa-arrow-right-arrow-left"></i>
                    </li>
                    <li className="row to">
                        <select value={toLanguage} onChange={(e) => setToLanguage(e.target.value)}>
                            {Object.entries(languages).map(([code, name]) => (
                                <option key={code} value={code}>
                                    {name}
                                </option>
                            ))}
                        </select>
                        <div className="icons">
                            <i id="to" className="fa-solid fa-copy" onClick={(e) => handleIconClick(e.target, 'to')}></i>
                            <i id="to" className="fa-solid fa-volume-high" onClick={(e) => handleIconClick(e.target, 'to')}></i>
                        </div>
                    </li>
                </ul>
            </div>
            {error && <div className="error">{error}</div>} {/* Display error if exists */}
            <button onClick={handleTranslate} disabled={loading}>
                {loading ? 'Translating...' : 'Translate Text'}
            </button>
        </>
    );
}

export default Translator;