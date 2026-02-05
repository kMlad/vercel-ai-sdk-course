import { streamText } from 'ai';

const stream = streamText({
  model: 'google/gemini-2.0-flash',
  prompt:
    'Give me the first paragraph of a story about an imaginary planet.',
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
