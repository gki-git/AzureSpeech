import { useState } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

import './App.css';

const voicesArr = [
  { value: 'en-US-JennyNeural', label: 'Jenny' },
  { value: 'en-US-AmberNeural', label: 'Amber' },
  { value: 'en-US-BrandonNeural', label: 'Brandon' },
  { value: 'en-US-AnaNeural', label: 'Ana' },
  { value: 'en-US-ChristopherNeural', label: 'Christopher' },
  { value: 'en-US-DavisNeural', label: 'Davis' },
  { value: 'en-US-AriaNeural', label: 'Aria' },
  { value: 'en-US-AshleyNeural', label: 'Ashley' },
  { value: 'en-US-EricNeural', label: 'Eric' },
  { value: 'en-US-CoraNeural', label: 'Cora' },
  { value: 'en-US-ElizabethNeural', label: 'Elizabeth' },
];

const getSSMLConfig = (text, voiceValue, speed, pitch) => {
  return `<speak
            xmlns="http://www.w3.org/2001/10/synthesis"
            xmlns:mstts="http://www.w3.org/2001/mstts"
            xmlns:emo="http://www.w3.org/2009/10/emotionml"
            version="1.0"
            xml:lang="en-US"
            >   
              <voice name="${voiceValue}">
                <prosody rate="${speed}%" pitch="${pitch}%">
                  ${text}
                </prosody>
              </voice>
          </speak>`;
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [voiceValue, setVoiceValue] = useState('en-US-JennyNeural');
  const [pitchValue, setPitchValue] = useState('0');
  const [speedValue, setSpeedValue] = useState('0');

  function synthesizeSpeech() {
    if (!text) return;

    setIsLoading(true);
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.REACT_APP_API_KEY,
      process.env.REACT_APP_REGION
    );

    let synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    const SSMLConfig = getSSMLConfig(text, voiceValue, speedValue, pitchValue);

    synthesizer.speakSsmlAsync(
      SSMLConfig,
      (result) => {
        const { audioData } = result;

        console.log('success', audioData);
        synthesizer.close();
        synthesizer = null;
        setIsLoading(false);
      },
      (error) => {
        console.log(error);
        setIsLoading(false);
        synthesizer.close();
      }
    );
  }

  return (
    <div className="mainContainer">
      <h2>Azure Text To Speech</h2>
      <div className="inputsContainer">
        <div className="inputText">
          <label htmlFor="textInput">Text Input</label>
          <input
            id="textInput"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="selectInput">
          <label htmlFor="voiceSelect">Select Voice</label>
          <select
            id="voiceSelect"
            value={voiceValue}
            onChange={(e) => setVoiceValue(e.target.value)}
          >
            {voicesArr.map((voice, idx) => {
              return (
                <option key={idx} value={voice.value}>
                  {voice.label}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="pitchInput">
        <label htmlFor="speedValue">Select Speed</label>
        <input
          id="speedValue"
          value={speedValue}
          onChange={(e) => setSpeedValue(e.target.value)}
          type="range"
          min="-100"
          max="100"
          step="1"
        />
        {speedValue}%
      </div>
      <div className="pitchInput">
        <label htmlFor="pitchValue">Select Pitch</label>
        <input
          id="pitchValue"
          value={pitchValue}
          onChange={(e) => setPitchValue(e.target.value)}
          type="range"
          min="-100"
          max="100"
          step="1"
        />
        {pitchValue}%
      </div>
      <button type="button" onClick={synthesizeSpeech}>
        Play!
      </button>
      {isLoading && <h3>Loading...</h3>}
    </div>
  );
}

export default App;
