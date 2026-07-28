import { defineAuth } from '@aws-amplify/backend';
import { customMessage } from './custom-message/resource';

/**
 * Define and configure your auth resource
 * Login con email. Username único se maneja en backend/MongoDB.
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  triggers: {
    customMessage,
  },
});
