import {StyleSheet} from 'react-native';
import {colors} from './colors';
import {Appearance} from 'react-native';

const colorScheme = Appearance.getColorScheme();

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colorScheme === 'dark' ? colors.dark : colors.light,
  },
  text: {
    color: colorScheme === 'dark' ? colors.light : colors.dark,
    fontFamily: 'Feather',
    fontSize: 14,
  },
  text_error: {
    fontFamily: 'Feather',
    fontWeight: '700',
    color: colors.danger,
    fontSize: 14,
  },
  button: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button_text: {
    color: colors.light,
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: colorScheme === 'dark' ? colors.light : colors.dark,
    fontSize: 17,
    fontFamily: 'Feather',
  },
  input_error: {
    borderColor: colors.danger,
  },
  loading: {
    width: '100%',
    height: '100%',
    backgroundColor: colorScheme === 'dark' ? colors.dark : colors.light,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
  },
  photo_profil: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
