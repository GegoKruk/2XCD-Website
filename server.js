const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/order', async (req, res) => {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwioum1OThE-Tmyjhgu2P2q18EcLHBl_pyPxuyhG4eLvz9CaZl3PsPJy14op2SFaChD/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'data=' + encodeURIComponent(JSON.stringify(req.body))
        });
        const text = await response.text();
        try {
            const result = JSON.parse(text);
            res.json(result);
        } catch (e) {
            res.status(200).send(text);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Proxy server running on http://localhost:3000'));