import Image from 'next/image';
import { ImgHTMLAttributes, useRef, useState } from 'react';
import { CLOUDINARY_CONFIG, uploadImage } from '../utils/cloudinary';
import { Signature } from '../types';
import { trpc } from '../utils/trpc';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const PreviewImage: React.FC<ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
}) => {
  if (!src) {
    return (
      <Image
        width={96}
        height={96}
        style={{ objectFit: 'cover' }}
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
      style={{ objectFit: 'contain' }}
    />
  );
};

const ImageUpload: React.FC<{
  onSubmit?: (coverId: number) => void;
  defaultImageSrc?: string;
}> = ({ onSubmit, defaultImageSrc }) => {
  const [preview, setPreview] = useState(defaultImageSrc);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const createCover = trpc.cover.create.useMutation({
    onError: (error) => console.log(error),
  });

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

      if (!image) {
        throw new Error('Image upload failed');
      }

      const {
        public_id: publicId,
        secure_url: secureUrl,
        original_filename: filename,
        format,
        bytes: byteSize,
        width,
        height,
        etag: checksum,
      } = image;

      const cover = await createCover.mutateAsync({
        publicId,
        secureUrl,
        filename,
        format,
        byteSize,
        width,
        height,
        checksum,
      });

      onSubmit && onSubmit(cover.id);
    } catch (error) {
      setError(`An error ocurred: ${error}`);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div>
        <PreviewImage src={preview} />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Cover picture</Label>
        <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={(e) => handleChange(e.target.files)}
            ref={fileRef}
          />
          <Button type="button" onClick={handleSubmit} disabled={!preview}>
            Upload
          </Button>
        </div>

        {isLoading && <p className="pl-3">Loading...</p>}
        {error && <p className="pl-3">{error}</p>}
      </div>
    </>
  );
};

export default ImageUpload;
