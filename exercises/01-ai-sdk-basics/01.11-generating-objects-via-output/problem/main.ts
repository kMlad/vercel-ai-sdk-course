import { generateText, Output, streamText } from 'ai';
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

const factsResult = await generateText({
  model: 'google/gemini-2.0-flash',
  prompt: `Give me some facts about this planet: \n ${finalText}`,
  output: Output.object({
    schema: z.object({
      facts: z
        .array(z.string())
        .describe(
          'The facts about the imaginary planet. Describe as if you are a scientist',
        ),
    }),
  }),
});

// TODO: Log the output of the result
console.log(factsResult.output);
