# 🔐 Implementación de Autenticación - Artist Hive

Esta guía documenta la arquitectura de autenticación **implementada** usando Cognito + MongoDB.

---

## ⚠️ Limitación Importante de Cognito

**No es posible modificar atributos de un User Pool existente en Cognito**. Esto significa:
- No podemos agregar `preferred_username` a un User Pool ya creado
- Tendríamos que eliminar y recrear el User Pool (perdiendo todos los usuarios)

**Solución adoptada**: Manejar username únicamente en MongoDB, Cognito solo para autenticación por email.

---

## 🏗️ Arquitectura Final

```
┌─────────────────────────────────────────────────────────────┐
│                   AWS Cognito                                │
│  (Autenticación por Email)                                   │
│                                                              │
│  User Attributes:                                           │
│  - sub (UUID)                      ← Cognito ID             │
│  - email                           ← Login method           │
│  - email_verified                  ← Verificación           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Sincronización después de registro
                   ↓
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                             │
│  (Datos de Aplicación + Username Único)                     │
│                                                              │
│  User Document:                                             │
│  - cognitoSub                      ← Reference to Cognito   │
│  - email                           ← Synced from Cognito    │
│  - username                        ← Único, elegido por user│
│  - artistMemberships []            ← App data               │
│  - placeMemberships []             ← App data               │
│  - ... other app fields                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Flujo Completo del Usuario

### Paso 1: Registro (Sign Up)

**Frontend** ([LoginPage.tsx:224-273](../src/components/Pages/app-base/users/login/LoginPage.tsx#L224-L273)):
```typescript
<Authenticator
  signUpAttributes={[
    'email',  // Solo email requerido
  ]}
>
  {({ user }) => {
    // Usuario registrado exitosamente en Cognito
    // user.username = sub (UUID)
    // user.attributes.email = "juan@example.com"
  }}
</Authenticator>
```

**Backend Cognito** (automático):
```json
{
  "sub": "abc-123-def-456",
  "email": "juan@example.com",
  "email_verified": true,
  "username": "abc-123-def-456"
}
```

---

### Paso 2: Onboarding - Elegir Username

**Detectar que falta username** ([LoginPage.tsx:126-136](../src/components/Pages/app-base/users/login/LoginPage.tsx#L126-L136)):
```typescript
const loadAWSInfo = async () => {
  try {
    const info = await fetchUserAttributes();
    setUserAttributes(info);

    // Verificar si ya existe en MongoDB
    const response = await fetch('/api/users/check-exists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sub: user.userId })
    });
    const data = await response.json();

    if (!data.exists) {
      // Mostrar pantalla de onboarding
      navigateToInnerPath({ path: PATHS.USERNAME_ONBOARDING });
    } else {
      // Ya tiene username, cargar API Key
      dispatch(apiKeyActions.loadApiKey({
        email: info.email,
        sub: user.userId
      }));
    }
  } catch (error) {
    console.error('Error fetching user attributes:', error);
  }
};
```

**Pantalla de Onboarding** (nuevo componente a crear):
```typescript
// src/components/Pages/app-base/users/onboarding/UsernameOnboarding.tsx
import { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { PATHS } from '~/constants';

export const UsernameOnboarding = () => {
  const { user } = useAuthenticator();
  const { navigateToInnerPath } = useNavigation();
  const [username, setUsername] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkAvailability = async (value: string) => {
    if (value.length < 3) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch('/api/users/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: value })
      });
      const data = await response.json();
      setIsAvailable(data.available);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async () => {
    if (!isAvailable || !user) return;

    setIsSubmitting(true);
    try {
      const userAttributes = await fetchUserAttributes();

      // Crear usuario en MongoDB
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          sub: user.userId,
          email: userAttributes.email
        })
      });

      // Navegar al home
      navigateToInnerPath({ path: PATHS.HOME });
    } catch (error) {
      console.error('Error setting username:', error);
      alert('Error al crear usuario. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="username-onboarding">
      <h2>Elige tu nombre de usuario</h2>
      <p>Este nombre será único y no podrá cambiarse después.</p>

      <input
        type="text"
        value={username}
        onChange={(e) => {
          const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
          setUsername(value);
          checkAvailability(value);
        }}
        placeholder="Ej: juan_artista"
        minLength={3}
        maxLength={30}
      />

      {isChecking && <p>Verificando disponibilidad...</p>}
      {isAvailable === false && <p className="error">❌ Username no disponible</p>}
      {isAvailable === true && <p className="success">✅ Username disponible</p>}

      <button
        onClick={handleSubmit}
        disabled={!isAvailable || isChecking || isSubmitting}
      >
        {isSubmitting ? 'Guardando...' : 'Continuar'}
      </button>
    </div>
  );
};
```

---

### Paso 3: Login

**Solo con email** (Cognito maneja todo):
```typescript
await signIn({
  username: 'juan@example.com',  // Email
  password: 'Password123!'
});
```

**Backend valida y carga datos**:
```javascript
// Después del login exitoso en Cognito
const user = await User.findOne({ cognitoSub: cognitoUser.sub });
// Cargar datos de usuario, artistas, lugares, etc.
```

---

## 🗄️ Backend API

### Endpoint: Check Username Availability

**Ruta**: `POST /api/users/check-username`

**Request**:
```json
{
  "username": "juan_artista"
}
```

**Response**:
```json
{
  "available": true
}
```

**Implementación** (Node.js):

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/check-username', async (req, res) => {
  const { username } = req.body;

  try {
    // 1. Validar formato
    if (!/^[a-z0-9_]{3,30}$/.test(username)) {
      return res.json({
        available: false,
        reason: 'invalid_format',
        message: 'Username debe tener 3-30 caracteres (letras minúsculas, números, guión bajo)'
      });
    }

    // 2. Verificar en MongoDB
    const existsInDB = await User.findOne({ username });

    if (existsInDB) {
      return res.json({
        available: false,
        reason: 'exists_in_database',
        message: 'Username ya está en uso'
      });
    }

    // 3. Username disponible
    return res.json({
      available: true
    });

  } catch (error) {
    console.error('Error checking username:', error);
    return res.status(500).json({
      available: false,
      reason: 'server_error',
      message: 'Error al verificar disponibilidad'
    });
  }
});

module.exports = router;
```

