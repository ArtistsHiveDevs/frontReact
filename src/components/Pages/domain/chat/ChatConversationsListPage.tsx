import Fab from '@mui/material/Fab';
import { useEffect, useState } from 'react';
import { ResultElement } from '~/components/shared/search/result-element';
import { SearchableProfileTemplate } from '~/models/base';
import { EntityType } from '~/models/base/modelHelpers';
import './ChatConversationsListPage.scss';

const ChatConversationsListPage = () => {
  const [isFixed, setIsFixed] = useState(false);

  const checkContainerOverflow = () => {
    const container = document.querySelector('.conversations-list') as HTMLElement;
    if (container) {
      // Verificamos si el contenedor tiene un scroll
      const isOverflowing = container.scrollHeight > container.clientHeight;

      // Si el contenedor tiene scroll, el contenido es más grande que el contenedor
      if (isOverflowing) {
        setIsFixed(true); // Fijamos el FAB si hay scroll
      } else {
        setIsFixed(false); // Si no hay scroll, dejamos el FAB en el final del contenedor
      }
    }
  };

  useEffect(() => {
    // Verifica la posición del contenedor y el scroll
    window.addEventListener('resize', checkContainerOverflow);
    checkContainerOverflow(); // Verificación inicial

    console.log(isFixed);
    return () => {
      window.removeEventListener('resize', checkContainerOverflow);
    };
  }, []);

  const onBackClick = () => {
    console.log('Back');
  };

  const onMoreOptionsClick = () => {
    console.log('More options');
  };

  const onAddChat = () => {
    console.log('AddChat');
  };

  const conversations = [
    {
      avatar: '',
      title: 'Title',
    },
  ];

  const chats: SearchableProfileTemplate[] = new Array(100).fill(null).map((_, index: number) => {
    return {
      name: `Chat ${index}`,
      subtitle: 'Mensaje',
      avatarURL: () => 'asdas',
    };
  });
  return (
    <div className="conversations-list">
      {/* <header className="header">
        <div onClick={onBackClick}>
          <DynamicIcons iconName="md MdArrowBackIos" size={24} />
        </div>
        <h1 className="title">Title</h1>
        <div onClick={onBackClick}>
          <DynamicIcons iconName="md MdMoreVert" size={24} />
        </div>
      </header> */}
      <h1>Mis conversaciones</h1>
      <div className="body">
        {chats.map((element, idx) => {
          let elementType = EntityType.CHAT_CONVERSATION;

          return (
            <div style={{ padding: '0.5rem' }}>
              <ResultElement
                key={`full-${element.name}-${element.id}${idx}`}
                element={element}
                elementType={elementType}
                onClick={() => console.log(element.name)}
              />
            </div>
          );
        })}
      </div>
      <Fab className={`fab ${isFixed ? 'fixed' : ''}`} color="primary" aria-label="add" onClick={() => onAddChat()}>
        +
      </Fab>
    </div>
  );
};

export default ChatConversationsListPage;
