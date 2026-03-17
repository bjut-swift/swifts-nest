import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { Noto_Sans_SC, Space_Grotesk } from 'next/font/google';
import Router, { useRouter } from 'next/router';
import { useRemoteRefresh } from 'next-remote-refresh/hook';
import { ThemeProvider } from 'next-themes';
import nProgress from 'nprogress';
import * as React from 'react';

import '@/styles/globals.css';
import '@/styles/carbon.css';
import '@/styles/mdx.css';
import '@/styles/nprogress.css';

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans-sc',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

import { getFromLocalStorage } from '@/lib/helper.client';

import { blockDomainMeta } from '@/constants/env';

const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? dynamic(
        () =>
          import('@tanstack/react-query-devtools').then(
            (mod) => mod.ReactQueryDevtools
          ),
        { ssr: false }
      )
    : () => null;

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [transitioning, setTransitioning] = React.useState(false);

  React.useEffect(() => {
    const handleStart = () => setTransitioning(true);
    const handleComplete = () => setTransitioning(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  React.useEffect(() => {
    // Don't increment views if not on main domain
    if (
      window.location.host !==
        (process.env.NEXT_PUBLIC_BLOCK_DOMAIN_WHITELIST ||
          'www.bjutswift.cn') &&
      blockDomainMeta
    ) {
      if (getFromLocalStorage('incrementMetaFlag') !== 'false') {
        localStorage.setItem('incrementMetaFlag', 'false');
        // reload page to make changes
        window.location.reload();
      }
    }
  }, []);

  useRemoteRefresh();

  return (
    <div className={`${notoSansSC.variable} ${spaceGrotesk.variable}`}>
      <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false}>
        <QueryClientProvider client={queryClient}>
          <div
            className={`transition-opacity duration-200 ${
              transitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Component {...pageProps} />
          </div>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ThemeProvider>
    </div>
  );
}

export default MyApp;
