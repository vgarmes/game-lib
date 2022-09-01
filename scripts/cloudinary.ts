import axios from 'axios';
import { CloudinaryImage } from '../src/utils/cloudinary';

interface CloudinaryResponse {
  resources: CloudinaryImage[];
  next_cursor?: string;
}

export const getImages = async (nextCursor?: string) => {
  const url = `https://${process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_SECRET}@api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/image`;
  const response = await axios.get<CloudinaryResponse>(url, {
    params: { next_cursor: nextCursor },
  });
  return response.data;
};

// remove all context syntax
// https://cloudinary.com/documentation/image_upload_api_reference#removing_all_context_syntax
