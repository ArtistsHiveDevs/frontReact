import { Box, Card, CardContent, TextField, Typography } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';
import './CC.scss';

const CCPage = () => {
  const [textValue, setTextValue] = useState<string>('');
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const qrRef = useRef<HTMLDivElement>(null);

  const generateQRImage = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) {
      return;
    }

    // Crear un nuevo canvas con padding y espacio para texto
    const padding = 80;
    const textHeight = 100; // Espacio para el texto debajo del QR
    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d');
    if (!ctx) return;

    // Establecer tamaño del nuevo canvas con padding y espacio para texto
    newCanvas.width = canvas.width + padding * 2;
    newCanvas.height = canvas.height + padding * 2 + textHeight;

    // Rellenar con blanco
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    // Dibujar el QR original (mantener proporciones cuadradas)
    ctx.drawImage(canvas, padding, padding, canvas.width, canvas.height);

    // Agregar texto debajo del QR
    ctx.fillStyle = 'black';
    ctx.font = '120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textY = padding + canvas.height + textHeight;
    ctx.fillText(textValue, newCanvas.width / 2, textY);

    // Convertir canvas con padding a blob
    newCanvas.toBlob((blob) => {
      if (!blob) return;

      // Limpiar URL anterior si existe
      if (qrImageUrl) {
        URL.revokeObjectURL(qrImageUrl);
      }

      // Crear nueva URL
      const url = URL.createObjectURL(blob);
      setQrImageUrl(url);
    });
  };

  // Generar imagen automáticamente cuando cambia el texto
  useEffect(() => {
    if (textValue.trim()) {
      // Pequeño delay para que el canvas se renderice
      const timer = setTimeout(() => {
        generateQRImage();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Limpiar imagen si no hay texto
      if (qrImageUrl) {
        URL.revokeObjectURL(qrImageUrl);
        setQrImageUrl('');
      }
    }
  }, [textValue]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (qrImageUrl) {
        URL.revokeObjectURL(qrImageUrl);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        // padding: '20px',
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%', padding: '20px' }}>
        <CardContent>
          <Box sx={{ marginBottom: '20px' }}>
            <Box sx={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <TextField
                variant="outlined"
                fullWidth
                multiline
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Referencia"
              />
            </Box>
          </Box>

          {/* Canvas oculto para generar el QR */}
          <div style={{ display: 'none' }} ref={qrRef}>
            {textValue.trim() && <QRCodeCanvas value={textValue} size={256} level="H" />}
          </div>

          {/* QR Code Display como imagen */}
          {qrImageUrl && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '30px',
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src={qrImageUrl}
                alt="QR Code"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  border: '2px solid white',
                  borderRadius: '8px',
                }}
              />
            </Box>
          )}

          {!qrImageUrl && (
            <Box
              sx={{
                padding: '40px',
                textAlign: 'center',
                color: 'text.secondary',
                backgroundColor: '#fafafa',
                borderRadius: '8px',
                marginTop: '20px',
              }}
            >
              <Typography variant="body1">Ingresa un texto para generar el código QR</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CCPage;
