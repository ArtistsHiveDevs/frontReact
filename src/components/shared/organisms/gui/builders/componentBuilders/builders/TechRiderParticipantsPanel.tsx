import { useState } from 'react';
import { TextareaAutosize } from '@mui/material';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { ParticipantSelectorHeader } from '~/components/shared/molecules/ParticipantSelectorHeader/ParticipantSelectorHeader';

interface TechRiderParticipantsPanelProps {
  participants: CurrentProfileInfoModel[];
  texts: string[];
  isEditable?: boolean;
  onChange?: (participantIndex: number, value: string) => void;
}

export const TechRiderParticipantsPanel = ({
  participants,
  texts,
  isEditable,
  onChange,
}: TechRiderParticipantsPanelProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [localTexts, setLocalTexts] = useState<string[]>(texts);

  const handleTextChange = (value: string) => {
    setLocalTexts((prev) => {
      const updated = [...prev];
      updated[activeIndex] = value;
      return updated;
    });
    onChange?.(activeIndex, value);
  };

  return (
    <>
      <ParticipantSelectorHeader
        participants={participants}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
      />

      <div style={{ marginTop: '0.5rem' }}>
        {isEditable ? (
          <TextareaAutosize
            key={activeIndex}
            value={localTexts[activeIndex] ?? ''}
            onChange={(e) => handleTextChange(e.target.value)}
            minRows={4}
            maxRows={10}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '8.5px 14px',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.23)',
              background: 'transparent',
              color: 'inherit',
              font: 'inherit',
              resize: 'none',
              outline: 'none',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#90caf9')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.23)')}
          />
        ) : (
          <span>{localTexts[activeIndex]}</span>
        )}
      </div>
    </>
  );
};
