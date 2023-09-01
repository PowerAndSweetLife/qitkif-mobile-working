import React, {Component} from 'react';
import {TextInput} from 'react-native';
import {styles} from '../helpers/styles';

export default class Textarea extends Component {
  render() {
    return (
      <TextInput
        style={[styles.input, this.props.style]}
        onChangeText={value => this.props.onKeyup(value)}
        multiline={true}
        numberOfLines={4}
        onSubmitEditing={() => this.props.onSubmitEditing()}
      />
    );
  }
}
