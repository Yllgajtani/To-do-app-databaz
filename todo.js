const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/authDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(error));

// Define Mongoose schema and model
const todoSchema = new mongoose.Schema({
    Name: String,
    kategoria: String,
    Proriteti: String,
    koha: String,
    completed: Boolean
});

const Todo = mongoose.model("Todo", todoSchema);

// Get method
app.get('/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Post method
app.post('/todos', async (req, res) => {
    try {
        const newTodo = new Todo({
            Name: req.body.Name,
            kategoria: req.body.kategoria,
            Proriteti: req.body.Proriteti,
            koha: req.body.koha,
            completed: false
        });
        const savedTodo = await newTodo.save();
        res.json(savedTodo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update method
app.put('/todos/:id', async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete method
app.delete('/todos/:id', async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
