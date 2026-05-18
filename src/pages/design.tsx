import React from 'react';
import Head from 'next/head';
import { useTheme } from 'next-themes';

const DesignPage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Head>
        <title>设计 - bjutswift.cn</title>
        <meta name="description" content="bjutswift.cn 设计页面" />
      </Head>
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-6">网站设计</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">色彩方案（bjutswift.cn）</h2>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded bg-blue-500" />
            <div className="w-12 h-12 rounded bg-gray-200" />
            <div className="w-12 h-12 rounded bg-white border" />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">字体：Inter</h2>
          <p className="font-sans text-lg">
            The quick brown fox jumps over the lazy dog.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">背景模式</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              浅色背景
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}`}
            >
              深色背景
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default DesignPage;