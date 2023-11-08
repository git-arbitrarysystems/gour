import {useCallback, useEffect, useState} from 'react'
import {CssBaseline, Container,Button, Box} from '@mui/material'
import Board from './components/Board';



const  App = () => {


  const [state, setState] = useState();

  const start = useCallback( () => fetch('/api/init').then( response => response.json() ).then( data => setState(data) ),[] )
  const next = useCallback( () => fetch('/api/next').then( response => response.json() ).then( data => setState(data) ),[] )
  useEffect( () => {
    //start()
  }, [start])

  useEffect( () => {
    if( state ) console.log(state)
  }, [state])

  return (<>
    <CssBaseline />
    <Container sx={{display:'flex', gap:1, flexDirection:'column', my:1}}>
      <Box>
      <Button variant='contained' disabled={!!state} onClick={start}>start</Button>
      </Box>
      <Box>
        <Board state={state?.board} />
      </Box>
      <Box>
        Current Player: {state?.player || 'none'}
      </Box>
      <Box>
        <Button variant='contained' disabled={!state?.next} onClick={next}>{state?.next || 'NEXT'}</Button>
      </Box>
    </Container>      
    </>
  );
}

export default App;
