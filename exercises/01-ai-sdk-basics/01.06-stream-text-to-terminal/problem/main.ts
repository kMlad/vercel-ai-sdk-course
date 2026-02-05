import { streamText } from 'ai';

const prompt =
  'Give me the first paragraph of a story about an imaginary planet.';

const stream = streamText({
  model: 'google/gemini-2.0-flash-lite',
  prompt,
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
