import React, {Component} from 'react';
import {
  Appearance,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../helpers/colors';
import {styles} from '../helpers/styles';

const colorScheme = Appearance.getColorScheme();

export default class NumberPad extends Component {
  state = {
    value: this.props.default ?? '',
  };
  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <View style={_styles.wrapper}>
        <View style={_styles.container}>
          <View style={_styles.pads}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={_styles.pad_item}
              onPress={() => this.setVal(1)}>
              <Text style={[styles.text, _styles.pad_text]}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={_styles.pad_item}
              onPress={() => this.setVal(2)}>
              <Text style={[styles.text, _styles.pad_text]}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={_styles.pad_item}
              onPress={() => this.setVal(3)}>
              <Text style={[styles.text, _styles.pad_text]}>3</Text>
            </TouchableOpacity>
          </View>
          <View style={_styles.pads}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={_styles.pad_item}
              onPress={() => this.setVal(4)}>
              <Text style={[styles.text, _styles.pad_text]}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={_styles.pad_item}
              onPress={() => this.setVal(5)}>
              <Text style={[styles.text, _styles.pad_text]}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={_styles.pad_item}
              onPress={() => this.setVal(6)}>
              <Text style={[styles.text, _styles.pad_text]}>6</Text>
            </TouchableOpacity>
          </View>

          <View style={_styles.pads}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={_styles.pad_item}
              onPress={() => this.setVal(7)}>
              <Text style={[styles.text, _styles.pad_text]}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={_styles.pad_item}
              onPress={() => this.setVal(8)}>
              <Text style={[styles.text, _styles.pad_text]}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={_styles.pad_item}
              onPress={() => this.setVal(9)}>
              <Text style={[styles.text, _styles.pad_text]}>9</Text>
            </TouchableOpacity>
          </View>

          <View style={_styles.pads}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={_styles.pad_item}
              onPress={() => this.hidePad()}>
              <Image
                style={_styles.pad_icon}
                source={{
                  uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA3QAAAN0BcFOiBwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAMkSURBVFiF7ZdvaJVVGMB/z/ue6/U255yat1k3/24fnA1FFLSR5dwHhxookoMRQaCEXzQEwYgQ/GIh/iUyTEXKT2Xkus2/U8PNhohatGgTFObIwZyz6dVt7zlPH3aFJXPeXdtdoAfOh+e8z/P8fu/LOfAeUVWGcnhDSn8uMFQC0+/umVaY+HI1gGR6E+a37X3F971agZgiW0wm4ZPaD4wKEa5SS0wBEbmdMYH8q1VhMzL8g8J0BUTZ9We0fEtG9oCwyXORu9+4wLzhAoOz5tvGaMNagIx8gUlNM3YqujwZnvU7wxXKJy4jAhOvxTeCvwZA4DdPh7/dOHVh58Png3oKXm08+h6wPxk2qQZzmwoWN/fOGTSBWH31IhV3BDAgt61S/Ne0kvpH8wZFIO/3s7NFOQ1kAQ9E3MLmwrdq+sr1BGT85drtL185P/O/gI+7/HM+3SaugcnSwDgJvPLHwQFk3IVfdgNrgDuoK2uZPbc2XXi0ri6KTy0wuae7fNAya84X/dV41pp6Z0PqbCjHufDxsRculaQDf7GmJtsR+snZ0GRnQ1hrNj8JDsk9MPbcr++qsA/wBTqdsqKtuKgyVbhcvBga/cDEQUp7FmTfrXmvvZ9KrQfQWlx0kC7/HQ1MlwtMGGsOjz7zx8qU4CC5HZH9GoRKNTCoNfG2rlurU5bvfQpyqhsWCfIdEAEcKqvaS6Z+1V+DUdWNnwHrk2FdVmLEgubFeYm0BACyT1yfL6qVQDagIrLuTunEHX0V5xy7vlZFtwGgNBDufv3vNwtaU4X3KQDwwo835nieHgVye3rz8b2y2OZ/icabVqpwCBDgprVu3v0lE64NBP5YAYARR24UOfzjQDSZ+mli6UsbACKVLQtEXRUwDOgQdP69peMvDRTerwDA8O9bCwROAjEAEf1cLHudJ2eAkUA3KmX3l405mQ78iQIAkcPtE5zlFDAludRFz5sraEXnitxD6cJTEgCQrxN5xncngMJeq+u7y7O2Pg08ZQEAOdgxxveGHVOYBWyzFeEPnxYOgKqmPNmjORywH6EqA6nrb2b8t/zR8WzejP5XAv8Ap0mV4NLjtEMAAAAASUVORK5CYII=',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={_styles.pad_item}
              onPress={() => this.setVal(0)}>
              <Text style={[styles.text, _styles.pad_text]}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.6}
              style={_styles.pad_item}
              onPress={() => this.clearVal()}>
              <Image
                style={_styles.pad_icon}
                source={{
                  uri: 'data:image/png;base64,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',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  setVal(number) {
    let value = number.toString();
    let newState = this.state.value + '' + value;
    this.setState({value: newState});
    this.props.onPress(newState, true);
  }

  clearVal() {
    let newVal = this.state.value;
    if (newVal.length > 0) {
      newVal = newVal.slice(0, -1);
      this.setState({value: newVal});
      this.props.onPress(newVal, true);
    }
  }
  hidePad() {
    this.props.onPress(this.state.value, false);
  }
}

const _styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    bottom: 0,
    left: 0,
    borderTopColor: colors.gray,
    borderTopWidth: 1,
    width: Dimensions.get('window').width,
    paddingTop: 15,
    alignItems: 'center',
    backgroundColor: colorScheme === 'dark' ? '#485460' : '#d2dae2',
  },
  pads: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  pad_item: {
    width: 85,
    height: 55,
    borderColor: colorScheme === 'dark' ? colors.darkgray : colors.light,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 30,
    backgroundColor: colorScheme === 'dark' ? colors.dark : '#FFF',
  },
  pad_text: {
    fontWeight: '500',
    fontSize: 32,
    color: colorScheme === 'dark' ? colors.light : colors.dark,
  },
  pad_icon: {
    width: 30,
    height: 30,
  },
});
