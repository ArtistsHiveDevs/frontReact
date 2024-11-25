import React, { useState } from 'react';
import { useI18n } from '~/common/utils';
import { TRANSLATION_BASE_GLOBAL_DICT_ACTIONS } from '~/components/shared/organisms/gui/dynamicForms';

type ExpandableTextProps = {
  text: string;
  wordLimit?: number; // Permite configurar el límite de palabras opcionalmente
};

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, wordLimit = 50 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { translateText } = useI18n();

  // Divide el texto en palabras
  const words = text.split(' ');

  // Verifica si el texto supera el límite de palabras
  const textRequiresToBeTruncated = words.length > wordLimit;

  // Muestra solo el texto truncado si no está expandido
  const displayedText = isExpanded
    ? text
    : words.slice(0, wordLimit).join(' ') + (textRequiresToBeTruncated ? '...' : '');

  const textSeeMore = isExpanded
    ? translateText(`${TRANSLATION_BASE_GLOBAL_DICT_ACTIONS}.show_less`)
    : `${translateText(`${TRANSLATION_BASE_GLOBAL_DICT_ACTIONS}.show_more`)}`;

  return (
    <>
      {!textRequiresToBeTruncated && <>{text}</>}
      {textRequiresToBeTruncated && (
        <div>
          <p>{displayedText}</p>
          {textRequiresToBeTruncated && (
            <div className="btn-see-more" onClick={() => setIsExpanded(!isExpanded)} style={{ textAlign: 'center' }}>
              {textSeeMore}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ExpandableText;
