import dynamic from 'next/dynamic';
import Image from 'next/image';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';

import { InterviewHeader } from '@/components/content/blog/InterviewHeader';
import { KeyInsight } from '@/components/content/blog/KeyInsight';
import Quiz from '@/components/content/blog/Quiz';
import GithubCard from '@/components/content/card/GithubCard';
import { Pre } from '@/components/content/Pre';
import SplitImage, { Split } from '@/components/content/SplitImage';
import TweetCard from '@/components/content/TweetCard';
import CloudinaryImg from '@/components/images/CloudinaryImg';

const FeishuBaseEmbed = dynamic(() => import('@/components/FeishuBaseEmbed'), {
  ssr: false,
});
const FeishuDocEmbed = dynamic(() => import('@/components/FeishuDocEmbed'), {
  ssr: false,
});
import NextImage from '@/components/images/NextImage';
import LaTeX from '@/components/LaTeX';
import CustomLink from '@/components/links/CustomLink';
import TechIcons from '@/components/TechIcons';

const MDXComponents = {
  a: CustomLink,
  Image,
  pre: Pre,
  // code: CustomCode,
  CloudinaryImg,
  NextImage,
  LiteYouTubeEmbed,
  SplitImage,
  Split,
  TechIcons,
  TweetCard,
  GithubCard,
  Quiz,
  FeishuDocEmbed,
  FeishuBaseEmbed,
  LaTeX,
  KeyInsight,
  InterviewHeader,
};

export default MDXComponents;
