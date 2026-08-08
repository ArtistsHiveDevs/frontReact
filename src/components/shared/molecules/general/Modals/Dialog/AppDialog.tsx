import { Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import './AppDialog.scss';

export const AppDialog = (params: {
  isOpenDialog: boolean;
  onClose: Function;
  title?: string;
  content: any;
  icon?: string;
  actions?: { label: string; handler: Function }[];
  fullScreen?: boolean;
}) => {
  // Solo renderizar el Dialog cuando está abierto para optimizar memoria
  if (!params?.isOpenDialog) {
    return null;
  }

  return (
    <Dialog
      className="dialog-styles"
      id="zoomAlbumImg"
      open={params.isOpenDialog}
      onClose={() => params.onClose()}
      fullWidth
      fullScreen={params.fullScreen}
    >
      <DialogTitle className="dialog-title">
        {params.title}
        <IconButton onClick={() => params.onClose()} className="close-icon">
          <DynamicIcons iconName="MdClose" />
        </IconButton>
      </DialogTitle>
      <DialogContent className="zoom-dialog">
        <div className="dialog-content">{params.content}</div>
        {!!params.icon && (
          <div className="dialog-icon">
            <DynamicIcons iconName={params.icon} size={40} color={'white'} />
          </div>
        )}
        {!!params.actions?.length && (
          <div className="dialog-actions">
            {params.actions.map((action) => (
              <Button key={action.label} onClick={() => action.handler()}>
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
