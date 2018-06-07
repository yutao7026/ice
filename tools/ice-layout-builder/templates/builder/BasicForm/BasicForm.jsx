import React, { Component } from 'react';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import { Input, Radio } from '@icedesign/base';

const { Group: RadioGroup } = Radio;

export default class BasicForm extends Component {
  static displayName = 'BasicForm';

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
            <span>布局名称：</span>
            <IceFormBinder name="name" required message="布局名称必填">
              <Input size="large" />
            </IceFormBinder>
            <IceFormError style={{ marginLeft: 10 }} name="name" />
          </div>

          <div className="form-item" style={styles.formItem}>
            <span>选择主题：</span>
            <IceFormBinder required name="theme">
              <RadioGroup>
                <Radio id="fullWidth" value="dark">
                  深色
                </Radio>
                <Radio id="elasticWidth" value="light">
                  浅色
                </Radio>
              </RadioGroup>
            </IceFormBinder>
          </div>

          <div className="form-item" style={styles.formItem}>
            <span>布局容器：</span>
            <IceFormBinder required name="layout">
              <RadioGroup>
                <Radio id="fullWidth" value="fluid-layout">
                  通栏布局
                </Radio>
                <Radio id="elasticWidth" value="boxed-layout">
                  固宽布局
                </Radio>
              </RadioGroup>
            </IceFormBinder>
          </div>
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
