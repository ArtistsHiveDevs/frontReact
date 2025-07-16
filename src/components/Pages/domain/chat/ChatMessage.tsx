import dayjs from 'dayjs';
import React, { useState } from 'react';
import './ChatMessage.scss';

interface ChatMessageProps {
  message: {
    _id: string;
    sender: string;
    content: string;
    timestamp: any;
  };
  isOwn: boolean;
  isFirstMessage: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwn, isFirstMessage }) => {
  const [reactionsVisible, setReactionsVisible] = useState(false);
  const toggleReactions = () => setReactionsVisible(!reactionsVisible);

  const messageDate = dayjs(message.timestamp);
  // const isToday = messageDate.isToday();
  // const isYesterday = messageDate.isYesterday();

  return (
    <div className={`chat-message ${isOwn ? 'own' : ''}`}>
      {/* Avatar fuera del bocadillo */}
      {isFirstMessage && !isOwn && (
        <div className="avatar left">
          <img src={`https://api.adorable.io/avatars/40/${message.sender}.png`} alt="avatar" />
        </div>
      )}
      {isFirstMessage && isOwn && (
        <div className="avatar right">
          <img src={`https://api.adorable.io/avatars/40/${message.sender}.png`} alt="avatar" />
        </div>
      )}

      {/* Mensaje */}
      <div className="message-content-container">
        <div className="message-content">{message.content}</div>
        <div className="message-time">
          {messageDate.format('DD MMM YYYY')}
          {/* {isToday ? 'Hoy' : isYesterday ? 'Ayer' : messageDate.format('DD MMM YYYY')} */}
        </div>
      </div>

      {/* Botón de reacción flotante */}
      <div className="reactions" onClick={toggleReactions}>
        😊
      </div>

      {reactionsVisible && (
        <div className="reaction-options">
          <span>👍</span>
          <span>❤️</span>
          <span>😂</span>
        </div>
      )}
    </div>
  );
};
