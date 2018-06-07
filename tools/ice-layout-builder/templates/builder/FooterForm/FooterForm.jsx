import React, { Component } from 'react';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
} from '@icedesign/form-binder';
import { Checkbox, Radio } from '@icedesign/base';

const { Group: RadioGroup } = Radio;

export default class FooterForm extends Component {
  static displayName = 'FooterForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  /**
   * 表单改变时动态监听
   */
  formChange = (value) => {
    this.setState(
      {
        value,
      },
      () => {
        this.props.onChange(value);
      }
    );
  };

  render() {
    return (
      <IceFormBinderWrapper value={this.state.value} onChange={this.formChange}>
        <div className="form-group">
          <div className="form-item" style={styles.formItem}>
            <span>页脚：</span>
            <IceFormBinder required name="footer.enabled">
              <Checkbox size="large" defaultChecked />
            </IceFormBinder>
          </div>

          {this.state.value.footer.enabled && (
            <div>
              <div className="form-item" style={styles.formItem}>
                <span>定位：</span>
                <IceFormBinder required name="footer.position">
                  <RadioGroup>
                    <Radio id="positionFixed" value="fixed">
                      固定定位
                    </Radio>
                    <Radio id="positionStatic" value="static">
                      静态定位
                    </Radio>
                  </RadioGroup>
                </IceFormBinder>
              </div>

              <div className="form-item" style={styles.formItem}>
                <span>宽度：</span>
                <IceFormBinder required name="footer.width">
                  <RadioGroup>
                    <Radio id="fullWidth" value="full-width">
                      通栏宽度
                    </Radio>
                    <Radio id="elasticWidth" value="elastic-width">
                      弹性宽度
                    </Radio>
                  </RadioGroup>
                </IceFormBinder>
              </div>
            </div>
          )}
        </div>
      </IceFormBinderWrapper>
    );
  }
}

const styles = {
  formItem: {
    marginBottom: '20px',
  },
};
