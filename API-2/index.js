const express = require("express")
const app = express()
const port = process.env.PORT || 5001;

const products_routes = require("./routes/products");


app.get("/", (req, res) => {

    res.send(" Hi, I am live...")
});


app.use("/Products", products_routes)


const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`${port} We are connected...`)
        })
    } catch (error) {
        console.log("Error");
    }
}

start();