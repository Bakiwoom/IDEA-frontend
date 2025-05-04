import React, { useState, useRef, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../assets/css/chatbot/chatbot.css';

function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (!listening && transcript) {
      handleSend();
    }
    // eslint-disable-next-line
  }, [listening]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    resetTranscript();

    try {
      const response = await fetch('http://localhost:8000/chatbot/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          user_type: '장애인'
        }),
      });

      const data = await response.json();

      const botMessage = {
        id: Date.now() + 1,
        text: data.answer,
        isUser: false,
        cards: data.cards,
        createdAt: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1.5,
    slidesToScroll: 1,
    arrows: false
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span>IDEA 챗봇</span>
        <div>
          <span>상담원</span>
          <button 
            className="close-button"
            onClick={onClose}
            style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map(message => (
          <div key={message.id} className={`message-row ${message.isUser ? 'user' : 'bot'}`}>
            <div className={`message-bubble ${message.isUser ? 'user' : 'bot'}`}>
              {message.text}
            </div>
            <div className="message-time">{formatTime(message.createdAt)}</div>
            {message.cards && (
              <Slider className="card-slider" {...sliderSettings}>
                {message.cards.map(card => (
                  <div key={card.id} className="info-card" onClick={() => window.location.href = card.link}>
                    <img className="card-image" src={card.imageUrl} alt={card.title} />
                    <div className="card-content">
                      <h3 className="card-title">{card.title}</h3>
                      <p className="card-description">{card.description}</p>
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          className="chat-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="메시지를 입력하세요..."
        />
        {browserSupportsSpeechRecognition && (
          <button
            className={`voice-button ${listening ? 'listening' : ''}`}
            onClick={toggleListening}
          >
            {listening ? '🔴' : '🎤'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Chatbot; 