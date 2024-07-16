const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

app.get('/blogs', (req, res) => {
    res.sendFile(__dirname + '/views/blogs.html');
});

app.get('/contact', (req, res) => {
    res.sendFile(__dirname + '/views/contact.html');
});

// Serve JSON data
app.get('/data/:page', (req, res) => {
    const page = req.params.page;
    fs.readFile(__dirname + `/data/${page}.json`, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data file.');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Fetch data from RDF store using SPARQL
app.get('/sparql/:query', async (req, res) => {
    const query = req.params.query;
    const endpoint = 'http://localhost:3030/semantic-blog-dataset/query';
    try {
        const response = await axios.get(endpoint, {
            params: {
                query: query,
                format: 'json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error executing SPARQL query.');
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
