import Image from 'next/image';

interface Props {
  title?: string;
  src?: string;
}
const GameThumbnail: React.FC<Props> = ({ title, src }) => {
  return (
    <div className="relative h-28 w-28 transition-transform group-hover:scale-110">
      {src ? (
        <Image
          alt={`${title} cover`}
          src={src}
          layout="fill"
          objectFit="contain"
          objectPosition={'50% 50%'}
        />
      ) : (
        <Image
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
          src="/image-placeholder.jpeg"
          alt="placeholder"
        />
      )}
    </div>
  );
};

export default GameThumbnail;
