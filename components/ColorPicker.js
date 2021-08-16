import { TwitterPicker } from 'react-color';
import { PALETTE } from '../consts';

export const ColorPicker = ({ color, onChangeComplete }) => (
  <TwitterPicker
    color={color}
    onChangeComplete={onChangeComplete}
    triangle="hide"
    colors={PALETTE}
  />
);
