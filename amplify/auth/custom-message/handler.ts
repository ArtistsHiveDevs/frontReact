import type { CustomMessageTriggerHandler } from 'aws-lambda';

/* =========================
   Types
========================= */

interface Translation {
  subject: string;
  title: string;
  welcome: string;
  codeLabel: string;
  footer: string;
  allRightsReserved: string;
  termsOfUse: string;
  privacyPolicy: string;
  autoMessage: string;
  forgotPasswordSubject: string;
  forgotPasswordTitle: string;
  forgotPasswordWelcome: string;
}

/* =========================
   Translations
========================= */

const translations: Record<string, Translation> = {
  en: {
    subject: 'Your verification code',
    title: 'Welcome to Artist Hive!',
    welcome: 'Thank you for registering. Use the following code to verify your account.',
    codeLabel: 'Verification Code',
    footer: 'This code expires in 24 hours. If you did not request this code, please ignore this email.',
    allRightsReserved: 'All rights reserved.',
    termsOfUse: 'Terms of Use',
    privacyPolicy: 'Privacy Policy',
    autoMessage: 'This is an automated message. Please do not reply to this email.',
    forgotPasswordSubject: 'Reset your password',
    forgotPasswordTitle: 'Reset your password',
    forgotPasswordWelcome: 'We received a request to reset your password. Use the following code to proceed.',
  },
  es: {
    subject: 'Tu código de verificación',
    title: '¡Bienvenido a Artist Hive!',
    welcome: 'Gracias por registrarte. Usa el siguiente código para verificar tu cuenta.',
    codeLabel: 'Código de verificación',
    footer: 'Este código expira en 24 horas. Si no solicitaste este código, ignora este correo.',
    allRightsReserved: 'Todos los derechos reservados.',
    termsOfUse: 'Términos de uso',
    privacyPolicy: 'Política de privacidad',
    autoMessage: 'Este es un mensaje automático. No respondas a este correo.',
    forgotPasswordSubject: 'Restablece tu contraseña',
    forgotPasswordTitle: 'Restablece tu contraseña',
    forgotPasswordWelcome: 'Recibimos una solicitud para restablecer tu contraseña. Usa el siguiente código para continuar.',
  },
  de: {
    subject: 'Ihr Bestätigungscode',
    title: 'Willkommen bei Artist Hive!',
    welcome: 'Vielen Dank für Ihre Registrierung. Verwenden Sie den folgenden Code, um Ihr Konto zu bestätigen.',
    codeLabel: 'Bestätigungscode',
    footer: 'Dieser Code läuft in 24 Stunden ab. Wenn Sie diesen Code nicht angefordert haben, ignorieren Sie diese E-Mail.',
    allRightsReserved: 'Alle Rechte vorbehalten.',
    termsOfUse: 'Nutzungsbedingungen',
    privacyPolicy: 'Datenschutzrichtlinie',
    autoMessage: 'Dies ist eine automatische Nachricht. Bitte antworten Sie nicht auf diese E-Mail.',
    forgotPasswordSubject: 'Passwort zurücksetzen',
    forgotPasswordTitle: 'Passwort zurücksetzen',
    forgotPasswordWelcome: 'Wir haben eine Anfrage zum Zurücksetzen Ihres Passworts erhalten. Verwenden Sie den folgenden Code.',
  },
  fr: {
    subject: 'Votre code de vérification',
    title: 'Bienvenue sur Artist Hive!',
    welcome: 'Merci pour votre inscription. Utilisez le code suivant pour vérifier votre compte.',
    codeLabel: 'Code de vérification',
    footer: "Ce code expire dans 24 heures. Si vous n'avez pas demandé ce code, veuillez ignorer cet e-mail.",
    allRightsReserved: 'Tous droits réservés.',
    termsOfUse: "Conditions d'utilisation",
    privacyPolicy: 'Politique de confidentialité',
    autoMessage: 'Ceci est un message automatique. Veuillez ne pas répondre à cet e-mail.',
    forgotPasswordSubject: 'Réinitialisez votre mot de passe',
    forgotPasswordTitle: 'Réinitialisez votre mot de passe',
    forgotPasswordWelcome: "Nous avons reçu une demande de réinitialisation de votre mot de passe. Utilisez le code suivant.",
  },
  it: {
    subject: 'Il tuo codice di verifica',
    title: 'Benvenuto su Artist Hive!',
    welcome: 'Grazie per esserti registrato. Usa il seguente codice per verificare il tuo account.',
    codeLabel: 'Codice di verifica',
    footer: 'Questo codice scade tra 24 ore. Se non hai richiesto questo codice, ignora questa email.',
    allRightsReserved: 'Tutti i diritti riservati.',
    termsOfUse: 'Termini di utilizzo',
    privacyPolicy: 'Informativa sulla privacy',
    autoMessage: 'Questo è un messaggio automatico. Si prega di non rispondere a questa email.',
    forgotPasswordSubject: 'Reimposta la tua password',
    forgotPasswordTitle: 'Reimposta la tua password',
    forgotPasswordWelcome: 'Abbiamo ricevuto una richiesta di reimpostazione della password. Usa il codice seguente.',
  },
  pt: {
    subject: 'Seu código de verificação',
    title: 'Bem-vindo ao Artist Hive!',
    welcome: 'Obrigado por se registrar. Use o código a seguir para verificar sua conta.',
    codeLabel: 'Código de verificação',
    footer: 'Este código expira em 24 horas. Se você não solicitou este código, ignore este e-mail.',
    allRightsReserved: 'Todos os direitos reservados.',
    termsOfUse: 'Termos de uso',
    privacyPolicy: 'Política de privacidade',
    autoMessage: 'Esta é uma mensagem automática. Por favor, não responda a este e-mail.',
    forgotPasswordSubject: 'Redefina sua senha',
    forgotPasswordTitle: 'Redefina sua senha',
    forgotPasswordWelcome: 'Recebemos uma solicitação para redefinir sua senha. Use o código a seguir.',
  },
  el: {
    subject: 'Ο κωδικός επαλήθευσής σας',
    title: 'Καλώς ήρθατε στο Artist Hive!',
    welcome: 'Ευχαριστούμε για την εγγραφή σας. Χρησιμοποιήστε τον παρακάτω κωδικό για να επαληθεύσετε τον λογαριασμό σας.',
    codeLabel: 'Κωδικός επαλήθευσης',
    footer: 'Αυτός ο κωδικός λήγει σε 24 ώρες. Εάν δεν ζητήσατε αυτόν τον κωδικό, αγνοήστε αυτό το email.',
    allRightsReserved: 'Με επιφύλαξη παντός δικαιώματος.',
    termsOfUse: 'Όροι χρήσης',
    privacyPolicy: 'Πολιτική απορρήτου',
    autoMessage: 'Αυτό είναι αυτόματο μήνυμα. Παρακαλούμε μην απαντήσετε σε αυτό το email.',
    forgotPasswordSubject: 'Επαναφορά κωδικού πρόσβασης',
    forgotPasswordTitle: 'Επαναφορά κωδικού πρόσβασης',
    forgotPasswordWelcome: 'Λάβαμε αίτημα επαναφοράς του κωδικού σας. Χρησιμοποιήστε τον παρακάτω κωδικό.',
  },
};

