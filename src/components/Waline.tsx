import {
  init,
  type WalineInitOptions,
  type WalineInstance,
} from '@waline/client';
import { useEffect, useRef, useState } from 'react';
import '@waline/client/style';

export type WalineOptions = Omit<WalineInitOptions, 'el'> & { path: string };

export const Waline = ({ path, serverURL, dark, ...rest }: WalineOptions) => {
  const walineInstanceRef = useRef<WalineInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    setError(false);

    try {
      walineInstanceRef.current = init({
        ...rest,
        el: containerRef.current,
        path,
        serverURL,
        dark,
      });
    } catch {
      setError(true);
    }

    return () => {
      walineInstanceRef.current?.destroy();
      walineInstanceRef.current = null;
    };
  }, [path, serverURL]);

  useEffect(() => {
    walineInstanceRef.current?.update({ dark });
  }, [dark]);

  if (error) {
    return (
      <div className='py-8 text-center text-gray-500 dark:text-gray-400'>
        评论加载失败，请刷新页面重试
      </div>
    );
  }

  return <div ref={containerRef} />;
};
