import clsx from 'clsx';
import Image, { ImageProps } from 'next/image';
import * as React from 'react';

type NextImageProps = {
  useSkeleton?: boolean;
  imgClassName?: string;
  blurClassName?: string;
  alt: string;
  width?: string | number;
  height?: string | number;
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
  ...rest
}: NextImageProps) {
  const [status, setStatus] = React.useState(
    useSkeleton ? 'loading' : 'complete'
  );
  // 1.图片不定宽高，外层容器需要有宽高
  // <div className={'w-full h-8'}/>
  //  <NextImage fill useSkeleton ..../>
  // </div>

  // 2.图片定宽高
  // <NextImage width={720} height={360} useSkeleton ..../>
  // <NextImage className={'w-16'} useSkeleton ..../>

  const widthIsSet = className?.includes('w-') ?? false;

  return (
    <figure
      style={!widthIsSet && width ? { width: `${width}px` } : undefined}
      className={className}
    >
      <Image
        className={clsx(
          imgClassName,
          blurClassName,
          // text-gray to hide alt text
          status === 'loading' &&
            clsx('animate-pulse', 'bg-gray-400 text-gray-400 ')
        )}
        src={src}
        width={width}
        height={height}
        alt={alt}
        onLoadingComplete={() => setStatus('complete')}
        {...rest}
      />
    </figure>
  );
}
