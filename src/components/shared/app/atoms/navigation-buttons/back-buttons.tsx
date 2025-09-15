import { useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import './back-buttons.scss';

export const BackButton = () => {
  const { goBack } = useNavigation();
  const { translateText, translateGlobalDict } = useI18n();

  return (
    <div className="back-button-container">
      <div style={{ width: 'fit-content' }} onClick={() => goBack()}>
        <DynamicIcons iconName="io5 IoChevronBackOutline" size={'2rem'} customStyle={{ padding: '0rem' }} />{' '}
        {translateGlobalDict('actions.navigation.back')}
      </div>
    </div>
  );
};
