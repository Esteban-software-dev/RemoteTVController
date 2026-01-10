import { Dimensions } from "react-native";

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const MAX_DRAG = 12;

export const EXPANDED_WIDTH = SCREEN_WIDTH - 20;
export const EXPANDED_HEIGHT = 70;
export const COLLAPSED_HEIGHT = 50;
export const COLLAPSED_WIDTH = 200;
export const AUTO_COLLAPSE_DELAY = 5000;