/* =========================
   Email Template Builder
========================= */

const buildEmailTemplate = (t: Translation, code: string): string => {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${t.subject} – Artist Hive®</title>

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse !important; }
    img { border: 0; height: auto; outline: none; text-decoration: none; }

    body {
      width: 100% !important;
      background-color: #F5F5F5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Helvetica, Arial, sans-serif;
    }

    .email-wrapper { width: 100%; padding: 32px 16px; }
    .email-container {
      max-width: 600px;
      background-color: #FFFFFF;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .header {
      background-color: #000000;
      padding: 28px 24px;
      text-align: center;
    }

    .hero {
      padding: 40px 28px;
      text-align: center;
      background: linear-gradient(180deg, #000000 0%, #1A1A1A 100%);
    }

    .hero h1 {
      color: #FFFFFF;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .hero p {
      color: #AAAAAA;
      font-size: 16px;
    }

    .content {
      padding: 32px 28px;
      color: #4A4A4A;
      font-size: 15px;
      line-height: 1.7;
      text-align: center;
    }

    .code-box {
      margin: 32px auto;
      display: inline-block;
      background-color: #F5F5F5;
      border: 2px solid #000000;
      border-radius: 10px;
      padding: 20px 32px;
    }

    .code-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #777777;
      margin-bottom: 8px;
    }

    .code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 10px;
      color: #000000;
      user-select: all;
    }

    .footer {
      background-color: #FAFAFA;
      padding: 28px 24px;
      text-align: center;
      border-top: 1px solid #EEEEEE;
      font-size: 12px;
      color: #777777;
    }

    @media (prefers-color-scheme: dark) {
      body { background-color: #121212 !important; }
      .email-container { background-color: #1E1E1E !important; }
      .content { color: #E0E0E0 !important; }
      .code-box {
        background-color: #2A2A2A !important;
        border-color: #FFFFFF !important;
      }
      .code { color: #FFFFFF !important; }
      .footer {
        background-color: #151515 !important;
        color: #999999 !important;
      }
    }
  </style>
</head>

<body>
  <table class="email-wrapper" role="presentation" width="100%">
    <tr>
      <td align="center">
        <table class="email-container" role="presentation">

          <!-- Header -->
          <tr>
            <td class="header">
              <img
                src="https://npcarlos.co/artistsHive_mocks/logo.png"
                alt="Artist Hive®"
                width="160"
              >
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td class="hero">
              <h1>${t.title}</h1>
              <p>${t.welcome}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content">
              <div class="code-box">
                <div class="code-label">${t.codeLabel}</div>
                <div class="code">${code}</div>
              </div>

              <p style="font-size:13px;color:#888888;">
                ${t.footer}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              <p>
                <strong>Artist Hive®</strong><br>
                2022–${currentYear}<br>
                ${t.allRightsReserved}
              </p>
              <p>
                <a href="https://artist-hive.com/terms">${t.termsOfUse}</a> ·
                <a href="https://artist-hive.com/privacy">${t.privacyPolicy}</a>
              </p>
              <p style="font-size:11px;color:#999999;">
                ${t.autoMessage}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

/* =========================
   Lambda Handler
========================= */

export const handler: CustomMessageTriggerHandler = async (event) => {
  // Intentar obtener locale de clientMetadata primero (más confiable durante signup)
  // luego de userAttributes, y finalmente fallback a 'es'
  const locale =
    event.request.clientMetadata?.locale ||
    event.request.userAttributes?.locale ||
    'es';
  const lang = locale.split('-')[0];
  const t = translations[lang] || translations.es;

  if (
    event.triggerSource === 'CustomMessage_SignUp' ||
    event.triggerSource === 'CustomMessage_ResendCode'
  ) {
    event.response.emailSubject = t.subject;
    event.response.emailMessage = buildEmailTemplate(t, event.request.codeParameter!);
  }

  if (event.triggerSource === 'CustomMessage_ForgotPassword') {
    event.response.emailSubject = t.forgotPasswordSubject;
    event.response.emailMessage = buildEmailTemplate(
      { ...t, title: t.forgotPasswordTitle, welcome: t.forgotPasswordWelcome },
      event.request.codeParameter!
    );
  }

  return event;
};
