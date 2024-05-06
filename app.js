const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;
var abc;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit-form', (req, res) => {
    abc = req.body.amount;
    console.log('abc:', abc);
    // Write abc to a file
    fs.writeFile('abc.txt', abc, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            res.status(500).send('Error writing file');
        } else {
            console.log('File written successfully');
            // Execute command after file write
            const result = shell.exec('truffle exec scripts/eth-bsc-transfer.js --network sepolia_testnet');
            if (result.code !== 0) {
                console.error('Error executing command:', result.stderr);
                res.status(500).send('Error executing command');
                return;
            }
            console.log('Command executed successfully');
            res.send('Form submitted');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
