const express = require('express');
require('dotenv').config({ path: './key.env' });
const cors = require('cors');
const app = express();
const port = process.env.port || 3000;

app.use(cors());

const API_KEY = process.env.LASTFM_API_KEY;

const base_url = 'https://ws.audioscrobbler.com/2.0/';

app.get('/api/lastfm', async (req, res) => {
    try{
        const { method, input, limit } = req.query;
        if(!method || !input || !limit || !API_KEY){
            return res.status(400).json({error: 'Error: missing api key or invalid request'});
        }

        let input_field;
        if(method == 'artist.getTopAlbums'){
            input_field = 'artist';
        } else if(method == 'album.search'){
            input_field = 'album';
        }

        const final_url = `${base_url}?method=${method}&${input_field}=${input}&format=json&limit=${limit}&api_key=${API_KEY}`;

        const response = await fetch(final_url);
        const data = await response.json();
        res.json(data);
    }
    catch(error){
        res.status(500).json({ error: 'Error fetching data from last.fm' });
    }
});

app.get('/', (req, res) => {
    res.send('LastFM proxy server running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});