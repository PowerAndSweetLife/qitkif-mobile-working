import React, {Component} from 'react';
import ReactNative, {StyleSheet} from 'react-native';
import {colors} from './colors';

export class Text extends Component {
  render() {
    return (
      <ReactNative.Text style={[styles.base, this.props.style]}>
        {this.props.children}
      </ReactNative.Text>
    );
  }
}
const styles = StyleSheet.create({
  base: {
    color: colors.dark,
    fontFamily: 'Feather',
    fontSize: 16,
  },
});
