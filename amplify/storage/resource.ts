import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 's3c11d41b3',
  access: (allow) => ({
    'profile-pictures/{entity_id}/*': [
      allow.guest.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete']),
    ],
    'picture-submissions/*': [allow.authenticated.to(['read', 'write']), allow.guest.to(['read', 'write'])],
    'public/*': [
      allow.authenticated.to(['read', 'write']),
      allow.guest.to(['read']),
      //   allow.groups(['ahadmin']).to(['read', 'write', 'delete']),
    ],
  }),
});
