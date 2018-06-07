/* eslint no-undef:0, no-unused-expressions:0, array-callback-return:0, react/default-props-match-prop-types: 0, no-restricted-syntax: 0, no-prototype-builtins: 0 */
import React, { Component } from 'react';
import Layout from '@icedesign/layout';
import { withRouter } from 'react-router';
import { enquire } from 'enquire-js';
import Header from '../../components/Header';
import Aside from '../../components/Aside';
import Footer from '../../components/Footer';
import './scss/index.scss';

function deepClone(source) {
  if (!source || typeof source !== 'object') {
    throw new Error('error arguments');
  }
  const targetObj = source.constructor === Array ? [] : {};
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {};
        targetObj[keys] = deepClone(source[keys]);
      } else {
        targetObj[keys] = source[keys];
      }
    }
  }
  return targetObj;
}

@withRouter
export default class PreviewLayout extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      isScreen: null,
      layoutConfig: props.value,
    };
  }

  componentDidMount() {
    this.enquireScreenRegister();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      layoutConfig: nextProps.value,
    });
  }

  /**
   * 注册监听屏幕的变化，可根据不同分辨率做对应的处理
   */
  enquireScreenRegister = () => {
    const isMobile = 'screen and (max-width: 720px)';
    const isTablet = 'screen and (min-width: 721px) and (max-width: 1199px)';
    const isDesktop = 'screen and (min-width: 1200px)';

    enquire.register(isMobile, this.enquireScreenHandle('isMobile'));
    enquire.register(isTablet, this.enquireScreenHandle('isTablet'));
    enquire.register(isDesktop, this.enquireScreenHandle('isDesktop'));
  };

  enquireScreenHandle = (type) => {
    const handler = {
      match: () => {
        this.setState({
          isScreen: type,
        });
      },
    };

    return handler;
  };

  formatLayoutConfig = () => {
    const value = deepClone(this.state.layoutConfig);
    Object.keys(value).forEach((key) => {
      if (['header', 'aside', 'footer'].indexOf(key) !== -1) {
        if (!value[key].enabled) {
          value[key] = null;
        }
      }
    });

    return value;
  };

  renderContent = () => {
    const layoutConfig = this.formatLayoutConfig();
    const { theme } = layoutConfig;
    const isMobile = this.state.isScreen !== 'isDesktop';
    const header = <Header theme={theme} isMobile={isMobile} />;
    const aside = (
      <Layout.Aside theme={theme} width="auto">
        <Aside
          isMobile={isMobile}
          collapse={layoutConfig.aside && layoutConfig.aside.collapsed}
        />
      </Layout.Aside>
    );
    const footer = <Footer />;

    const layoutFixable =
      (layoutConfig.header && layoutConfig.header.position === 'fixed') ||
      (layoutConfig.footer && layoutConfig.footer.position === 'fixed') ||
      (layoutConfig.aside && layoutConfig.aside.position === 'embed-fixed');

    //  header, aside, footer 同时存在
    if (layoutConfig.header && layoutConfig.aside && layoutConfig.footer) {
      if (
        layoutConfig.header.width === 'full-width' &&
        layoutConfig.footer.width === 'full-width'
      ) {
        return (
          <Layout fixable={layoutFixable}>
            {header}
            <Layout.Section
              scrollable={layoutConfig.aside.position !== 'embed-fixed'}
            >
              {aside}
              <Layout.Main
                scrollable={layoutConfig.aside.position === 'embed-fixed'}
              >
                {this.props.children}
              </Layout.Main>
            </Layout.Section>
            {footer}
          </Layout>
        );
      } else if (
        layoutConfig.header.width === 'elastic-width' &&
        layoutConfig.footer.width === 'elastic-width'
      ) {
        return (
          <Layout fixable={layoutFixable}>
            {aside}
            {layoutConfig.header.position === 'static' &&
              layoutConfig.footer.position === 'static' && (
                <Layout.Section scrollable>
                  <Layout.Main>
                    {header}
                    {this.props.children}
                    {footer}
                  </Layout.Main>
                </Layout.Section>
              )}
            {layoutConfig.header.position === 'fixed' &&
              layoutConfig.footer.position === 'static' && (
                <Layout.Section>
                  {header}
                  <Layout.Main scrollable>
                    {this.props.children}
                    {footer}
                  </Layout.Main>
                </Layout.Section>
              )}
            {layoutConfig.header.position === 'fixed' &&
              layoutConfig.footer.position === 'fixed' && (
                <Layout.Section>
                  {header}
                  <Layout.Main scrollable>{this.props.children}</Layout.Main>
                  {footer}
                </Layout.Section>
              )}
            {layoutConfig.header.position === 'static' &&
              layoutConfig.footer.position === 'fixed' && (
                <Layout.Section>
                  <Layout.Main scrollable>
                    {header}
                    {this.props.children}
                  </Layout.Main>
                  {footer}
                </Layout.Section>
              )}
          </Layout>
        );
      } else if (
        layoutConfig.header.width === 'full-width' &&
        layoutConfig.footer.width === 'elastic-width'
      ) {
        return (
          <Layout fixable={layoutFixable}>
            {header}
            <Layout.Section
              scrollable={layoutConfig.aside.position !== 'embed-fixed'}
            >
              {aside}
              <Layout.Main
                scrollable={layoutConfig.aside.position === 'embed-fixed'}
              >
                {this.props.children}
                {footer}
              </Layout.Main>
            </Layout.Section>
          </Layout>
        );
      } else if (
        layoutConfig.header.width === 'elastic-width' &&
        layoutConfig.footer.width === 'full-width'
      ) {
        return (
          <Layout fixable={layoutFixable}>
            <Layout.Section
              scrollable={layoutConfig.aside.position !== 'embed-fixed'}
            >
              {aside}
              <Layout.Main
                scrollable={layoutConfig.aside.position !== 'embed-fixed'}
              >
                {header}
                {this.props.children}
              </Layout.Main>
            </Layout.Section>
            {footer}
          </Layout>
        );
      }
    } else if (layoutConfig.aside && layoutConfig.footer) {
      if (layoutConfig.footer.width === 'full-width') {
        return (
          <Layout fixable={layoutFixable}>
            <Layout.Section
              scrollable={layoutConfig.aside.position !== 'embed-fixed'}
            >
              {aside}
              <Layout.Main
                scrollable={layoutConfig.aside.position === 'embed-fixed'}
              >
                {this.props.children}
              </Layout.Main>
            </Layout.Section>
            {footer}
          </Layout>
        );
      } else if (layoutConfig.footer.width === 'elastic-width') {
        <Layout fixable={layoutFixable}>
          {aside}
          <Layout.Section
            scrollable={layoutConfig.aside.position !== 'embed-fixed'}
          >
            <Layout.Main
              scrollable={layoutConfig.aside.position === 'embed-fixed'}
            >
              {this.props.children}
            </Layout.Main>
            {footer}
          </Layout.Section>
        </Layout>;
      }
    } else if (layoutConfig.header && layoutConfig.aside) {
      if (layoutConfig.header.width === 'full-width') {
        return (
          <Layout fixable={layoutFixable}>
            {header}
            <Layout.Section
              scrollable={layoutConfig.aside.position !== 'embed-fixed'}
            >
              {aside}
              <Layout.Main
                scrollable={layoutConfig.aside.position === 'embed-fixed'}
              >
                {this.props.children}
              </Layout.Main>
            </Layout.Section>
          </Layout>
        );
      } else if (layoutConfig.header.width === 'elastic-width') {
        return (
          <Layout fixable={layoutFixable}>
            {aside}
            <Layout.Section
              scrollable={layoutConfig.header.position !== 'fixed'}
            >
              {header}
              <Layout.Main
                scrollable={layoutConfig.header.position === 'fixed'}
              >
                {this.props.children}
              </Layout.Main>
            </Layout.Section>
          </Layout>
        );
      }
    } else if (layoutConfig.header && layoutConfig.footer) {
      if (
        (layoutConfig.header.position === 'fixed' &&
          layoutConfig.footer.position === 'fixed') ||
        (layoutConfig.header.position === 'static' &&
          layoutConfig.footer.position === 'static')
      ) {
        return (
          <Layout fixable={layoutFixable}>
            <Layout.Section
              scrollable={
                layoutConfig.header.position === 'static' &&
                layoutConfig.footer.position === 'static'
              }
            >
              {header}
              <Layout.Main
                scrollable={
                  layoutConfig.header.position === 'fixed' &&
                  layoutConfig.footer.position === 'fixed'
                }
              >
                {this.props.children}
              </Layout.Main>
              {footer}
            </Layout.Section>
          </Layout>
        );
      } else if (
        layoutConfig.header.position === 'fixed' &&
        layoutConfig.footer.position === 'static'
      ) {
        return (
          <Layout fixable={layoutFixable}>
            {header}
            <Layout.Section scrollable>
              <Layout.Main>{this.props.children}</Layout.Main>
              {footer}
            </Layout.Section>
          </Layout>
        );
      } else if (
        layoutConfig.header.position === 'static' &&
        layoutConfig.footer.position === 'fixed'
      ) {
        return (
          <Layout fixable={layoutFixable}>
            <Layout.Section scrollable>
              {header}
              <Layout.Main>{this.props.children}</Layout.Main>
            </Layout.Section>
            {footer}
          </Layout>
        );
      }
    } else if (layoutConfig.header) {
      return (
        <Layout fixable={layoutFixable}>
          <Layout.Section>
            {header}
            <Layout.Main scrollable>{this.props.children}</Layout.Main>
          </Layout.Section>
        </Layout>
      );
    } else if (layoutConfig.aside) {
      return (
        <Layout fixable={layoutFixable}>
          {aside}
          <Layout.Section>
            <Layout.Main scrollable>{this.props.children}</Layout.Main>
          </Layout.Section>
        </Layout>
      );
    } else if (layoutConfig.footer) {
      return (
        <Layout fixable={layoutFixable}>
          <Layout.Section>
            <Layout.Main scrollable>{this.props.children}</Layout.Main>
          </Layout.Section>
          {footer}
        </Layout>
      );
    }
  };

  render() {
    const { layoutConfig } = this.state;
    const layoutClassName = `ice-design-layout-${
      layoutConfig.theme
    } ice-design-layout ice-design-${layoutConfig.layout}`;

    return <div className={layoutClassName}>{this.renderContent()}</div>;
  }
}
