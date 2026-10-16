import { withCustomConfig } from 'react-docgen-typescript';
import fs from 'node:fs';

const parser = withCustomConfig('./tsconfig.app.json', {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => !prop.parent?.fileName.includes('node_modules'),
});

// Splits a `- ` bulleted JSDoc tag into one string per item, joining
// wrapped lines back into a single sentence.
const toList = (text?: string): string[] =>
  text
    ? text
        .split(/^- /m)
        .map((item) => item.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
    : [];

// Pulls the names out of `{@link Card }` style references.
const toLinks = (text?: string): string[] =>
  text
    ? [...text.matchAll(/\{@link\s+([^}\s]+)\s*\}/g)].map((match) => match[1])
    : [];

// Pulls the code out of each ```tsx fenced block.
const toExamples = (text?: string): string[] =>
  text
    ? [...text.matchAll(/```\w*\n([\s\S]*?)```/g)].map((match) =>
        match[1].trim(),
      )
    : [];

const files = fs
  .readdirSync('src/components')
  .map((dir) => `src/components/${dir}/${dir}.tsx`)
  .filter((file) => fs.existsSync(file));

const docs = parser.parse(files);

const manifest = docs
  .filter((doc) => !doc.displayName.includes('.'))
  .map((doc) => ({
    displayName: doc.displayName,
    import: `import { ${doc.displayName} } from '@han-sen/tally-ui';`,
    description: doc.description,
    props: Object.values(doc.props).map(
      ({ name, description, required, type, defaultValue }) => ({
        name,
        description,
        required,
        type: type.name,
        defaultValue: defaultValue?.value ?? null,
      }),
    ),
    useWhen: toList(doc.tags?.useWhen),
    avoidWhen: toList(doc.tags?.avoidWhen),
    related: toLinks(doc.tags?.related),
    examples: toExamples(doc.tags?.example),
  }));

fs.writeFileSync('./dist/manifest.json', JSON.stringify(manifest, null, 2));
