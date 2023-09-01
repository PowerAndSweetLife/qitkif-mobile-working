import React, {Component} from 'react';
import {TextInput} from 'react-native';
import {styles} from '../helpers/styles';

export default class Input extends Component {
  render() {
    return (
      <TextInput
        style={[styles.input, this.props.style]}
        onChangeText={value => this.props.onKeyup(value)}
        onSubmitEditing={() => this.props.onSubmitEditing()}
        placeholder={this.props.placeholder}
        keyboardType={this.props.keyboard}
      />
    );
  }
}
