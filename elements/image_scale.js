import React, {Component} from 'react';
import {Image} from 'react-native';

export default class ImageScale extends Component {
  state = {
    ratio: 1,
  };
  render() {
    return (
      <Image
        source={{uri: this.props.source}}
        style={{
          width: this.props.width ?? '100%',
          aspectRatio: this.state.ratio,
        }}
      />
    );
  }
  componentDidMount() {
    Image.getSize(this.props.source, (w, h) => {
      const ratio = w / h;
      this.setState({ratio: ratio});
    });
  }
}
