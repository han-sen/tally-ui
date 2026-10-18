import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import { readFile } from 'node:fs/promises';
import { z } from 'zod';

type ManifestEntry = {
  displayName: string;
  description: string;
};

// Reads a file from this repo's dist/, wherever the server was started from.
const readDist = (file: string) =>
  readFile(new URL(`../dist/${file}`, import.meta.url), 'utf8');

const readManifest = async (): Promise<ManifestEntry[]> =>
  JSON.parse(await readDist('manifest.json'));

const TOKENS_GUIDE = `Tally UI design tokens. Tokens.css is the source of truth, these notes cover what it doesn't say.

Color suffixes:
- No suffix (tally-success): a soft background fill.
- -fg (tally-success-fg): text and icons on that fill, or on a surface when the text itself carries the status.
- -hover: the fill's hover state.
- -chart (tally-success-chart): the more vibrant color for chart marks such as lines, bars and data slices.
- chart-1 to chart-4: series colors, used in that order.

Rule: style with these tokens only. Avoid using raw palette classes (bg-blue-500) or hex colors.

How to use them depends on how the app loads Tally's styles:
- The app runs Tailwind v4 and imports tokens.css: every token class works (bg-tally-surface, text-tally-muted-fg, rounded-tally-card).
- The app imports the prebuilt styles.css: it only contains the classes Tally's own components use. Style your own elements with the CSS variables instead, e.g. color: var(--tally-danger-fg).`;

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

server.registerTool(
  'get_tokens',
  {
    description:
      'Get the Tally UI design tokens (colors, radii, shadows) and the Tailwind classes they map to. Call this before styling anything around Tally components.',
  },
  async () => {
    try {
      const tokens = await readDist('tokens.css');

      return {
        content: [{ type: 'text', text: `${TOKENS_GUIDE}\n\n${tokens}` }],
      };
    } catch (error) {
      console.error('Error reading tokens:', error);
      return {
        content: [
          {
            type: 'text',
            text: 'Tokens not found. Run npm run build:lib in tally-ui.',
          },
        ],
        isError: true,
      };
    }
  },
);

await server.connect(new StdioServerTransport());
