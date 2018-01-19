// <!-- auto generated navs start -->
const autoGenNavs = {
  headerNavs: [
    {
      text: '首页',
      to: '/',
    },
    {
      text: '反馈',
      to: 'https://github.com/alibaba/ice',
      external: true,
      newWindow: true,
    },
    {
      text: '帮助',
      to: 'https://alibaba.github.io/ice',
      external: true,
      newWindow: true,
    },
  ],
  asideNavs: [
    {
      text: '首页',
      to: '/',
      icon: 'store',
    },
    {
      text: '一级目录示例',
      to: '/example1',
      icon: 'nav-list',
    },
    {
      text: '二级目录示例',
      to: '/example2',
      icon: 'compass',
      children: [
        {
          text: '二级子目录1',
          to: '/example21',
        },
        {
          text: '二级子目录2',
          to: '/example22',
        },
      ],
    },
  ],
};
// <!-- auto generated navs end -->

const customNavs = [];

function transform(navs) {
  // custom logical
  return navs;
}

export default transform([...autoGenNavs, ...customNavs]);
