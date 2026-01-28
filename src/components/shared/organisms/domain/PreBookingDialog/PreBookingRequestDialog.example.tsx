// import { useState } from 'react';
// import { Button } from '@mui/material';
// import { PreBookingRequestDialog } from './PreBookingRequestDialog';

// /**
//  * Ejemplo de uso del PreBookingRequestDialog
//  * Este componente muestra cómo integrar el dialog en tu aplicación
//  */
// export const PreBookingRequestDialogExample = () => {
//   const [dialogOpen, setDialogOpen] = useState(false);

//   // Mock data - en producción esto vendría de Redux o API
//   const availableParticipants = [
//     { value: 'user-1', label: 'John Doe' },
//     { value: 'user-2', label: 'Jane Smith' },
//     { value: 'user-3', label: 'Bob Johnson' },
//     { value: 'user-4', label: 'Alice Williams' },
//   ];

//   const currentUserId = 'current-user-id';

//   const handleSubmit = (formData: any) => {
//     console.log('Form submitted:', formData);

//     // TODO: Crear el PreBookingRequestModel y dispatchar action
//     // Ejemplo:
//     // const newRequest = new PreBookingRequestModel({ ...formData });
//     // dispatch(actionsPreBookingRequests.itemCreate(newRequest));
//   };

//   return (
//     <div>
//       <Button variant="contained" onClick={() => setDialogOpen(true)}>
//         Crear Pre-Reserva
//       </Button>

//       <PreBookingRequestDialog
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//         onSubmit={handleSubmit}
//         // availableParticipants={availableParticipants}
//         currentUserId={currentUserId}
//       />
//     </div>
//   );
// };
