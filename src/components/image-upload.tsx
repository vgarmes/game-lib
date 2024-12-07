/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from 'react';
import { CLOUDINARY_CONFIG, uploadImage } from '../utils/cloudinary';
import { Signature } from '../types';
import { trpc } from '../utils/trpc';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import {
  CheckCircle2,
  ImagePlus,
  Upload,
  CircleCheck,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardFooter } from './ui/card';

interface Props {
  src?: string;
  isUploaded: boolean;
  onRemove: () => void;
  onClick: () => void;
}
const PreviewImage: React.FC<Props> = ({ src, isUploaded, onClick }) => {
  if (!src) {
    return (
      <div
        className="h-32 w-32 border-2 border-dashed border-gray-300 dark:border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-gray-500 p-1"
        onClick={onClick}
      >
        <ImagePlus className="h-12 w-12" />
        <p className="mt-2 text-xs">Choose image</p>
      </div>
    );
  }
  return (
    <div
      className="relative group rounded-md overflow-hidden"
      onClick={onClick}
    >
      <img
        src={src}
        alt="Cover preview"
        className="h-32 w-32 object-cover"
        onLoad={() => URL.revokeObjectURL(src)}
      />
      <div className="absolute opacity-0 group-hover:opacity-100 inset-0 bg-zinc-900/30 flex flex-col text-gray-100 items-center justify-center transition-opacity cursor-pointer">
        <ImagePlus className="h-12 w-12" />
        <p className="mt-2 text-xs">Change image</p>
      </div>
      {isUploaded && (
        <div className="absolute bottom-2 right-2 bg-green-500 text-white p-2 rounded-full">
          <CheckCircle2 className="h-6 w-6" />
        </div>
      )}
    </div>
  );
};

const ImageUpload: React.FC<{
  onSubmit?: (coverId: number) => void;
  defaultImageSrc?: string;
}> = ({ onSubmit, defaultImageSrc }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(defaultImageSrc);
  const [imageFile, setImageFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const createCover = trpc.cover.create.useMutation({
    onError: (error) =>
      toast({
        variant: 'destructive',
        title: 'Ups! Something went wrong.',
        description: `${error?.toString().substring(0, 200) ?? 'Try again'}`,
      }),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setIsUploaded(false);
    }
  };

  const handlePlaceholderClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!imageFile) return;
    setIsLoading(true);

    try {
      const signature: Signature = await fetch('/api/image/signature').then(
        (response) => response.json()
      );

      const fd = new FormData();
      fd.append('file', imageFile);
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

      setIsUploaded(true);
      onSubmit && onSubmit(cover.id);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to upload image' });
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-center pt-5">
          <PreviewImage
            src={preview}
            isUploaded={false}
            onRemove={() => null}
            onClick={handlePlaceholderClick}
          />
          <Input
            ref={fileInputRef}
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || isUploaded || !imageFile}
          className="w-auto mx-auto lg:w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isUploaded ? (
            <CircleCheck className="w-4 h-4 mr-2" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          {isUploaded ? 'Uploaded' : 'Upload'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ImageUpload;
