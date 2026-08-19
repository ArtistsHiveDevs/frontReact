# 🔐 Arquitectura de Autenticación - Artist Hive

Esta guía documenta la arquitectura de autenticación completa usando **100% AWS Cognito** con soporte para login dual (email o username).

---

## 🎯 Objetivos

1. **Autenticación 100% en Cognito** - Todo el manejo de auth en AWS
2. **Login dual** - Email o username indistintamente
3. **Username único** - Validado contra 320,000+ usuarios existentes
4. **Username post-registro** - Usuario elige username DESPUÉS de crear cuenta
5. **Mantenibilidad** - Código limpio y organizado
6. **Seguridad** - Tokens, refresh, MFA nativos de Cognito

---

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                      AWS Cognito                             │
│  (Single Source of Truth for Authentication)                │
│                                                              │
│  User Attributes:                                           │
│  - sub (UUID)                      ← Cognito ID             │
│  - email                           ← Login method 1         │
│  - username (auto: sub)            ← Temporal              │
│  - preferred_username              ← Login method 2         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Sync on username update
                   ↓
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas                             │
│  (Application Data Only)                                     │
│                                                              │
│  User Document:                                             │
│  - cognitoSub                      ← Reference to Cognito   │
│  - username                        ← Synced from Cognito    │
│  - email                           ← Synced from Cognito    │
│  - artistMemberships []            ← App data               │
│  - placeMemberships []             ← App data               │
│  - ... other app fields                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Flujo Completo del Usuario

### Paso 1: Registro (Sign Up)

**Frontend** (`LoginPage.tsx`):
```typescript
<Authenticator
  signUpAttributes={[
    'email',  // Solo email requerido
  ]}
>
  {({ user }) => {
    // Usuario registrado exitosamente
    // user.username = sub (UUID temporal)
    // user.attributes.email = "juan@example.com"
    // user.attributes.preferred_username = null
  }}
</Authenticator>
```

**Backend Cognito**:
```json
{
  "sub": "abc-123-def-456",
  "email": "juan@example.com",
  "email_verified": true,
  "username": "abc-123-def-456",
  "preferred_username": null
}
```

---

### Paso 2: Primer Login y Onboarding

**Después del registro o primer login**:

1. **Detectar que falta username**:
```typescript
// LoginPage.tsx - líneas 117-136
useEffect(() => {
  if (user) {
    loadAWSInfo();
  }
}, [user]);

const loadAWSInfo = async () => {
  try {
    const info = await fetchUserAttributes();
    setUserAttributes(info);

    // Verificar si tiene preferred_username
    if (!info.preferred_username) {
      // Mostrar pantalla de onboarding para elegir username
      navigateToInnerPath({ path: PATHS.USERNAME_ONBOARDING });
    } else {
      // Ya tiene username, continuar al home
      dispatch(apiKeyActions.loadApiKey({
        username: info.preferred_username,
        sub: user.userId
      }));
    }
  } catch (error) {
    console.error('Error fetching user attributes:', error);
  }
};
```

2. **Pantalla de Onboarding** (nuevo componente):
```typescript
// UsernameOnboardingPage.tsx
import { updateUserAttributes } from 'aws-amplify/auth';

export const UsernameOnboardingPage = () => {
  const [username, setUsername] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkAvailability = async (value: string) => {
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
    if (!isAvailable) return;

    try {
      // 1. Actualizar en Cognito
      await updateUserAttributes({
        userAttributes: {
          preferred_username: username
        }
      });

      // 2. Crear/actualizar en MongoDB
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          sub: user.userId,
          email: userAttributes.email
        })
      });

      // 3. Navegar al home
      navigateToInnerPath({ path: PATHS.HOME });
    } catch (error) {
      console.error('Error setting username:', error);
    }
  };

  return (
    <div>
      <h2>Elige tu nombre de usuario</h2>
      <input
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          checkAvailability(e.target.value);
        }}
      />
      {isChecking && <p>Verificando disponibilidad...</p>}
      {isAvailable === false && <p>❌ Username no disponible</p>}
      {isAvailable === true && <p>✅ Username disponible</p>}
      <button
        onClick={handleSubmit}
        disabled={!isAvailable || isChecking}
      >
        Continuar
      </button>
    </div>
  );
};
```

