/* eslint-disable flowtype/require-valid-file-annotation */

import { create, SheetsRegistry } from "jss";
import { createMuiTheme, jssPreset } from "material-ui/styles";
import { blueGrey, blue } from "material-ui/colors";
import createGenerateClassName from "material-ui/styles/createGenerateClassName";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: blue,
    type: "dark",
    background: {
      default: "#111",
      paper: "#111",
      appBar: "#111",
      contentFrame: "#eeeeee"
    }
  },
  typography: {
    // Use the system font.
    fontFamily: "BlinkMacSystemFont, -apple-system, 'SF Display'"
  }
});

// Configure JSS
const jss = create(jssPreset());
jss.options.createGenerateClassName = createGenerateClassName;

export const sheetsManager = new Map();

export default function createContext() {
  return {
    jss,
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager,
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry()
  };
}
