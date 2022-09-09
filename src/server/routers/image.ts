import { generateSignature } from '../../utils/cloudinary';
import { createProtectedRouter } from '../createRouter';

export const imageRouter = createProtectedRouter().query('uploadSignature', {
  async resolve() {
    return generateSignature();
  },
});
