## ICE Layout Builder

### 组件

- BasicFrom
- HeaderFrom
- AsideFrom
- FooterFrom
- PreviewFrom

### 接口

- generatorLayout(config)

```js
// FOR TEST DATA
const CONFIG = {
  name: 'CustomLayout',
  directory: '',
  theme: 'dark',
  layout: 'fluid-layout',
  header: {
    position: 'static',
    width: 'full-width',
    enabled: true,
  },
  aside: {
    position: 'embed-fixed',
    mode: 'vertical',
    width: 200,
    collapsed: false,
    enabled: true,
  },
  footer: {
    position: 'fixed',
    width: 'full-width',
    enabled: true,
  },
};

generatorLayout(CONFIG)
  .then(() => {
    console.log('生成布局成功');
  })
  .catch((err) => {
    console.log('生成布局失败', err);
  });
```
