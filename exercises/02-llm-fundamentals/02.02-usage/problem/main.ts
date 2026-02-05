import { streamText } from 'ai';

const output = streamText({
  model: 'google/gemini-2.0-flash',
  prompt: `Which country makes the best pizza? Answer in a single paragraph.`,
});

for await (const chunk of output.textStream) {
  process.stdout.write(chunk);
}

console.log(); // Empty log to separate the output from the usage

const usage = await output.totalUsage;
console.log('----- USAGE ----- ', usage);
