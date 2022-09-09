import { generateSignature } from '../../utils/cloudinary';
import { createProtectedRouter } from '../createRouter';

export const imageRouter = createProtectedRouter('ADMIN').query(
  'uploadSignature',
  {
    async resolve() {
      return generateSignature();
    },
  }
);
