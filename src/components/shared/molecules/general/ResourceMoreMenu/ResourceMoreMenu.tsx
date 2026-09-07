import { Snackbar, SnackbarCloseReason } from '@mui/material';
import { useState } from 'react';
import { useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { ReportProfileForm } from '~/components/shared/molecules/Profile/ReportProfileForm/ReportProfileForm';
import BurgerProfileMenu from '~/components/shared/molecules/general/burgerProfileMenu/burgerProfileMenu';
import { PATHS } from '~/constants';
import { ProfileMenuOptionsData, ProfileMenuOptionsType } from '~/constants/domain/profile.constants';

export interface ResourceMoreMenuOption {
  option: string;
  id: number;
  translate?: string;
  defalutText?: string;
  icon?: string;
  color?: string;
  show: boolean;
  onClick?: () => void;
}

export interface ResourceMoreMenuProps {
  /** Usuario logueado; se usa para exigir sesión antes de reportar. */
  loggedUser: any;
  /** El usuario actual es dueño/actor de este recurso (habilita Editar, deshabilita Reportar). */
  isOwner?: boolean;
  /** El usuario actual tiene algún acceso/membresía sobre este recurso, aunque no sea el "isOwner" actual (deshabilita Reportar). */
  hasAccess?: boolean;
  onEdit?: () => void;
  /** Si no se pasa onShare, compartir copia esta URL al portapapeles. */
  shareUrl?: string;
  onShare?: () => void;
  /** Entidad a reportar (Artist/Place); si se pasa, "Reportar" abre el formulario de reporte por defecto. */
  reportEntity?: any;
  onReport?: () => void;
  /** Override total de las opciones del menú; si se pasa, ignora el cálculo de visibilidad por defecto. */
  options?: ResourceMoreMenuOption[];
}

/**
 * Menú de "más acciones" (hamburguesa) genérico para cualquier recurso con dueño
 * (perfiles, open calls, etc). Por defecto arma Editar/Compartir/Reportar con la
 * visibilidad que le corresponde según isOwner/hasAccess; se puede pasar `options`
 * para reemplazar esas 3 acciones por completo.
 */
export const ResourceMoreMenu = ({
  loggedUser,
  isOwner = false,
  hasAccess = false,
  onEdit,
  shareUrl,
  onShare,
  reportEntity,
  onReport,
  options,
}: ResourceMoreMenuProps) => {
  const { translateGlobalDict } = useI18n();
  const { navigateToInnerPath } = useNavigation();

  const [showReportForm, setShowReportForm] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');

  const canShare = !!onShare || !!shareUrl;
  const canReport = !isOwner && !hasAccess && (!!onReport || !!reportEntity);

  const menuOptions: ResourceMoreMenuOption[] =
    options ||
    ProfileMenuOptionsData.map((option) => {
      switch (option.option) {
        case ProfileMenuOptionsType.EDIT:
          return { ...option, show: isOwner && !!onEdit };
        case ProfileMenuOptionsType.SHARE:
          return { ...option, show: canShare };
        case ProfileMenuOptionsType.REPORT:
          return { ...option, show: canReport };
        default:
          return option;
      }
    });

  const handleShare = () => {
    if (onShare) {
      onShare();
      return;
    }
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setSnackBarMessage(translateGlobalDict('actions.link_copied_to_clipboard'));
      setShowSnackBar(true);
    }
  };

  const handleReport = () => {
    if (!loggedUser) {
      navigateToInnerPath({ path: PATHS.LOGIN });
      return;
    }
    if (onReport) {
      onReport();
      return;
    }
    if (reportEntity) {
      setShowReportForm(true);
    }
  };

  const handleCloseSnackBar = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSnackBar(false);
  };

  const handleClickOption = (optionId: number) => {
    const selectedOption = menuOptions.find((option) => option.id === optionId);

    if (selectedOption?.onClick) {
      selectedOption.onClick();
      return;
    }

    switch (selectedOption?.option) {
      case ProfileMenuOptionsType.SHARE:
        handleShare();
        break;
      case ProfileMenuOptionsType.EDIT:
        onEdit?.();
        break;
      case ProfileMenuOptionsType.REPORT:
        handleReport();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <BurgerProfileMenu
        globalDictionary={translateGlobalDict}
        options={menuOptions}
        onClickOption={handleClickOption}
      />
      <Snackbar open={showSnackBar} autoHideDuration={2000} onClose={handleCloseSnackBar} message={snackBarMessage} />
      {reportEntity && loggedUser && (
        <ReportProfileForm open={showReportForm} onClose={() => setShowReportForm(false)} entity={reportEntity} />
      )}
    </>
  );
};

export default ResourceMoreMenu;
