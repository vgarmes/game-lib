import axios from 'axios';
import { CloudinaryImage } from '../src/types/cloudinary';
import fs from 'fs';
import path from 'path';

// Script that generates the file in data/cloudinary_images.json, to be used when migrating from old db

interface CloudinaryResponse {
  resources: CloudinaryImage[];
  next_cursor?: string;
}

const getImages = async (nextCursor?: string) => {
  const url = `https://${process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_SECRET}@api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/image`;
  const response = await axios.get<CloudinaryResponse>(url, {
    params: { next_cursor: nextCursor },
  });
  return response.data;
};

const writeImagesToFile = (resources: CloudinaryImage[], filePath: string) => {
  fs.writeFile(filePath, JSON.stringify(resources), (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Data saved successfully to ${filePath}`);
    }
  });
};

const getAllImages = async () => {
  const MAX_ITER = 10;
  const resources: CloudinaryImage[] = [];

  console.log('Getting images data from Cloudinary...');
  const data = await getImages();
  let nextCursor = data.next_cursor;
  resources.push(...data.resources);

  let iter = 0;
  while (iter < MAX_ITER && nextCursor) {
    console.log('Iteration ', iter);
    const data = await getImages(nextCursor);
    resources.push(...data.resources);
    nextCursor = data.next_cursor;
    iter++;
  }

  console.log('Done!');

  const filePath = path.join(process.cwd(), 'data', 'cloudinary_images.json');
  writeImagesToFile(resources, filePath);
};

getAllImages();

// remove all context syntax
// https://cloudinary.com/documentation/image_upload_api_reference#removing_all_context_syntax
