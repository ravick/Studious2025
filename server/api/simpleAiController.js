 const OpenAI= require("openai");
 const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'OpenAI-Project': process.env.OPENAI_PROJECT_ID
  }
});

exports.ask = async (request) => {
  var input = request.body.question || request.body.input;
  console.log("Input received:", input);
  try {
    const chatCompletion = await client.chat.completions.create({
      model: 'gpt-4o-mini', // or gpt-3.5-turbo, gpt-4o
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: "Answer should be embedded in html tags. " + input }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const response = chatCompletion.choices[0].message.content;
    console.log('Response from OpenAI:', response);
    return {answer: response, usage: chatCompletion.usage};
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return {error: error};
  }
};

// const response = await getOpenAIResponse("Write a one-sentence bedtime story about a unicorn.");

// console.log(response.choices[0].message.content);
//exports.getOpenAIResponse = getOpenAIResponse;