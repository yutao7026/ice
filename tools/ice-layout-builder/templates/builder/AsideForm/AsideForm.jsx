import React, { Component } from 'react';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
} from '@icedesign/form-binder';
import { Checkbox, Radio } from '@icedesign/base';

const { Group: RadioGroup } = Radio;

export default class AsideForm extends Component {
  static displayName = 'AsideForm';

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
            <span>侧边栏导航：</span>
            <IceFormBinder required name="aside.enabled">
              <Checkbox size="large" defaultChecked />
            </IceFormBinder>
          </div>
          {this.state.value.aside.enabled && (
            <div>
              <div className="form-item" style={styles.formItem}>
                <span>定位：</span>
                <IceFormBinder required name="aside.position">
                  <RadioGroup>
                    <Radio id="fullWidth" value="embed-fixed">
                      固定定位
                    </Radio>
                    <Radio id="elasticWidth" value="static">
                      静态定位
                    </Radio>
                    {/* TODO: 暂不支持
                      <Radio id="elasticWidth" value="overlay-fixed">
                        固定定位(悬浮)
                      </Radio>
                    */}
                  </RadioGroup>
                </IceFormBinder>
              </div>

              <div className="form-item" style={styles.formItem}>
                <span>是否折叠：</span>
                <IceFormBinder required name="aside.collapsed">
                  <Checkbox size="large" />
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
