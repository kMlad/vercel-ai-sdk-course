import { streamText } from 'ai';

const stream = streamText({
  model: 'google/gemini-2.0-flash',
  prompt: 'Give me a sonnet about a doberman called Jack.',
});

for await (const chunk of stream.toUIMessageStream()) {
  console.log(chunk);
}
