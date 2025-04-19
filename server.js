const express = require('express');
const path = require('path');
const fs = require('fs');
const { marked } = require('marked');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = 8080;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Serve static files
app.use(express.static('public'));

// Middleware to parse markdown files
const parseMarkdown = (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    return marked(content);
};

// Helper function to get post metadata
const getPostMetadata = (filePath) => {
    const stats = fs.statSync(filePath);
    return {
        created: stats.birthtime,
        modified: stats.mtime
    };
};

// Routes
app.get('/', (req, res) => {
    console.log('Home page requested');
    res.render('index', { title: 'Home' });
});

app.get('/blog', (req, res) => {
    console.log('Blog listing requested');
    const postsDir = path.join(__dirname, 'posts');
    const posts = fs.readdirSync(postsDir)
        .filter(file => file.endsWith('.md'))
        .map(file => {
            const filePath = path.join(postsDir, file);
            const metadata = getPostMetadata(filePath);
            const content = parseMarkdown(filePath);
            return {
                title: file.replace('.md', ''),
                content: content,
                slug: file.replace('.md', ''),
                created: metadata.created,
                modified: metadata.modified
            };
        })
        .sort((a, b) => b.created - a.created);
    
    res.render('blog', { title: 'Blog', posts });
});

app.get('/blog/:slug', (req, res) => {
    console.log(`Blog post requested: ${req.params.slug}`);
    const postPath = path.join(__dirname, 'posts', `${req.params.slug}.md`);
    try {
        const metadata = getPostMetadata(postPath);
        const content = parseMarkdown(postPath);
        res.render('post', { 
            title: req.params.slug,
            content: content,
            created: metadata.created,
            modified: metadata.modified
        });
    } catch (err) {
        console.error(`Error loading post: ${err.message}`);
        res.status(404).render('404', { title: 'Post Not Found' });
    }
});

// Listen on all available interfaces
const server = app.listen(PORT, '0.0.0.0', () => {
    const addresses = ['localhost', '127.0.0.1'];
    console.log('Server is running on:');
    addresses.forEach(addr => {
        console.log(`  http://${addr}:${PORT}`);
    });
    console.log('Press Ctrl+C to stop the server');
}); 