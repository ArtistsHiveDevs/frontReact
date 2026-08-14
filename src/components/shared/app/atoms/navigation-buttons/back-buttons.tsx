import { RefObject } from 'react';
import { useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { DynamicTabbedFormRef } from '~/components/shared/organisms/gui/dynamicForms/DynamicTabbedForm';
import './back-buttons.scss';

export interface BackButtonParams {
  onClick?: Function;
  formRef?: RefObject<DynamicTabbedFormRef>;
  submitDelay?: number;
  skipEmptySubmit?: boolean;
}

export const BackButton = (params: BackButtonParams) => {
  const { onClick, formRef, submitDelay = 1500, skipEmptySubmit = true } = params;
  const { goBack } = useNavigation();
  const { translateText, translateGlobalDict } = useI18n();

  const handleClick = async () => {
    // Si se proporciona una ref del formulario, ejecutar submit
    if (formRef?.current) {
      try {
        // Si skipEmptySubmit está activado, verificar que haya cambios antes de hacer submit
        if (skipEmptySubmit && formRef.current.getModifiedFields) {
          const modifiedFields = formRef.current.getModifiedFields();
          const hasChanges = modifiedFields && Object.keys(modifiedFields).length > 0;

          if (!hasChanges) {
            goBack();
            return;
          }
        }

        await formRef.current.submit();
        // Esperar a que el saga complete
        await new Promise((resolve) => setTimeout(resolve, submitDelay));
      } catch (error) {
        console.error('Error en submit:', error);
      }
    }
    // Si hay un onClick personalizado, ejecutarlo (mantiene retrocompatibilidad)
    else if (!!onClick && onClick instanceof Function) {
      await onClick();
    }

    goBack();
  };

  return (
    <div className="back-button-container">
      <div style={{ width: 'fit-content' }} onClick={handleClick}>
        <DynamicIcons iconName="io5 IoChevronBackOutline" size={'2rem'} customStyle={{ padding: '0rem' }} />{' '}
        {translateGlobalDict('actions.navigation.back')}
      </div>
    </div>
  );
};
