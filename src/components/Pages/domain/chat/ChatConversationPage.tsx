import dayjs from 'dayjs';
import React from 'react';
import './ChatConversationPage.scss';
import { ChatMessage } from './ChatMessage';

interface Message {
  _id: string;
  sender: string;
  content: string;
  timestamp: number; // timestamp de tipo número
}

interface ChatWindowProps {
  messages: Message[];
  currentUser: string;
}

const generateMessages = (currentUser: string) => {
  const users = ['user1', 'user2', 'user3'];
  const messages = [];

  for (let i = 0; i < 100; i++) {
    const sender = users[Math.floor(Math.random() * users.length)];
    const timestamp = dayjs()
      .subtract(Math.floor(Math.random() * 10), 'days')
      .unix(); // Mensajes de hasta 10 días atrás
    messages.push({
      _id: `msg_${i}`,
      sender,
      content: `Message content ${i + 1}`,
      timestamp,
    });
  }

  return messages;
};

const messagesGen = generateMessages('user1'); // Asumiendo que el usuario actual es 'user1'

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, currentUser }) => {
  let lastDateLabel = '';

  const renderedMessages = messagesGen.map((message, index) => {
    const currentLabel = dayjs(message.timestamp).format('YYYY-MM-DD');
    const showDateLabel = currentLabel !== lastDateLabel;
    lastDateLabel = currentLabel;
    const isOwn = Math.random() > 0.5;
    message.content += `(${isOwn ? 'O' : 'N'})`;

    return (
      <React.Fragment key={message._id}>
        {showDateLabel && <div className="date-label">{dayjs(message.timestamp).format('DD MMM YYYY')}</div>}
        <ChatMessage
          message={message}
          isOwn={isOwn}
          isFirstMessage={index === 0 || messagesGen[index - 1].sender !== message.sender}
        />
      </React.Fragment>
    );
  });

  return <div className="chat-window">{renderedMessages}</div>;
};

export default ChatWindow;
