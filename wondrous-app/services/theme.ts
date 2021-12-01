import { createTheme } from '@material-ui/core/styles'
import * as Colors from './colors'

const theme = createTheme({
	palette: {
		primary: {
			main: Colors.Orange,
			contrastText: Colors.White,
		},
		secondary: {
			main: Colors.Blue400,
			contrastText: Colors.White,
		},
		success: {
			main: Colors.Green400,
			contrastText: Colors.White,
		},
		background: {
			default: Colors.White,
		},
	},
	overrides: {
		MuiTextField: {
			root: {
				color: Colors.Grey700,
			},
		},
		MuiDialog: {
			paper: {
				borderRadius: '8px',
			},
		},
		MuiButton: {
			root: {
				borderRadius: '64px',
			},
		},
		MuiInputLabel: {
			shrink: {
				color: `${Colors.Blue400} !important`,
			},
		},
		MuiInput: {},
		MuiStepIcon: {
			completed: {
				color: `${Colors.Blue400} !important`,
			},
			active: {
				color: `${Colors.Blue400} !important`,
			},
		},
		MuiDrawer: {
			paperAnchorLeft: {
				maxWidth: '150px',
			},
		},
		MuiTypography: {
			colorTextPrimary: {
				color: Colors.White,
			},
			colorTextSecondary: {
				color: Colors.Grey100,
			},
		},
	},
	typography: {
		button: {
			textTransform: 'none',
			fontSize: '16px',
			lineHeight: '23px',
			letterSpacing: '0.75%',
		},
		// Maintenance pages
		h1: {
			fontFamily: 'Carmen Sans Bold',
			fontWeight: 'bold',
			fontSize: '52px',
			lineHeight: '60px',
			color: Colors.White,
		},
		// Main page title
		h2: {
			fontWeight: 'bolder',
			fontSize: '40px',
			lineHeight: '48px',
			color: Colors.Grey100,
		},
		h3: {
			fontWeight: 'bolder',
			fontSize: '32px',
			lineHeight: '40px',
			color: Colors.Grey100,
		},
		// Subheading
		h4: {
			fontWeight: 'bolder',
			fontSize: '24px',
			lineHeight: '32px',
			color: Colors.Grey100,
		},
		h5: {
			fontSize: '20px',
			lineHeight: '28px',
			color: Colors.Grey100,
			letterSpacing: '0.25%',
			paragraphSpacing: '16px',
		},
		subtitle1: {
			fontSize: '20px',
			lineHeight: '28px',
			letterSpacing: '0.15%',
			color: Colors.Grey100,
		},
		subtitle2: {
			fontSize: '18px',
			lineHeight: '26px',
			color: Colors.Grey100,
			letterSpacing: '0.75%',
		},
		body1: {
			fontSize: '16px',
			lineHeight: '28px',
			color: Colors.Grey100,
			letterSpacing: '0.5%',
		},
		body2: {
			fontSize: '14px',
			lineHeight: '24px',
			color: Colors.Grey100,
			letterSpacing: '0.25%',
		},
		fontFamily: 'Faktum, sans-serif',
	},
	props: {
		MuiWithWidth: {
			// Initial width property
			initialWidth: 'lg', // Breakpoint being globally set 🌎!
		},
		MuiButtonBase: {
			// The properties to apply
			// disableRipple: true, // No more ripple, on the whole application!
		},
	},
})

export default theme
