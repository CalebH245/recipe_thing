const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());

// Allow all domains or restrict to your Netlify domain:
app.use(cors({ origin: "*" }));

const DB_FILE = path.join(__dirname, "recipes.json");

// Create file if missing
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// GET: return all recipes
app.get("/recipes", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    res.json(data);
});

// POST: add recipe (shared)
app.post("/add", (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_FILE));

    const newRecipe = {
        id: Date.now(),
        title: req.body.title,
        ingredients: req.body.ingredients,
        steps: req.body.steps
    };

    data.push(newRecipe);

    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

    res.json({ success: true, recipe: newRecipe });
});

// REQUIRED FOR RENDER: port must be dynamic
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Backend running on port " + PORT);
});