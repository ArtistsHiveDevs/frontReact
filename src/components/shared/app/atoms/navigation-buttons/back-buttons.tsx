import { useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import './back-buttons.scss';

export interface BackButtonParams {
  onClick?: Function;
}

export const BackButton = (params: BackButtonParams) => {
  const { onClick } = params;
  const { goBack } = useNavigation();
  const { translateText, translateGlobalDict } = useI18n();

  const handleClick = async () => {
    if (!!onClick && onClick instanceof Function) {
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
