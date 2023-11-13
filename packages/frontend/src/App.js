import { useCallback, useEffect, useState } from 'react'
import { CssBaseline, Container, Button, Box, FormControlLabel, Checkbox, useTheme } from '@mui/material'
import Board, { Chip } from './components/Board';




const App = () => {


  const [state, setState] = useState();
  const [auto, setAuto] = useState(false)




  const _create = useCallback(() => {
    console.log('get/create game.')
    fetch(
      '/api/create',
      { method: 'POST' }
    ).then(response => response.json()).then(data => setState(data))
  }
    , [])

  const _delete = useCallback(() => {
    console.log('delete game.')
    fetch(

      '/api/delete',
      { method: 'POST' })
      .then(response => response.json()).then(data => setState(data))
  }
    , [])

  const _next = useCallback((type, value) => {
    console.log('post action:', { type, value })
    fetch(
      '/api/action',
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ type, value })
      }
    ).then(response => response.json()).then(data => setState(data))
  }, [])

  useEffect(() => {
    let timeout

    if (!state) {
      _create()
    } else {
      console.log('state:', state)
      if (auto && state.action && state.action?.type !== 'UNKNOWN_ACTION') {
        timeout = setTimeout(() => {

          //const value = state.action.options[0]; // First
          const value = state.action.options?.slice(-1)[0] // Last
          //const value = state.action.options?[Math.floor(Math.random() * state.action.options?.length)] // Random


          _next(state.action.type, value)
        }, 10)
      }
    }
    return () => clearTimeout(timeout)

  }, [state, auto])



  return (<>
    <CssBaseline />
    <Container sx={{ display: 'flex', gap: 1, flexDirection: 'column', mt: 5 }}>
      {/* <Box>
      <Button variant='contained' disabled={!!state} onClick={start}>start</Button>
      </Box> */}
      <Box>
        <Board 
          state={state?.board} 
          moves={state?.action?.type == 'MOVE' ? state.action.options : null}
          maxChipCount={state?.chipCount}
          />
      </Box>
      <Box>

        Current Player: {typeof state?.player == 'number' ?
          <Chip player={state.player} count={state.player} sx={{ position: 'relative', width: '2em', display: 'inline-flex' }} />
          : 'none'}
      </Box>
      <Box>
        Roll: {Array.isArray(state?.dice) ? `${state.dice.join(' + ')} = ${state.dice.reduce((p, c) => p + c, 0)}` : 'none'}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <FormControlLabel control={<Checkbox checked={auto} onClick={() => setAuto(!auto)} />} label="auto" />
        {
          state?.action?.options?.length > 0 ?
            state.action.options.map((value, index) => <Button key={`action-${index}`} variant="contained" onClick={() => _next(state.action.type, value)}>{state.action.type} {JSON.stringify(value)}</Button>) :
            <Button variant='contained' disabled={!state?.action || state.action.type === 'UNKNOWN_ACTION'} onClick={() => _next(state?.action?.type)}>{state?.action?.type}</Button>
        }

        <Button variant='contained' onClick={_delete}>{'RESTART'}</Button>
      </Box>
    </Container>
  </>
  );
}

export default App;
