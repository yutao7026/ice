import React, { PureComponent } from 'react';
import Layout from '@icedesign/layout';
import Logo from './__components_Logo__';

export default class Footer extends PureComponent {
  render() {
    return (
      <Layout.Footer
        className="ice-design-layout-footer"
        style={{
          textAlign: 'center',
          lineHeight: '36px',
        }}
      >
        <div className="ice-design-layout-footer-body">
          <div style={{ filter: 'grayscale(100%)', opacity: 0.3 }}>
            <Logo />
          </div>
          <div
            style={{
              color: '#999',
              lineHeight: 1.5,
              fontSize: 12,
              textAlign: 'right',
            }}
          >
            阿里巴巴集团
            <br />
            © 2018 版权所有
          </div>
        </div>
      </Layout.Footer>
    );
  }
}