---

### Paso 3: Login Posterior (Dual Login)

**Usuario puede usar cualquiera de los dos**:

```typescript
// Login con email
await signIn({
  username: 'juan@example.com',
  password: 'Password123!'
});

// Login con username
await signIn({
  username: 'juan_artista',
  password: 'Password123!'
});
```

**Ambos funcionan nativamente en Cognito** sin código adicional.

---

## 🔧 Configuración de Cognito

### `amplify/auth/resource.ts`

```typescript
import { defineAuth } from '@aws-amplify/backend';

/**
 * Configuración de autenticación con login dual (email/username)
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,      // ✅ Permitir login con email
    username: true,   // ✅ Permitir login con username
  },
  userAttributes: {
    preferredUsername: {
      mutable: false,    // ⚠️ No se puede cambiar después de setear
      required: false    // No requerido en signup
    }
  }
});
```

### Desplegar cambios

```bash
cd C:\Users\fnp\Documents\Proyectos\QuarenDevs\2022\bookmarks\frontReact
npx amplify sandbox
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
const { CognitoIdentityProviderClient, ListUsersCommand } = require('@aws-sdk/client-cognito-identity-provider');
const User = require('../models/User');

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION
});

router.post('/check-username', async (req, res) => {
  const { username } = req.body;

  try {
    // 1. Validar formato
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      return res.json({
        available: false,
        reason: 'invalid_format',
        message: 'Username debe tener 3-30 caracteres (letras, números, guión bajo)'
      });
    }

    // 2. Verificar en Cognito (source of truth)
    const cognitoResult = await cognitoClient.send(
      new ListUsersCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Filter: `preferred_username = "${username}"`
      })
    );

    if (cognitoResult.Users && cognitoResult.Users.length > 0) {
      return res.json({
        available: false,
        reason: 'exists_in_cognito',
        message: 'Username ya está en uso'
      });
    }

    // 3. Verificar en MongoDB (backup check)
    const existsInDB = await User.findOne({ username });

    if (existsInDB) {
      return res.json({
        available: false,
        reason: 'exists_in_database',
        message: 'Username ya está en uso'
      });
    }

    // 4. Username disponible
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
```

---

### Endpoint: Create/Update User

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
    // Crear o actualizar usuario en MongoDB
    const user = await User.findOneAndUpdate(
      { cognitoSub: sub },
      {
        cognitoSub: sub,
        username,
        email,
        updatedAt: new Date()
      },
      {
        upsert: true,      // Crear si no existe
        new: true,         // Retornar documento actualizado
        setDefaultsOnInsert: true
      }
    );

    return res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error creating/updating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear/actualizar usuario'
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

  // Datos sincronizados de Cognito
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    minlength: 3,
    maxlength: 30
  },

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
UserSchema.index({ username: 1, email: 1 });

module.exports = mongoose.model('User', UserSchema);
```

---

## 🔒 Seguridad

### 1. Validación de Tokens JWT

**Todos los endpoints protegidos deben validar el token de Cognito**:

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
      username: payload['cognito:username'],
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
// Proteger endpoints
router.post('/users', authenticateToken, async (req, res) => {
  // Solo usuarios autenticados pueden acceder
  const { sub } = req.user;
  // ...
});
```

---

### 2. Prevención de Race Conditions

**Problema**: Dos usuarios intentan tomar el mismo username simultáneamente.

**Solución**: Índice único en MongoDB + validación en Cognito.

```javascript
// El índice único en MongoDB garantiza atomicidad
UserSchema.index({ username: 1 }, { unique: true });

// Al intentar crear duplicado, MongoDB lanza error
try {
  await user.save();
} catch (error) {
  if (error.code === 11000) { // Duplicate key error
    return res.json({
      available: false,
      reason: 'race_condition',
      message: 'Username tomado por otro usuario'
    });
  }
}
```

---

### 3. Rate Limiting

**Prevenir spam de verificaciones de username**:

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

## 📊 Ventajas de Esta Arquitectura

### ✅ 100% Cognito
- Todo el auth en AWS (tokens, refresh, MFA, password reset)
- No necesitas implementar lógica de sesiones
- Seguridad enterprise-grade out of the box

