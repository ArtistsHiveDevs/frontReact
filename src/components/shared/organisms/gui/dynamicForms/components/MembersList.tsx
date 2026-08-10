import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { DynamicFieldData } from '../dynamic-control-types';
import { ComponentGeneratorParams, DynamicControl } from '../DynamicControl';
import { DynamicForm } from '../dynamic-form';
import { useForm, useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { Box, Typography, TextField, IconButton, Paper, Button, Stack } from '@mui/material';
import { DynamicIcons } from '~/components/shared/DynamicIcons';

export const createMembersList = (params: ComponentGeneratorParams) => {
  const { fieldData, handlers } = params;
  const { componentParams, config, fieldName } = fieldData;
  const { fields, dialogTitle = '' } = componentParams;

  const formMethods = useForm({
    mode: 'onChange', // Validar en cada cambio
    reValidateMode: 'onChange', // Re-validar en cada cambio
  });

  const [showAddMember, setShowAddMember] = useState(false);
  const [memberList, setMemberList] = useState([]);

  const hookContext = useFormContext();
  const finalContext = hookContext;
  const { register, formState } = finalContext;
  const { errors } = formState || {};

  config.value = memberList;

  // console.log({fieldsNames, fields})

  const customHandlers = {
    ...handlers,
    onSubmit: (event: any) => {
      const data = [event];
      const totalValues = [...memberList, ...data];
      setMemberList(totalValues);
      setShowAddMember(false);
    },
  };

  const handleRemoveItem = (memberName: string) =>{
    const data = memberList?.filter((member) => member?.memberNames !== memberName);
    setMemberList(data);
  }

  return (
    <>
      <Box
        {...(register ? register(fieldName, config) : {})}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          p: 2,
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4 },
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            minWidth: 150,
            height: 200,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)', // Increases size by 5%
              boxShadow: 6, // Mimics rising elevation
            },
          }}
        >
          <Button
            sx={{
              width: '100%',
              height: '100%',
              flexDirection: 'column',
              '& .MuiButton-startIcon': {
                margin: 0,
              },
            }}
            component="label"
            startIcon={<DynamicIcons iconName={'FaUserPlus'} size={80} customStyle={{ padding: 0 }} />}
            onClick={() => setShowAddMember(true)}
          >
            Add
          </Button>
        </Paper>
        {memberList?.map((member, index) => (
          <>
            <Paper
              key = {`members_${index}`}
              variant="outlined"
              sx={{
                minWidth: 250,
                height: 200,
                flexShrink: 0,
                display: 'flex',
                'flex-wrap': 'wrap',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '20px',
                paddingRight: '20px',
                borderRadius: 2,
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)', // Increases size by 5%
                  boxShadow: 6, // Mimics rising elevation
                },
              }}
            >
              <Stack spacing={2}>
                {fields?.map((field: any) => (
                <div><strong>{field.label}:</strong> {member?.[`${field.fieldName}`]}</div>
                ))}
                {/* <div>Nombre: {member.memberNames}</div>
                <div>Apellidos: {member.memberSurebames}</div>
                <div>Rol: {member.memberRole}</div>
                {member?.memberPlayFor && <div>Instrumento: {member.memberPlayFor}</div>} */}
              </Stack>
              <IconButton
                size="small"
                aria-label="delete image"
                sx={{
                  position: 'absolute',
                  top: -15,
                  right: -8,
                }}
                onClick={() => handleRemoveItem(member.memberNames)}
              >
                <DynamicIcons iconName="FaTimesCircle" size={25} customStyle={{ cursor: 'pointer' }} />
              </IconButton>
            </Paper>
          </>
        ))}
      </Box>

      <AppDialog
        title={dialogTitle}
        content={
          <DynamicForm fields={fields} handlers={customHandlers} formMethods={formMethods} translationBasePath="" />
        }
        isOpenDialog={showAddMember}
        onClose={() => true}
        key={`dialog_${fieldData.fieldName}`}
      />
    </>
  );
};
