import './App.css';
import {  CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import GameContainer from './components/GameContainer';

const theme = createTheme({
  palette:{
    mode:'dark',
    primary:{
      main:'#99ffbb55'
    },
    background:{
      default:'#000000',
      paper:'#222222'
    }
  },
  typography:{
    fontSize:14
  },
  components:{
    MuiTooltip:{
      defaultProps:{
        arrow:true,
        enterDelay:0
      },
      styleOverrides:{
        
        
        tooltip:{
          fontSize:'1em',
          background: '#222'
        },
        arrow:{
          color:'#222'
        }
      }
    }
  }
})

const App = () => {
  return   <ThemeProvider theme={theme}>
    <CssBaseline />
    <GameContainer /> 
    </ThemeProvider>
  
}

export default App;
