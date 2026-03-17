import clsx from 'clsx';
import * as React from 'react';

import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function PrivacyPage() {
  const isLoaded = useLoaded();

  return (
    <Layout>
      <Seo
        templateTitle='隐私政策'
        description='BJUT SWIFT 官网隐私政策，说明我们如何收集、使用和保护你的个人信息。'
      />

      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className='layout py-20'>
            <h1 data-fade='0'>
              <Accent>隐私政策</Accent>
            </h1>
            <p
              className='mt-2 text-sm text-gray-500 dark:text-gray-400'
              data-fade='1'
            >
              最后更新：2026 年 3 月 17 日
            </p>

            <article
              className='prose mt-8 max-w-none dark:prose-invert'
              data-fade='2'
            >
              <p>
                BJUT
                SWIFT（以下简称"我们"）重视你的隐私。本隐私政策说明了我们在你访问{' '}
                <strong>www.bjutswift.cn</strong>{' '}
                时如何收集、使用和保护你的信息。
              </p>

              <h2>一、我们收集的信息</h2>

              <h3>1. 自动收集的信息</h3>
              <p>
                当你访问本网站时，我们通过自托管的{' '}
                <strong>Umami 分析服务</strong>
                （部署于 umami.thcl.dev）自动收集以下匿名信息：
              </p>
              <ul>
                <li>页面访问量和浏览路径</li>
                <li>浏览器类型和操作系统</li>
                <li>访问来源（Referrer）</li>
                <li>设备类型（桌面端 / 移动端）</li>
              </ul>
              <p>
                Umami 是一款注重隐私的开源分析工具，
                <strong>不使用 Cookie</strong>
                ，不收集个人身份信息（PII），不跨站追踪，完全符合 GDPR 要求。
              </p>

              <h3>2. 你主动提供的信息</h3>
              <ul>
                <li>
                  <strong>邮件订阅：</strong>
                  如果你选择订阅我们的更新，我们会收集你提供的电子邮件地址，仅用于发送内容更新通知。
                </li>
                <li>
                  <strong>留言评论：</strong>
                  本站使用 <strong>Waline 评论系统</strong>
                  （部署于
                  comment.bjutswift.cn），你在留言时可能提供的昵称、邮箱和网站地址由
                  Waline 服务处理和存储。
                </li>
              </ul>

              <h2>二、我们如何使用信息</h2>
              <ul>
                <li>了解网站整体访问趋势，优化内容和用户体验</li>
                <li>通过邮件向订阅者发送内容更新</li>
                <li>展示和管理用户留言评论</li>
              </ul>
              <p>
                我们<strong>不会</strong>
                将你的信息出售、出租或以其他方式提供给第三方用于商业目的。
              </p>

              <h2>三、Cookie 使用</h2>
              <p>
                本网站<strong>不使用追踪型 Cookie</strong>。Umami 分析不依赖
                Cookie
                即可工作。你的浏览器可能会存储少量功能性数据（如主题偏好），这些数据仅保存在你的本地设备上。
              </p>

              <h2>四、第三方服务</h2>
              <p>本网站使用以下第三方服务：</p>
              <ul>
                <li>
                  <strong>Vercel</strong> — 网站托管和部署
                </li>
                <li>
                  <strong>Cloudflare</strong> — CDN 加速和 DNS 解析
                </li>
                <li>
                  <strong>Umami</strong> — 隐私友好的网站分析（自托管）
                </li>
                <li>
                  <strong>Waline</strong> — 评论系统（自托管）
                </li>
              </ul>
              <p>
                这些服务可能会处理你的部分访问信息（如 IP
                地址），请参阅各服务的隐私政策了解详情。
              </p>

              <h2>五、数据安全</h2>
              <p>
                我们采取合理的技术措施保护你的信息安全，包括：全站 HTTPS
                加密传输、安全响应头配置、自托管关键服务以减少第三方数据暴露。
              </p>

              <h2>六、你的权利</h2>
              <p>你可以随时：</p>
              <ul>
                <li>取消邮件订阅（通过邮件底部的取消链接）</li>
                <li>
                  请求删除你的评论数据（发送邮件至{' '}
                  <strong>bjutswift.cn@gmail.com</strong>）
                </li>
              </ul>

              <h2>七、政策变更</h2>
              <p>
                我们可能会不定期更新本隐私政策。更新后的政策将在本页面发布，并更新"最后更新"日期。
              </p>

              <h2>八、联系我们</h2>
              <p>如果你对本隐私政策有任何疑问，请通过以下方式联系我们：</p>
              <ul>
                <li>
                  邮箱：<strong>bjutswift.cn@gmail.com</strong>
                </li>
                <li>
                  GitHub：
                  <a href='https://github.com/bjut-swift'>
                    github.com/bjut-swift
                  </a>
                </li>
              </ul>
            </article>
          </div>
        </section>
      </main>
    </Layout>
  );
}
