const express = require('express');
const path = require('path');
const fs = require('node:fs');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        if (err) return console.log(err);

        res.render("index", { files });
    })
});

app.post('/create', (req, res) => {
    if (req.body.title == "" || req.body.text == "") {
        return res.status(500).send("Cannot continue without empty name or details.")
    }
    fs.writeFile(`./files/${req.body.title.split(" ").join("-")}.txt`, req.body.text, (err) => {
        res.redirect('/');
    });
});

app.get('/file/:path', (req, res) => {
    fs.readFile(`./files/${req.params.path}`, "utf-8", (err, filedata) => {
        res.render('detail', { filename: req.params.path, filedata: filedata });
    })
})

app.get('/edit/:path', (req, res) => {
    fs.readFile(`./files/${req.params.path}`, "utf-8", (err, filedata) => {
        res.render('edit', { filename: req.params.path, filedata: filedata });
    })
})

app.post('/edit', (req, res) => {
    fs.rename(`./files/${req.body.previous.split(" ").join("-")}.txt`, `./files/${req.body.new.split(" ").join("-")}.txt`, (err) => {
        if (err) return;
        fs.writeFile(`./files/${req.body.new.split(" ").join("-")}.txt`, req.body.newDetails, (err) => {
            res.redirect('/')
        })
    })

})

app.listen(3000, () => {
    console.log("Listening at port 3000");
});
