import { generateText } from 'ai';

const prompt = 'What is the capital of France?';

const result = await generateText({
  model:'google/gemini-2.0-flash',
  prompt,
});

console.log(result.text);
