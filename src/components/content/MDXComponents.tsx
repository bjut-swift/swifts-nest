import Image from 'next/image';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';

import { InterviewHeader } from '@/components/content/blog/InterviewHeader';
import { KeyInsight } from '@/components/content/blog/KeyInsight';
import Quiz from '@/components/content/blog/Quiz';
import GithubCard from '@/components/content/card/GithubCard';
import { Pre } from '@/components/content/Pre';
import SplitImage, { Split } from '@/components/content/SplitImage';
import TweetCard from '@/components/content/TweetCard';
import FeishuDocEmbed from '@/components/FeishuDocEmbed';
import CloudinaryImg from '@/components/images/CloudinaryImg';
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
  LaTeX,
  KeyInsight,
  InterviewHeader,
};

export default MDXComponents;
