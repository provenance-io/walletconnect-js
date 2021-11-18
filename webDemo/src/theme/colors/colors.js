import { allColors } from './allColors';

export const colors = {
  // -----------------
  // BOX_SHADOWS
  // -----------------
  BOX_SHADOW_MAIN: `1px 1px 4px 1px ${allColors.BLACK10}`,
  // -----------------
  // LINKS
  // -----------------
  LINK_COLOR: allColors.PURPLE_PRIMARY,
  // -----------------
  // FONT
  // -----------------
  FONT_COLOR_PRIMARY: allColors.GREY_DARKER,
  FONT_COLOR_SECONDARY: allColors.GREY_DARK,
  // -----------------
  // BUTTONS
  // -----------------
  BUTTON_COLOR: allColors.WHITE,
  BUTTON_BG: allColors.BLUE_PRIMARY,
  BUTTON_BORDER: allColors.BLUE_PRIMARY,
  BUTTON_HOVER: '',
  BUTTON_BORDER_HOVER: '',
  // -----------------
  // SIDEBAR
  // -----------------
  SIDEBAR_BG: allColors.WHITE,
  // -----------------
  // BACKGROUND/PAGE
  // -----------------
  PAGE_BG: allColors.GREY_LIGHTEST,
  // -----------------
  // INPUT
  // -----------------
  INPUT_BORDER: allColors.GREY_DARK,
  INPUT_ERROR: allColors.RED_PRIMARY,
  INPUT_DISABLED: allColors.GREY_PRIMARY,
  // -----------------
  // ALERTS
  // -----------------
  ALERT_ERROR: allColors.RED_PRIMARY,
  ALERT_WARNING: allColors.YELLOW_PRIMARY,
  ALERT_SUCCESS: allColors.GREEN_PRIMARY,
  // -----------------
  // ALL COLORS
  // -----------------
  ...allColors,
};
