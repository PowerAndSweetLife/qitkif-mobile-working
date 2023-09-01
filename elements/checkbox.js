import React, {Component} from 'react';
import {Appearance, Pressable, StyleSheet, View} from 'react-native';
import {colors} from '../helpers/colors';

const colorScheme = Appearance.getColorScheme();

export default class Checkbox extends Component {
  render() {
    return (
      <Pressable
        style={[_styles.container, this.props.container]}
        onPress={() => this.toggleActive()}>
        {this.state.active ? <View style={_styles.content} /> : null}
      </Pressable>
    );
  }
  toggleActive() {
    let isActive = !this.state.active;
    this.setState({active: isActive});
    this.props.onPress(isActive);
  }
}

const _styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colorScheme === 'dark' ? colors.light : colors.dark,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: 13,
    height: 13,
    backgroundColor: colorScheme === 'dark' ? colors.light : colors.dark,
  },
});
