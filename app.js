import express from 'express'
import { JSONFilePreset } from 'lowdb/node';
import db from './bd.js';
import format from 'date-fns/format'
import { corsMiddleware } from './middlewares/cors.js'
import cors from 'cors'

const PORT = process.env.PORT ?? 5555;

const app = express();
app.use(express.json())
app.disable('x-powered-by');
app.use(cors());

app.get('/', (_, res) => {
  res.send('Bienvenido a la api de Audire')
})

app.get('/api/info', (_, res) => {
  res.json({
    "name": "audire",
    "version": "0.1.0",
  })
})

app.post('/api/song/request', (req, res) => {

  // Update db.json
  db.update(({ requestedSongs }) => requestedSongs.push({
    "user": req.body.user,
    "song": req.body.song,
    "artist": req.body.artist,
    "date": format(Date.now(), 'yyyy-MM-dd HH:mm:ss')
  }
  )).then(() => {
    console.log('db.json updated')
    res.status(200).send(req.body)
  }).catch((err) => {
    console.error('Error updating db.json:', err)
    res.status(500).send('Error updating db.json')
  })

})

app.get('/api/song/getall', async (_, res) => {
  const { data } = await JSONFilePreset('db.json', { requestedSongs: [] });
  console.log(data)
  res.send(
    data.requestedSongs
  )
})


app.use((_, res) => {
  res.status(404).send(
    "<h1>Ups!! - Error 404</h1> <br> <h2 > La página que buscas no existe</h2 >"
  )
})

// PLevantar el servidor
app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`)
})