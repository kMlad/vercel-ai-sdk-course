import { Output, streamText } from 'ai';
import z from 'zod';

const stream = streamText({
  model: 'google/gemini-2.0-flash',
  prompt:
    'Give me the first paragraph of a story about an imaginary planet.',
});

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}

const finalText = await stream.text;

// TODO: Replace generateText with streamText, keeping the same
// Output.object with the facts schema from 01.10
// Then use partialOutputStream to iterate over streaming chunks
const factsResult = streamText({
  model: 'google/gemini-2.0-flash',
  prompt: `Give me some facts about the imaginary planet. Here's the story: ${finalText}`,
  output: Output.object({
    schema: z.object({
      facts: z
        .array(z.string())
        .describe(
          'The facts about the imaginary planet. Write as if you are a scientist.',
        ),
    }),
  }),
});

// TODO: Replace this with a for-await loop over factsResult.partialOutputStream
// Log each partial object as it arrives
for await (const chunk of factsResult.partialOutputStream) {
  console.log(chunk);
}
