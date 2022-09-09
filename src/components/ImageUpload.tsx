import Image from 'next/image';
import { useRef, useState } from 'react';
import { CLOUDINARY_CONFIG } from '../utils/cloudinary';
import { trpc } from '../utils/trpc';

const ImageUpload = () => {
  const { data: signature, refetch } = trpc.useQuery(
    ['image.uploadSignature'],
    { enabled: false }
  );
  const [preview, setPreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (files: FileList | null) => {
    if (files === null) return;

    setPreview(URL.createObjectURL(files[0]));
    console.log('created blob for', files[0]);
  };

  const handleSubmit = async () => {
    if (!fileRef.current?.files || !signature) return;

    await refetch(); // gets signature
    const fd = new FormData();
    fd.append('file', fileRef.current.files[0]);
    fd.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    fd.append('timestamp', signature.timestamp.toString());
    fd.append('signature', signature.hash);
    fd.append('folder', CLOUDINARY_CONFIG.folder);

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/' +
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME! +
          '/image/upload',
        { method: 'POST', body: fd }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <input
        type="file"
        id="image-upload"
        name="test"
        accept="image/*"
        onChange={(e) => handleChange(e.target.files)}
        ref={fileRef}
      />
      {preview && (
        <div className="relative h-24 w-24">
          <Image
            src={preview}
            alt="image to upload"
            onLoad={() => {
              console.log('revoke ', preview);
              URL.revokeObjectURL(preview);
            }}
            layout="fill"
            objectFit="contain"
          />
        </div>
      )}

      <button type="button" onClick={handleSubmit}>
        Upload
      </button>
    </div>
  );
};

export default ImageUpload;