---

### Endpoint: Create User

**Ruta**: `POST /api/users`

**Request**:
```json
{
  "sub": "abc-123-def-456",
  "username": "juan_artista",
  "email": "juan@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "cognitoSub": "abc-123-def-456",
    "username": "juan_artista",
    "email": "juan@example.com"
  }
}
```

**Implementación**:

```javascript
// routes/users.js
router.post('/', async (req, res) => {
  const { sub, username, email } = req.body;

  try {
    // Validar que no exista ya
    const existingUser = await User.findOne({
      $or: [
        { cognitoSub: sub },
        { username: username }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.cognitoSub === sub
          ? 'Usuario ya existe'
          : 'Username ya está en uso'
      });
    }

    // Crear usuario
    const user = new User({
      cognitoSub: sub,
      username,
      email,
      artistMemberships: [],
      placeMemberships: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await user.save();

    return res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error creating user:', error);

    // Manejar duplicado (race condition)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Username ya está en uso'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al crear usuario'
    });
  }
});
```

---

### Endpoint: Check User Exists

**Ruta**: `POST /api/users/check-exists`

**Request**:
```json
{
  "sub": "abc-123-def-456"
}
```

**Response**:
```json
{
  "exists": true,
  "user": {
    "username": "juan_artista",
    "email": "juan@example.com"
  }
}
```

**Implementación**:

```javascript
// routes/users.js
router.post('/check-exists', async (req, res) => {
  const { sub } = req.body;

  try {
    const user = await User.findOne({ cognitoSub: sub });

    if (!user) {
      return res.json({ exists: false });
    }

    return res.json({
      exists: true,
      user: {
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error checking user existence:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al verificar usuario'
    });
  }
});
```

---

## 🗃️ Modelo MongoDB

### `models/User.js`

```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Referencia a Cognito
  cognitoSub: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  // Username único elegido por el usuario
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    minlength: 3,
    maxlength: 30,
    lowercase: true,
    match: /^[a-z0-9_]+$/
  },

  // Datos sincronizados de Cognito
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  // Datos de aplicación
  artistMemberships: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  }],

  placeMemberships: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  }],

  user_language: {
    type: String,
    default: 'es'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Índices compuestos para búsquedas rápidas
UserSchema.index({ cognitoSub: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);
```

---

## 🔒 Seguridad