### ✅ Login Dual Nativo
- `signIn({ username: 'email' })` o `signIn({ username: 'username' })` funciona sin código adicional
- Cognito maneja ambos casos internamente

### ✅ Escalabilidad
- Cognito maneja millones de usuarios sin problema
- MongoDB solo para datos de aplicación, no para auth

### ✅ Single Source of Truth
- `preferred_username` en Cognito es la fuente de verdad
- MongoDB es solo una réplica para queries de app

### ✅ Mantenibilidad
- Separación clara: Cognito = Auth, MongoDB = App Data
- Código frontend simple (usa hooks de Amplify)
- Backend solo valida y sincroniza

### ✅ Migrabilidad
- Los 320K usuarios existentes se migran a Cognito
- Mantienes MongoDB para datos de aplicación
- Script de migración puede importar usuarios masivamente

---

## 🔄 Migración de Usuarios Existentes

### Script de Migración

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
  const users = await User.find({}).limit(1000); // Migrar en batches

  for (const user of users) {
    try {
      // 1. Crear usuario en Cognito
      const createResult = await cognitoClient.send(
        new AdminCreateUserCommand({
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
          Username: user.email,
          UserAttributes: [
            { Name: 'email', Value: user.email },
            { Name: 'email_verified', Value: 'true' },
            { Name: 'preferred_username', Value: user.username }
          ],
          MessageAction: 'SUPPRESS' // No enviar email de bienvenida
        })
      );

      const cognitoSub = createResult.User.Attributes.find(
        attr => attr.Name === 'sub'
      ).Value;

      // 2. Setear password temporal (usuario debe cambiarla)
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

## 🧪 Testing

### Test 1: Registro y Onboarding

```bash
# 1. Registrarse con email
# En navegador: https://artistshive.co/login
# Click "Create account"
# Email: test@example.com
# Password: Test1234!

# 2. Verificar que redirige a onboarding
# URL debe ser: /username-onboarding

# 3. Elegir username
# Input: test_artist
# Debe mostrar: ✅ Username disponible

# 4. Submit
# Debe navegar a: /home
```

---

### Test 2: Login con Email

```bash
# En LoginPage
# Username: test@example.com
# Password: Test1234!
# Click "Sign In"
# ✅ Debe funcionar
```

---

### Test 3: Login con Username

```bash
# En LoginPage
# Username: test_artist
# Password: Test1234!
# Click "Sign In"
# ✅ Debe funcionar
```

---

### Test 4: Duplicado de Username

```bash
# Crear segundo usuario
# Email: test2@example.com
# Password: Test1234!

# En onboarding, intentar username existente
# Input: test_artist
# Debe mostrar: ❌ Username no disponible
```

---

## 📝 Checklist de Implementación

- [ ] Actualizar `amplify/auth/resource.ts` con `loginWith: { email: true, username: true }`
- [ ] Agregar `preferred_username` a `userAttributes`
- [ ] Desplegar Amplify: `npx amplify sandbox`
- [ ] Crear componente `UsernameOnboardingPage.tsx`
- [ ] Crear ruta `/username-onboarding` en router
- [ ] Actualizar `LoginPage.tsx` para detectar falta de username
- [ ] Crear endpoint `POST /api/users/check-username` en backend
- [ ] Crear endpoint `POST /api/users` para crear/actualizar usuario
- [ ] Agregar campo `cognitoSub` al modelo `User` en MongoDB
- [ ] Crear índices únicos en `username` y `cognitoSub`
- [ ] Implementar middleware `authenticateToken` para proteger endpoints
- [ ] Agregar rate limiting a `/check-username`
- [ ] Testing completo de flujo de registro y login
- [ ] Migrar usuarios existentes a Cognito (script)

---

## 🎯 Resultado Final

**Usuario puede**:
- ✅ Registrarse solo con email y password
- ✅ Elegir username único después del registro
- ✅ Iniciar sesión con email o username indistintamente
- ✅ Cambiar password, habilitar MFA, etc. (funciones nativas de Cognito)

**Sistema tiene**:
- ✅ 100% de autenticación en Cognito
- ✅ Validación de username único contra 320K+ usuarios
- ✅ MongoDB sincronizado para datos de aplicación
- ✅ Código limpio y mantenible
- ✅ Seguridad enterprise-grade

¡Listo! 🎵
