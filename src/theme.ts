import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5', // indigo-600
    },
    secondary: {
      main: '#8b5cf6', // violet-500
    },
    background: {
      default: 'transparent',
      paper: 'rgba(255, 255, 255, 0.7)',
    },
    text: {
        primary: '#1e293b', // brand-gray-dark
        secondary: '#64748b', // brand-gray-DEFAULT
    }
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 12,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
     MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 'bold',
            }
        }
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 8,
                }
            }
        }
    },
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 8,
            }
        }
    }
  },
});

export default theme;
