import clsx from 'clsx';
import React from 'react';

import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

const AddressNavigation: React.FC = () => {
  const isLoaded = useLoaded();

  // Mock data for demonstration purposes
  const mockData = [
    {
      title: '常用置顶',
      links: [
        {
          name: '北工大门户（my网）',
          url: 'https://my.bjut.edu.cn/page/site/index',
        },
        { name: '网关1', url: 'http://10.21.221.98/a79.htm' },
        { name: '网关2', url: 'https://wlgn.bjut.edu.cn' },
        {
          name: '教学管理信息服务平台',
          url: 'https://jwglxt.bjut.edu.cn/xtgl/login_slogin.html',
        },
        {
          name: '日新学堂在线教育平台',
          url: 'https://bjut.fanya.chaoxing.com/',
        },
        { name: '网费平台', url: 'https://jfself.bjut.edu.cn/nav_login' },
        { name: '北京工业大学图书馆', url: 'https://lib.bjut.edu.cn/' },
        { name: 'WebVPN', url: 'https://webvpn.bjut.edu.cn/' },
      ],
    },
    {
      title: '校内网站',
      links: [
        { name: '统一身份认证', url: 'https://cas.bjut.edu.cn/' },
        { name: '北京工业大学教务处', url: 'https://undergrad.bjut.edu.cn/' },
        {
          name: '北工大考试系统',
          url: 'https://bjut.kaoshi.chaoxing.com/login',
        },
        { name: '软件正版化平台', url: 'https://ca.bjut.edu.cn/' },
        { name: '北工大轻应用', url: 'https://qing.bjut.edu.cn/' },
        { name: '北京工业大学信息公开网', url: 'https://xxgk.bjut.edu.cn/' },
        {
          name: '北京工业大学图书馆资源访问系统',
          url: 'https://libziyuan.bjut.edu.cn/portal/#!/service',
        },
        { name: '北京工业大学邮件系统', url: 'https://mail.bjut.edu.cn/' },
        {
          name: '学生管理系统',
          url: 'https://xgxt.bjut.edu.cn/user/index.htm',
        },
        {
          name: 'vpn登录',
          url: 'https://vpn.bjut.edu.cn/prx/000/http/localhost/login/index.html',
        },
        {
          name: '考试系统',
          url: 'https://mooc1.chaoxing.com/exam-ans/exam/test/examcode/examlist?edition=1&nohead=0&fid=',
        },
        { name: '党课', url: 'http://rdjypx.bjut.edu.cn/login/#/login' },
        { name: '体测成绩查询', url: 'http://172.20.4.27/weixin/' },
        {
          name: '学术学位硕士生导师-北京工业大学研究生招生网',
          url: 'https://yanzhao.bjut.edu.cn/dsdw/sssds/xsxwsssds.htm',
        },
        { name: '北工大本科招生网', url: 'https://admissions.bjut.edu.cn/' },
      ],
    },
    {
      title: '更多分享',
      links: [
        { name: '雨课堂', url: 'https://www.yuketang.cn/v2/web/index' },
        { name: '清华社英语在线', url: 'https://www.tsinghuaelt.com/' },
        { name: '数苑网', url: 'http://myzone.sciyard.com/' },
        { name: '批改网', url: 'http://www.pigai.org' },
        { name: '志愿北京', url: 'https://www.bv2008.cn/' },
        {
          name: 'SCI期刊影响因子查询',
          url: 'https://www.letpub.com.cn/index.php?fieldtag=all&firstletter=&page=journalapp',
        },
        { name: '心理测评', url: 'https://saas.psyyun.com/#/wel/index' },
        {
          name: '中国共产党章程（2022年版）_共产党员网',
          url: 'https://www.12371.cn/special/zggcdzc/',
        },
        {
          name: 'Google 学术搜索',
          url: 'https://scholar.google.com.hk/?hl=zh-CN',
        },
        { name: 'Overleaf LaTex编辑', url: 'https://cn.overleaf.com/project' },
        { name: '读秀学术搜索', url: 'https://www.duxiu.com/' },
        { name: '中国知网', url: 'https://cnki.net/' },
        { name: '国标查询', url: 'http://std.samr.gov.cn/' },
        { name: '标准地图服务系统', url: 'http://bzdt.ch.mnr.gov.cn/' },
        { name: '在线工具箱', url: 'https://www.67tool.com/' },
        { name: '中國哲學書電子化計劃', url: 'https://ctext.org/zh' },
      ],
    },
  ];

  return (
    <Layout>
      <Seo
        templateTitle='Address Navigation'
        description='A list of useful links for Beijing University of Technology.'
      />

      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className='layout px-4 py-12 md:px-0'>
            <h1 className='mb-2 text-3xl font-bold md:text-5xl' data-fade='0'>
              <Accent>地址导航</Accent>
            </h1>
            <p
              className='mt-2 text-lg text-gray-600 dark:text-gray-300'
              data-fade='1'
            >
              北京工业大学常用网站和资源链接。
            </p>
            <div className='mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {mockData.map((section, index) => (
                <div
                  key={index}
                  className='rounded-lg bg-white p-6 shadow-md dark:bg-gray-800'
                >
                  <h2 className='mb-4 border-b border-gray-300 pb-2 text-2xl font-semibold dark:border-gray-600'>
                    {section.title}
                  </h2>
                  <ul className='space-y-4'>
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href={link.url}
                          className={clsx(
                            'text-gray-600 dark:text-gray-300',
                            'transition-colors duration-300 hover:!text-blue-800',
                            'focus:outline-none focus:ring-2 focus:ring-blue-700'
                          )}
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default AddressNavigation;
