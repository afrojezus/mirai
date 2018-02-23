/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';
import { blue } from 'material-ui/colors/index';

// Apply some reset
const theme = createMuiTheme({
	palette: {
		primary: blue,
		secondary: blue,
		type: 'dark',
		background: {
			default: '#111',
			paper: '#111',
			appBar: '#111',
			contentFrame: '#eeeeee',
		},
	},
	typography: {
		// Use the system font.
		fontFamily: "BlinkMacSystemFont, -apple-system, 'SF Display'",
		fontSize: 16,
	},
	overrides: {
		MuiTypography: {
			body1: {
				fontSize: 16,
			},
		},
		MuiTooltip: {
			tooltipBottom: {
				fontSize: 14,
			},
		},
	},
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
