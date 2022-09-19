import { useEffect } from 'react';
import Image from 'next/image';
import { ImgHTMLAttributes, useRef, useState } from 'react';
import { CLOUDINARY_CONFIG, uploadImage } from '../utils/cloudinary';
import { trpc } from '../utils/trpc';
import FileInput from './common/FileInput';
import { CloudinaryUploadResponse } from '../types/cloudinary';

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
  onSubmit?: (response: CloudinaryUploadResponse) => void;
}> = ({ onSubmit }) => {
  const [preview, setPreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    data: signature,
    error: signatureError,
    refetch: refetchSignature,
    isLoading: isLoadingSignature,
  } = trpc.useQuery(['image.uploadSignature'], { staleTime: Infinity });

  useEffect(() => {
    // this makes sure Cloudinary's signature doesn't expire (1 hour)
    if (!signature || !signatureError) return;

    const delay = signature.expires * 1000 - new Date().getTime();

    const timer = setTimeout(() => {
      refetchSignature();
    }, delay);

    return () => clearTimeout(timer);
  }, [signature, signatureError, refetchSignature]);

  const handleChange = (files: FileList | null) => {
    if (files === null) return;

    setPreview(URL.createObjectURL(files[0]));
    console.log('created blob for', files[0]);
  };

  const handleSubmit = async () => {
    if (!fileRef.current?.files || !signature) return;

    const fd = new FormData();
    fd.append('file', fileRef.current.files[0]);
    fd.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    fd.append('timestamp', signature.timestamp.toString());
    fd.append('signature', signature.hash);
    fd.append('folder', CLOUDINARY_CONFIG.folder);

    const image = await uploadImage(fd);
    onSubmit && image && onSubmit(image);
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
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!signature || !preview}
      >
        Upload
      </button>
    </div>
  );
};

export default ImageUpload;
