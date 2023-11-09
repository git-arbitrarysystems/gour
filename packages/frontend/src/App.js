import { useCallback, useEffect, useState } from 'react'
import { CssBaseline, Container, Button, Box, styled } from '@mui/material'
import Board from './components/Board';



const App = () => {


  const [state, setState] = useState();




  const _create = useCallback(() => fetch(
    '/api/create',
    { method: 'POST' }
  ).then(response => response.json()).then(data => setState(data))
    , [])

  const _delete = useCallback(() => fetch(
    '/api/delete',
    { method: 'POST' })
    .then(response => response.json()).then(data => setState(data))
    , [])

  const _next = useCallback(
    (action, value) => {
      console.log('Execute:',{ action, value })
      fetch(
        '/api/action',
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ action, value })
        }
      ).then(response => response.json()).then(data => setState(data))
    }, [])

  useEffect(() => console.log(state), [state])

  return (<>
    <CssBaseline />
    <Container sx={{ display: 'flex', gap: 1, flexDirection: 'column', my: 1 }}>
      {/* <Box>
      <Button variant='contained' disabled={!!state} onClick={start}>start</Button>
      </Box> */}
      <Box>
        <Board state={state?.game?.board} />
      </Box>
      <Box>
        Current Player: { typeof state?.game?.player ==  'number' ? state.game.player  : 'none'}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant='contained' onClick={_create}>{'CREATE'}</Button>
        <Button variant='contained' disabled={!state?.game?.next?.action} onClick={() => {
          _next(
            state?.game?.next?.action,
            state?.game?.next?.options[0]
          )
        }}>{state?.game?.next?.action}</Button>
        <Button variant='contained' onClick={_delete}>{'DELETE'}</Button>
      </Box>
    </Container>
  </>
  );
}

export default App;
