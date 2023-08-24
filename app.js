const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();
const OpenAI = require('openai');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use(cors());

app.get('/', async (req, res, next) => {
    res.send({ message: 'Awesome it works 🐻' });
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

app.post('/ask', async (req, res) => {
    const data = req.body.text;

    const instruction = `Generate a very short comment for this linkedin post`;

    const prompt = `${instruction}\n\n ${data}`;

    try {
        if (prompt == null) {
            throw new Error('Uh oh, no prompt was provided');
        }

        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
        });

        console.log(chatCompletion.choices[0].message);

        return res.status(200).json({
            success: true,
            message: chatCompletion.choices[0].message,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            error,
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
