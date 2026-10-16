import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import { readFile } from 'node:fs/promises';
import { z } from 'zod';

type ManifestEntry = {
  displayName: string;
  description: string;
  // add props, useWhen, … as tools start needing them
};

const readManifest = async (): Promise<ManifestEntry[]> =>
  JSON.parse(
    await readFile(new URL('../dist/manifest.json', import.meta.url), 'utf8'),
  );

const server = new McpServer({ name: 'tally-ui', version: '0.1.0' });

server.registerTool(
  'list_components',
  {
    description:
      'List available components for the Tally UI library. Call this first to find which component fits a UI need.',
  },
  async () => {
    try {
      const jsonData = await readManifest();

      const components = jsonData.map((component) => ({
        name: component.displayName,
        description: component.description
          .replace(/\s+/g, ' ')
          .split(/\.(?:\s|$)/)[0],
      }));

      return {
        content: [{ type: 'text', text: JSON.stringify(components, null, 2) }],
      };
    } catch (error) {
      console.error('Error reading or parsing manifest:', error);
      return {
        content: [
          {
            type: 'text',
            text: 'Manifest not found. Run npm run build:lib in tally-ui.',
          },
        ],
        isError: true,
      };
    }
  },
);

server.registerTool(
  'get_component',
  {
    description:
      'Get full docs for one Tally UI component: props, when to use it, and examples. Use a name from list_components.',
    inputSchema: z.object({ name: z.string() }),
  },
  async ({ name }) => {
    try {
      const jsonData = await readManifest();

      const component = jsonData.find(
        (component) => component.displayName === name,
      );

      if (component) {
        return {
          content: [{ type: 'text', text: JSON.stringify(component, null, 2) }],
        };
      }
      return {
        content: [
          {
            type: 'text',
            text: `Component named ${name} not found. Call list_components to see available components from tally-ui.`,
          },
        ],
        isError: true,
      };
    } catch (error) {
      console.error('Error reading or parsing component:', error);
      return {
        content: [
          {
            type: 'text',
            text: 'Fetching component failed. Run npm run build:lib in tally-ui.',
          },
        ],
        isError: true,
      };
    }
  },
);

await server.connect(new StdioServerTransport());
