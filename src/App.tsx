import React, { useState, useEffect } from "react";

const App = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(1); // Add a state variable for the speech rate

  useEffect(() => {
    // Fetch the list of available voices
    const fetchVoices = () => {
      const voices: any = speechSynthesis.getVoices();
      setVoices(voices);
      setSelectedVoice(voices[0]);
    };

    // If the voices have not been fetched yet, fetch them
    if (voices.length === 0) {
      fetchVoices();
    }

    // If the list of voices changes, update the list
    const handleVoicesChanged = () => {
      fetchVoices();
    };
    speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);

    // Clean up the event listener when the component unmounts
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, [voices]);

  const speak = () => {
    // Create a new SpeechSynthesisUtterance object
    const utterance = new SpeechSynthesisUtterance(text);

    // Set the voice and speech rate if they have been selected
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = speechRate; // Set the speech rate on the utterance object

    // Start speaking
    speechSynthesis.speak(utterance);
  };

  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <br />
      <button onClick={speak}>Speak</button>
      <br />
      <select
        value={selectedVoice ? selectedVoice.name : ""}
        onChange={(e: any) =>
          setSelectedVoice(voices.find(() => v.name === e.target.value))
        }
      >
        {voices.map((voice: any) => (
          <option key={voice.name} value={voice.name}>
            {voice.name}
          </option>
        ))}
      </select>
      <br />
      {/* Add a slider to control the speech rate */}
      <label htmlFor="speech-rate">Speech Rate:</label>
      <input
        type="range"
        min="0.1"
        max="10"
        step="0.1"
        value={speechRate}
        onChange={(e: any) => setSpeechRate(e.target.value)}
      />
      {speechRate}
    </div>
  );
};

export default App;
