const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post("/getCalories", async (req, res) => {
  try {
    const { food } = req.body;
    const prompt = `Give me the approximate calories for: ${food}`;
    
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }]
    });

    const calories = completion.data.choices[0].message.content;
    res.json({ calories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching calories" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
