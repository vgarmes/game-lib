import Image from 'next/image';
import { ImgHTMLAttributes, useRef, useState } from 'react';
import { CLOUDINARY_CONFIG, uploadImage } from '../utils/cloudinary';
import FileInput from './common/FileInput';
import { CloudinaryUploadResponse } from '../types/cloudinary';
import { Signature } from '../types';
import Button from './common/Button';
import { trpc } from '../utils/trpc';

const PreviewImage: React.FC<ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
}) => {
  if (!src) {
    return (
      <Image
        width={96}
        height={96}
        objectFit="cover"
        className="rounded-lg"
        src="/image-placeholder.jpeg"
        alt="placeholder"
      />
    );
  }

  return (
    <Image
      src={src}
      width={96}
      height={96}
      alt="image to upload"
      onLoad={() => URL.revokeObjectURL(src)}
      objectFit="contain"
    />
  );
};

const ImageUpload: React.FC<{
  onSubmit?: (coverId: number) => void;
}> = ({ onSubmit }) => {
  const [preview, setPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const createCover = trpc.useMutation('cover.create');

  const handleChange = (files: FileList | null) => {
    if (files === null) return;
    setPreview(URL.createObjectURL(files[0]));
  };

  const handleSubmit = async () => {
    if (!fileRef.current?.files || fileRef.current.files.length === 0) return;
    setIsLoading(true);
    setError('');

    try {
      const signature: Signature = await fetch('/api/image/signature').then(
        (response) => response.json()
      );

      const fd = new FormData();
      fd.append('file', fileRef.current.files[0]);
      fd.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      fd.append('timestamp', signature.timestamp.toString());
      fd.append('signature', signature.hash);
      fd.append('folder', CLOUDINARY_CONFIG.folder);

      const image = await uploadImage(fd);
      if (image) {
        const {
          public_id: publicId,
          secure_url: secureUrl,
          original_filename: filename,
          format,
          bytes: byteSize,
          etag: checksum,
        } = image;

        const cover = await createCover.mutateAsync({
          publicId,
          secureUrl,
          filename,
          format,
          byteSize,
          checksum,
        });

        onSubmit && onSubmit(cover.id);
      }
    } catch (error) {
      setError(`An error ocurred: ${error}`);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div>
        <PreviewImage src={preview} />
      </div>

      <FileInput
        accept="image/*"
        onChange={(e) => handleChange(e.target.files)}
        ref={fileRef}
      />
      <div className="flex items-center">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!preview}
          variant="outline"
        >
          Upload
        </Button>
        {isLoading && <p className="pl-3">Loading...</p>}
        {error && <p className="pl-3">{error}</p>}
      </div>
    </div>
  );
};

export default ImageUpload;
