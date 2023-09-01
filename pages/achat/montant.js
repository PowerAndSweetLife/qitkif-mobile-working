/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Appearance,
  Pressable,
} from 'react-native';
import {colors} from '../../helpers/colors';
import {boxShadow} from '../../helpers/box_shadow';
import Header from './header';
import {connect} from 'react-redux';
import {setMontant} from '../../store/slices/achat_slice';
import {styles} from '../../helpers/styles';
import {Button, NumberPad} from '../../elements';

const colorScheme = Appearance.getColorScheme();

class Montant extends Component {
  state = {
    montant: '',
    montantError: false,
    showKP: false,
  };
  render() {
    return (
      <View style={styles.wrapper}>
        <Header progress={3} navigation={this.props.navigation} />
        <View style={[_styles.banner, boxShadow.depth_10]}>
          <Text style={_styles.banner_title}>Montant de la proposition :</Text>
          <Text style={[styles.text, {color: colors.gray}]}>
            ( Min: 1 500, Max: 1 500 000 )
          </Text>
          <View style={_styles.input_container}>
            <Pressable
              onPress={() => this.setState({showKP: true})}
              style={[
                styles.input,
                _styles.input_field,
                this.state.montantError ? {borderColor: colors.danger} : {},
              ]}>
              <View pointerEvents="none">
                <TextInput
                  style={[styles.text, {fontSize: 18}]}
                  showSoftInputOnFocus={false}
                  value={this.state.montant}
                  caretHidden={true}
                />
              </View>
            </Pressable>
            <Text style={_styles.curracy}>FCFA</Text>
          </View>
          <Text style={[styles.text, {color: colors.danger}]}>
            {this.state.montantError}
          </Text>
        </View>
        <View style={_styles.main_container}>
          <Button
            title="Valider le montant"
            onPress={() => this.submit()}
            bg={colors.primary}
          />
        </View>
        <NumberPad
          onPress={(value, show) =>
            this.setState({montant: value, showKP: show})
          }
          show={this.state.showKP}
        />
      </View>
    );
  }
  submit() {
    if (this.state.montant.trim() === '') {
      this.setState({montantError: 'Veuillez indiquer le montant'});
    } else if (
      Number(this.state.montant) < 1500 ||
      Number(this.state.montant > 1500000)
    ) {
      this.setState({montantError: 'Montant incorrect'});
    } else {
      this.props.dispatch(setMontant(this.state.montant));
      this.props.navigation.navigate('CodeAchat', {
        type: this.props.route.params.type,
      });
    }
  }
  componentDidMount() {
    //console.log(this.props);
  }
}

const _styles = StyleSheet.create({
  banner: {
    marginHorizontal: 20,
    marginTop: -75,
    backgroundColor: colorScheme === 'dark' ? colors.black : '#FFF',
    minHeight: 150,
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  banner_title: {
    fontSize: 18,
    fontFamily: 'Feather',
    color: colors.primary,
    marginTop: 20,
  },
  input_container: {
    flexDirection: 'row',
    marginTop: 20,
  },
  input_field: {
    borderColor: colors.gray,
    flex: 1,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 10,
    //marginBottom: 20,
  },
  curracy: {
    backgroundColor: colorScheme === 'dark' ? colors.dark : colors.lightgray,
    height: 50,
    borderTopColor: colors.gray,
    borderRightColor: colors.gray,
    borderBottomColor: colors.gray,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    color: colors.primary,
    fontSize: 18,
    fontFamily: 'Feather',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 10,
  },
  main_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

const mapStateToProps = state => {
  const {achat} = state;
  return {achat};
};

export default connect(mapStateToProps)(Montant);
