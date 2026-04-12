import { Dimensions } from 'react-native';

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const WIDTH_SCALE = SCREEN_WIDTH / 414;
export const HEIGHT_SCALE = SCREEN_HEIGHT / 896;