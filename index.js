const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

const genAI = new GoogleGenerativeAI('AIzaSyB0MXy73hMJQIjP1Cce2OtTUCXBoyNIlsQ');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins for now, you can restrict this to specific origins
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow the methods you need
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));


app.post('/generate', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    console.log('Generated text:', text);

    res.json({ response: text });
  } catch (error) {
    console.error('Error generating content:', error.stack); 
    res.status(500).json({ error: 'Failed to generate content' });
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
