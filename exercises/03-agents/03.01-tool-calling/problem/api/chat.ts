import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from 'ai';
import z from 'zod';
import {
  createDirectory,
  deletePath,
  exists,
  listDirectory,
  readFile,
  searchFiles,
  writeFile,
} from './file-system-functionality.ts';

export const POST = async (req: Request): Promise<Response> => {
  const body: { messages: UIMessage[] } = await req.json();
  const { messages } = body;

  const result = streamText({
    model: 'google/gemini-2.5-flash',
    messages: await convertToModelMessages(messages),
    system: `
      You are a helpful assistant that can use a sandboxed file system to create, edit and delete files.

      You have access to the following tools:
      - writeFile
      - readFile
      - deletePath
      - listDirectory
      - createDirectory
      - exists
      - searchFiles

      Use these tools to record notes, create todo lists, and edit documents for the user.

      Use markdown files to store information.
    `,
    // TODO: add the tools to the streamText call,
    tools: {
      writeFile: tool({
        description: 'Write content to a file',
        inputSchema: z.object({
          filePath: z
            .string()
            .describe(
              "The path of the file that's to be created",
            ),
          content: z
            .string()
            .describe('The content of the file to be created'),
        }),
        execute: writeFile,
      }),
      readFile: tool({
        description: 'Read content from a file',
        inputSchema: z.object({
          filePath: z
            .string()
            .describe('The path of the file to read'),
        }),
        execute: readFile,
      }),
      deletePath: tool({
        description: 'Delete a file or a directory',
        inputSchema: z.object({
          pathToDelete: z
            .string()
            .describe(
              'The path of the file/directory to delete',
            ),
        }),
        execute: deletePath,
      }),
      listDirectory: tool({
        description: 'List the contents of a directory',
        inputSchema: z.object({
          dirPath: z
            .string()
            .describe(
              'The path of the directory to list the contents from',
            ),
        }),
        execute: listDirectory,
      }),
      createDirectory: tool({
        description: 'Create a new directory',
        inputSchema: z.object({
          dirPath: z
            .string()
            .describe('The path of the directory to create'),
        }),
        execute: createDirectory,
      }),
      exists: tool({
        description: 'Check if a file or directory exists',
        inputSchema: z.object({
          pathToCheck: z
            .string()
            .describe('The path to check for existence'),
        }),
        execute: exists,
      }),
      searchFiles: tool({
        description:
          'Search for files by pattern (supports * wildcard)',
        inputSchema: z.object({
          pattern: z
            .string()
            .describe(
              'The search pattern (supports * wildcard)',
            ),
          searchDir: z
            .string()
            .optional()
            .describe(
              'The directory to search in, defaults to root',
            ),
        }),
        execute: searchFiles,
      }),
    },
    // TODO: add a custom stop condition to the streamText call
    // to force the agent to stop after 10 steps have been taken
    stopWhen: stepCountIs(10),
  });

  return result.toUIMessageStreamResponse();
};
