/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import {colors} from '../helpers/colors';
import {styles} from '../helpers/styles';

export default class Button extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.onPress()}
        disabled={this.props.loading || this.props.disabled}
        activeOpacity={0.8}
        style={[
          styles.button,
          {backgroundColor: this.props.bg},
          this.props.loading || this.props.disabled ? {opacity: 0.8} : {},
          this.props.style,
        ]}>
        {this.setLoading()}
        <Text
          style={[
            styles.button_text,
            this.props.color ? {color: this.props.color} : {},
          ]}>
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
  setLoading() {
    if (this.props.loading) {
      return (
        <ActivityIndicator
          style={{marginRight: 5}}
          size="small"
          color={this.props.color ? this.props.color : colors.light}
        />
      );
    }
  }
}
