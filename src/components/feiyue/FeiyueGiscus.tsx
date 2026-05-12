import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

export default function FeiyueGiscus() {
  const { resolvedTheme } = useTheme();

  return (
    <Giscus
      repo='bjut-swift/swifts-nest'
      repoId='R_kgDOLtnl_g'
      category='General'
      categoryId='DIC_kwDOLtnl_s4Ch7wy'
      mapping='pathname'
      reactionsEnabled='1'
      emitMetadata='0'
      inputPosition='top'
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      lang='zh-CN'
      loading='lazy'
    />
  );
}
