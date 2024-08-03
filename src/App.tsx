import './App.css';
import { shuffleArray } from './utils/utils';
import ApiService from './api/apiService';
import ProgressBar from './components/ProgressBar';
import HebrewSentence from './components/HebrewSentence';
import ConstructSentenceArea from './components/ConstructSentenceArea';
import WordBank from './components/WordBank';
import CheckButton from './components/CheckButton';
import CorrectAnswer from './components/CorrectAnswer';
import { useEffect, useState } from 'react';

interface Sentence {
  hebrew: string;
  arabic: string;
  diacritized: string;
  taatik: string
  audio: HTMLAudioElement;
}

function App() {
  const [loading, setLoading] = useState(false);
  const [bankWords, setBankWords] = useState<string[]>([]);
  const [constructAreaWords, setConstructAreaWords] = useState<string[]>([]);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentSentence, setCurrentSentence] = useState<Sentence>();
  const [hebrewSentence, setHebrewSentence] = useState('');
  const [arabicSentence, setArabicSentence] = useState('');
  const [taatikSentence, setTaatikSentence] = useState('');
  const [nextSentence, setNextSentence] = useState<Sentence | null>(null);
  const [score, setScore] = useState(0);
  const [levelupScore, setLevelupScore] = useState(5);
  const [level, setLevel] = useState(1);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const fetchAndShuffleSentences = async () => {
      try {
        await ApiService.initialized; // Wait for initialization
        const fetchedSentences = await ApiService.fetchSentences();
        const shuffled = shuffleArray([...fetchedSentences]);
        setSentences(shuffled);
      } catch (error) {
        console.error('Error fetching and shuffling sentences:', error);
      }
    };

    fetchAndShuffleSentences();
  }, []);

  useEffect(() => {
    if (sentences.length > 0) {
      playRound();
    }
  }, [sentences]);

  const playRound = async () => {
    clearFields();

    try {
      if (nextSentence) {
        setCurrentSentence(nextSentence);
        setHebrewSentence(nextSentence.hebrew);
        populateWordBank(nextSentence);
        setNextSentence(null);
      } else {
        const hebrew = sentences[currentSentenceIndex].trim();
        const arabic = await ApiService.translateSentence(hebrew);
        const diacritized = await ApiService.diacritizeSentence(arabic);
        const taatik = await ApiService.generateTaatik(diacritized);
        const audio = new Audio(await ApiService.generateSentenceAudio(diacritized));

        const sentence: Sentence = {
          hebrew,
          arabic,
          diacritized,
          taatik,
          audio
        };

        setCurrentSentence(sentence);
        setHebrewSentence(sentence.hebrew);
        populateWordBank(sentence);
      }
      
      setLoading(false);
      preloadNextSentence();
    } catch (error) {
      console.error('Error playing round:', error);
    }
  };

  const populateWordBank = (sentence: Sentence) => {
    setBankWords(shuffleArray(sentence.arabic.replace('?', '').trim().split(' ')));
  };

  const handleWordClick = (word: string, source: string) => {
    if (source === 'bank') {
      setConstructAreaWords([...constructAreaWords, word]);
      setBankWords(bankWords.filter((w) => w !== word));
    } else if (source === 'construct') {
      setBankWords([...bankWords, word]);
      setConstructAreaWords(constructAreaWords.filter((w) => w !== word));
    }
  };

  const checkAnswer = () => {
    const userAnswer = constructAreaWords.join(' ');
    const correctAnswer = currentSentence?.arabic.replace('?', '');

    setLoading(true);

    setArabicSentence(currentSentence?.diacritized || '');
    setTaatikSentence(currentSentence?.taatik || '');
    setShowCorrectAnswer(true);

    if (userAnswer === correctAnswer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const nextQuestion = () => {
    setShowCorrectAnswer(false);
    setCurrentSentenceIndex((prevIndex) => (prevIndex + 1) % sentences.length);
    playRound();
  }

  const preloadNextSentence = async () => {
    const nextIndex = (currentSentenceIndex + 1) % sentences.length;
    const hebrew = sentences[nextIndex].trim();
    const arabic = await ApiService.translateSentence(hebrew);
    const diacritized = await ApiService.diacritizeSentence(arabic);
    const taatik = await ApiService.generateTaatik(diacritized);
    const audioUrl = await ApiService.generateSentenceAudio(diacritized);
    setNextSentence({ hebrew, arabic, diacritized, taatik, audio: new Audio(audioUrl) });
  }

  function clearFields() {
    setHebrewSentence('');
    setConstructAreaWords([]);
    setBankWords([]);  
  }

  return (
    <>
      <ProgressBar percentage={35}></ProgressBar>
      <h2>תרגמו את המשפט</h2>
      <HebrewSentence>{hebrewSentence}</HebrewSentence>
      <ConstructSentenceArea words={constructAreaWords} onWordClick={loading ? () => {} : (word) => handleWordClick(word, 'construct')} />
      <WordBank words={bankWords} onWordClick={loading ? () => {} : (word) => handleWordClick(word, 'bank')} />
      <CheckButton disabled={!constructAreaWords.length && true} onClick={showCorrectAnswer ? nextQuestion : checkAnswer}>
        {showCorrectAnswer ? 'המשך' : 'בדיקה'}
      </CheckButton>
      <CorrectAnswer show={showCorrectAnswer} isCorrect={isCorrect}
                     arabic={arabicSentence} taatik={taatikSentence} />
    </>
  );
}

export default App;
