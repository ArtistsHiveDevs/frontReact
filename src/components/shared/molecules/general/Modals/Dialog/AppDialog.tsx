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
}) => {
  return (
    params && (
      <Dialog id="zoomAlbumImg" open={params.isOpenDialog} onClose={() => params.onClose()} fullWidth>
        <DialogTitle className="dialog-title">
          {params.title}
          <IconButton onClick={() => params.onClose()} className="close-icon">
            <DynamicIcons iconName="MdClose" />
          </IconButton>
        </DialogTitle>
        <DialogContent className="zoom-dialog">
          <div>
            <div className="dialog-content">{params.content}</div>
            {!!params.icon && (
              <div className="dialog-icon">
                <DynamicIcons iconName={params.icon} size={40} color={'white'} />
              </div>
            )}
          </div>
          <div className="dialog-actions">
            {params.actions?.length &&
              params.actions.map((action) => (
                <Button key={action.label} onClick={() => action.handler()}>
                  {action.label}
                </Button>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    )
  );
};
