import clsx from 'clsx';
import Image, { ImageProps } from 'next/image';
import * as React from 'react';

type ImgElementStyle = NonNullable<JSX.IntrinsicElements['img']['style']>;

type NextImageProps = {
  useSkeleton?: boolean;
  imgClassName?: string;
  blurClassName?: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  objectFit?: ImgElementStyle['objectFit'];
} & ImageProps;

/**
 *
 * @description Must set width using `w-` className
 * @param useSkeleton add background with pulse animation, don't use it if image is transparent
 */
export default function NextImage({
  useSkeleton = false,
  src,
  width,
  height,
  alt,
  className,
  imgClassName,
  blurClassName,
  objectFit,
  ...rest
}: NextImageProps) {
  const [status, setStatus] = React.useState(
    useSkeleton ? 'loading' : 'complete'
  );
  const widthIsSet = className?.includes('w-') ?? false;

  return (
    <figure
      style={!widthIsSet ? { width: `${width}px` } : undefined}
      className={className}
    >
      <Image
        className={clsx(
          imgClassName,
          blurClassName,
          // text-gray to hide alt text
          //'bg-gray-400 text-gray-400 ',
          status === 'loading' &&
            clsx('animate-pulse', 'bg-gray-400 text-gray-400 ')
        )}
        src={src}
        width={width || '1440'}
        height={height || '720'}
        // width，height uncertain，use objectFit
        objectFit={objectFit}
        alt={alt}
        onLoadingComplete={() => setStatus('complete')}
        {...rest}
      />
    </figure>
  );
}