### 1. Validación de Tokens JWT

**Proteger endpoints con token de Cognito**:

```javascript
// middleware/auth.js
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID
});

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const payload = await verifier.verify(token);
    req.user = {
      sub: payload.sub,
      email: payload.email
    };
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
}

module.exports = { authenticateToken };
```

**Uso**:
```javascript
// Solo usuarios autenticados
router.post('/users', authenticateToken, async (req, res) => {
  // El sub del usuario está en req.user.sub
  // ...
});
```

---

### 2. Rate Limiting

```javascript
// middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

const checkUsernameLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // 10 requests por minuto
  message: 'Demasiadas verificaciones, intenta de nuevo más tarde'
});

// Aplicar al endpoint
router.post('/check-username', checkUsernameLimiter, async (req, res) => {
  // ...
});
```

---

## ✅ Ventajas de Esta Arquitectura

### ✅ Simplicidad
- Cognito solo para autenticación (email + password)
- MongoDB para todos los datos de aplicación
- No dependemos de atributos personalizados de Cognito

### ✅ Escalabilidad
- Cognito maneja millones de usuarios
- MongoDB flexible para agregar campos nuevos
- Fácil migración de usuarios existentes

### ✅ Control Total
- Username totalmente bajo nuestro control
- Podemos implementar lógica personalizada
- Fácil de debuggear y mantener

### ✅ Sin Bloqueos
- No dependemos de limitaciones de Cognito
- Podemos cambiar validaciones de username fácilmente
- Podemos agregar features sin tocar Cognito

---

## 🔄 Migración de Usuarios Existentes

```javascript
// scripts/migrate-users-to-cognito.js
const {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand
} = require('@aws-sdk/client-cognito-identity-provider');
const User = require('../models/User');

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION
});

async function migrateUsers() {
  const users = await User.find({}).limit(1000); // En batches

  for (const user of users) {
    try {
      // 1. Crear usuario en Cognito solo con email
      const createResult = await cognitoClient.send(
        new AdminCreateUserCommand({
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
          Username: user.email,
          UserAttributes: [
            { Name: 'email', Value: user.email },
            { Name: 'email_verified', Value: 'true' }
          ],
          MessageAction: 'SUPPRESS' // No enviar email
        })
      );

      const cognitoSub = createResult.User.Attributes.find(
        attr => attr.Name === 'sub'
      ).Value;

      // 2. Password temporal
      await cognitoClient.send(
        new AdminSetUserPasswordCommand({
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
          Username: user.email,
          Password: 'TempPassword123!',
          Permanent: false
        })
      );

      // 3. Actualizar MongoDB con cognitoSub
      await User.updateOne(
        { _id: user._id },
        { cognitoSub }
      );

      console.log(`✅ Migrated: ${user.username}`);

    } catch (error) {
      console.error(`❌ Failed to migrate ${user.username}:`, error.message);
    }
  }
}

migrateUsers();
```

---

## 📝 Checklist de Implementación

- [x] Configurar Amplify Auth solo con email
- [x] Actualizar main.tsx para usar amplify_outputs.json
- [ ] Crear componente UsernameOnboarding.tsx
- [ ] Agregar ruta /username-onboarding en router
- [ ] Actualizar LoginPage.tsx para detectar falta de username
- [ ] Crear endpoint POST /api/users/check-username
- [ ] Crear endpoint POST /api/users/check-exists
- [ ] Crear endpoint POST /api/users
- [ ] Agregar campo cognitoSub al modelo User en MongoDB
- [ ] Crear índices únicos en username y cognitoSub
- [ ] Implementar middleware authenticateToken
- [ ] Agregar rate limiting a /check-username
- [ ] Testing completo del flujo
- [ ] Script de migración de usuarios existentes

---

## 🎯 Configuración Actual

**Amplify Backend**:
- Stack: `amplify-artistshive-fnp-sandbox-3fe68543c5`
- User Pool ID: `us-east-1_JHtFyB312`
- Identity Pool ID: `us-east-1:86a82a8d-a6f3-4749-b263-087122c0c40c`
- Región: `us-east-1`
- Cuenta AWS: `984711875530`

**Login**: Solo email (Cognito)
**Username**: MongoDB (único, elegido después del registro)
**Datos de App**: MongoDB

¡Listo para implementación! 🎵
