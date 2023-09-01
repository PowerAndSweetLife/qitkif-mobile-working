import React, {Component} from 'react';
import {
  Appearance,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../helpers/colors';
import {NumberPad} from '../elements';
import {styles} from '../helpers/styles';

const colorScheme = Appearance.getColorScheme();

export default class Draft extends Component {
  state = {
    value: '',
    showKP: false,
  };
  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView keyboardShouldPersistTaps='handled'>
            <Pressable onPress={() => this.setState({showKP: true})}>
                <View pointerEvents='none'>
                    <TextInput
                        style={[_styles.input]}
                        showSoftInputOnFocus={false}
                        value={this.state.value}
                        caretHidden={true}
                    />
                </View>
            </Pressable>
        </ScrollView>

        <NumberPad
          onPress={(value, show) => this.setState({value: value, showKP: show})}
          show={this.state.showKP}
        />
      </View>
    );
  }
  initialize() {
    this.setState({editable: false});
  }
}

const _styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    color: '#000',
  },
});
