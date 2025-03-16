import { createTheme } from '@mui/material';
const theme = createTheme({
  typography: {
    fontFamily: [
      'Inter',
    ].join(','),
  },});




export const lightTheme = {
  colors: {
    primary: "#CBD9C4",
    secondary: "#89966B",
    background: '#FFFFFF',
    text: '#000000',
  },
  
  typography: {
    fontFamily: "'Roboto', sans-serif",
    fontSize: '16px',
    fontWeight: {
      regular: 400,
      bold: 700,
    },
  },
};


export default theme