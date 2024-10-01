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

            let url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(sentence) + '&langpair=' + fromLanguage + '|' + toLanguage;
    
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
                setToText(translatedArray.join(' ')); 
                setLoading(false);
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

    return (
        <>
            <div className="custom-wrapper">
                <div className="custom-text-input">
                    <textarea 
                        name="from" 
                        className="custom-from-text" 
                        placeholder="Enter Text" 
                        id="from" 
                        value={fromText} 
                        onChange={(e) => setFromText(e.target.value)}
                    />
                    <textarea 
                        name="to" 
                        className="custom-to-text" 
                        id="to" 
                        value={toText} 
                        readOnly
                    />
                </div>
                <ul className="custom-controls">
                    <li className="custom-row from">
                        <div className="custom-icons">
                            <i id="from" className="fa-solid fa-volume-high" onClick={(e) => handleIconClick(e.target, 'from')}></i>
                            <i id="from" className="fa-solid fa-copy" onClick={(e) => handleIconClick(e.target, 'from')}></i>
                        </div>
                        <select value={fromLanguage} onChange={(e) => setFromLanguage(e.target.value)}>
                            {Object.entries(languages).map(([code, name]) => (
                                <option key={code} value={code}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </li>
                    <li className="custom-exchange" onClick={handleExchange}>
                        <i className="fa-solid fa-arrow-right-arrow-left"></i>
                    </li>
                    <li className="custom-row to">
                        <select value={toLanguage} onChange={(e) => setToLanguage(e.target.value)}>
                            {Object.entries(languages).map(([code, name]) => (
                                <option key={code} value={code}>
                                    {name}
                                </option>
                            ))}
                        </select>
                        <div className="custom-icons">
                            <i id="to" className="fa-solid fa-copy" onClick={(e) => handleIconClick(e.target, 'to')}></i>
                            <i id="to" className="fa-solid fa-volume-high" onClick={(e) => handleIconClick(e.target, 'to')}></i>
                        </div>
                    </li>
                </ul>
            </div>
            {error && <div className="custom-error">{error}</div>} {/* Display error if exists */}
            <button onClick={handleTranslate} disabled={loading}>
                {loading ? 'Translating...' : 'Translate Text'}
            </button>
        </>
    );
}

export default Translator;
