const { Configuration, OpenAIApi } = require("openai");

const express = require("express");

const app = express();

// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });
// app.use(express.static(process.env.STATIC_DIR));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow the specified methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow the specified headers
    next();
  });

const bodyParser = require('body-parser');
app.use(bodyParser.json());
// app.use(cors());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  app.post("/generate-coverletter", async (request, response) => {
    try {
        const promptPayload = {
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'user', content: `Create a cover letter for me using the details of Company name, Company Description , Job Description and my resume
              . Here are the details.I want response to be very specific, hitting right at the bulls eye. 
              Dont use general sentences. Response need to reflect that my resume is right fit for the Job description. 
              . Most Importantly remember one thing,  I would like the response to maintain a specific format 
              with line breaks indicated as \n and paragraph breaks indicated as \n\n.Company name is ${request.body.companyName}, 
              company description is ${request.body.companyDescription}
                , Job description is ${request.body.jobDescription}. And finally here is my resume ${request.body.resume}. 
                Generate a unique Cover Letter tailored to my given specific details`},
            ],
          };
          const result = await openai.createChatCompletion(promptPayload);
    
        // Send Ai Cover letter response to client
        response.send({
          airesponse: result.data.choices[0].message.content,
        });
        
      } catch (e) {
        return response.status(400).send({
          error: {
            message: e.message,
          },
        });
      }
  });
  
  app.listen(8282, () =>
  console.log(`Node server listening at http://localhost:8282`)
);