/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from "react";
import { MuiThemeProvider, createMuiTheme } from "material-ui/styles";
import Reboot from "material-ui/Reboot";
import { blue } from "material-ui/colors/index";

// If the user has opted a background, apply the hues as accent color etc.
const getColors = () => {
  const hue = localStorage.getItem("user-hue");
  if (hue) {
    let hues = JSON.parse(hue);
    return {
      hue: hues.hue,
      hueVib: hues.hueVib,
      hueVibN: hues.hueVibN
    };
  } else {
    return null;
  }
};

// Apply some reset
const theme = createMuiTheme({
  palette: {
    primary: getColors()
      ? {
          main: getColors().hueVib
            ? getColors().hueVib
            : getColors().hue ? getColors().hue : blue
        }
      : blue,
    secondary: blue,
    type: "dark",
    background: {
      default: getColors() && getColors().hue ? getColors().hue : "#111",
      paper: getColors() && getColors().hue ? getColors().hue : "#111",
      appBar: getColors() && getColors().hue ? getColors().hue : "#111",
      contentFrame: "#eeeeee"
    },
    contrastThreshold: 1.7
  },
  typography: {
    // Use the system font.
    fontFamily: "BlinkMacSystemFont, -apple-system, 'SF Display'",
    fontSize: 16
  },
  overrides: {
    MuiTypography: {
      body1: {
        fontSize: 16
      }
    },
    MuiTooltip: {
      tooltipBottom: {
        fontSize: 14
      }
    }
  }
});
// Expose the theme as a global variable so people can play with it.
if (process.browser) {
  window.theme = theme;
}

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
        <Reboot />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
