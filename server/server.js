const path=require("path");
express = require("express"),
    app = express();

app.use(express.static(path.join(__dirname, './../public')));

//routes
app.get('/', (req, res) => {
    res.render('index');
});

const PORT = process.env.PORT || 9000;

server = app.listen(PORT, function () {
    console.log(`Chat App server started on port ${PORT}`);
});
