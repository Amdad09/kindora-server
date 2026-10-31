import cors from 'cors';
import express from 'express';
import eventsRoute from './modules/events/events.routes.js';
const app = express();

app.use(express.json());
app.use(cors());

app.use('/events', eventsRoute);

app.get('/', (req, res) => {
    res.send('Sever going on root path');
});

export default app;
