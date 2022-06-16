import { createTheme } from '@material-ui/core/styles'
import palette from 'theme/palette'

const theme = createTheme({
	palette: {
		primary: {
			main: palette.purple,
			contrastText: palette.white,
		},
		secondary: {
			main: palette.blue400,
			contrastText: palette.white,
		},
		success: {
			main: palette.green400,
			contrastText: palette.white,
		},
		background: {
			default: palette.white,
		},
	},
	overrides: {
		MuiTextField: {
			root: {
				color: palette.grey700,
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
				color: `${palette.blue400} !important`,
			},
		},
		MuiInput: {},
		MuiStepIcon: {
			completed: {
				color: `${palette.blue400} !important`,
			},
			active: {
				color: `${palette.blue400} !important`,
			},
		},
		MuiDrawer: {
			paperAnchorLeft: {
				maxWidth: '150px',
			},
		},
		MuiTypography: {
			colorTextPrimary: {
				color: palette.White,
			},
			colorTextSecondary: {
				color: palette.grey100,
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
			color: palette.white,
		},
		// Main page title
		h2: {
			fontWeight: 'bolder',
			fontSize: '40px',
			lineHeight: '48px',
			color: palette.grey100,
		},
		h3: {
			fontWeight: 'bolder',
			fontSize: '32px',
			lineHeight: '40px',
			color: palette.grey100,
		},
		// Subheading
		h4: {
			fontWeight: 'bolder',
			fontSize: '24px',
			lineHeight: '32px',
			color: palette.grey100,
		},
		h5: {
			fontSize: '20px',
			lineHeight: '28px',
			color: palette.grey100,
			letterSpacing: '0.25%',
			paragraphSpacing: '16px',
		},
		subtitle1: {
			fontSize: '20px',
			lineHeight: '28px',
			letterSpacing: '0.15%',
			color: Colors.palette.grey100,
		},
		subtitle2: {
			fontSize: '18px',
			lineHeight: '26px',
			color: palette.grey100,
			letterSpacing: '0.75%',
		},
		body1: {
			fontSize: '16px',
			lineHeight: '28px',
			color: palette.grey100,
			letterSpacing: '0.5%',
		},
		body2: {
			fontSize: '14px',
			lineHeight: '24px',
			color: palette.grey100,
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
