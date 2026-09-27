import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

const prices = ['$1,111.11', '$888.88', '$24,300.00', '$7,070.70'];

export const Specimen: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-8 text-tally-surface-fg">
      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold tracking-wide text-tally-muted-fg uppercase">
          Sans (font-sans)
        </h2>
        <p className="text-2xl font-semibold">Median price, last 30 days</p>
        <p className="text-base">
          Open recalls rose by three compared with last month. Contact your
          dealer to schedule a free repair.
        </p>
        <p className="text-sm text-tally-muted-fg">
          Small supporting text, 0123456789.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold tracking-wide text-tally-muted-fg uppercase">
          Weights
        </h2>
        <p className="text-lg font-normal">Normal 400</p>
        <p className="text-lg font-medium">Medium 500</p>
        <p className="text-lg font-semibold">Semibold 600</p>
        <p className="text-lg font-bold">Bold 700</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold tracking-wide text-tally-muted-fg uppercase">
          Numerals: default vs tabular-nums
        </h2>
        <div className="flex gap-12">
          <ul className="flex flex-col items-end text-lg">
            {prices.map((price) => (
              <li key={price}>{price}</li>
            ))}
          </ul>
          <ul className="flex flex-col items-end text-lg tabular-nums">
            {prices.map((price) => (
              <li key={price}>{price}</li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-tally-muted-fg">
          Use <code className="font-mono">tabular-nums</code> for numeric
          columns so digits line up.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold tracking-wide text-tally-muted-fg uppercase">
          Mono (font-mono)
        </h2>
        <p className="font-mono text-base">1HGCM82633A004352</p>
        <p className="text-sm text-tally-muted-fg">
          Use mono for identifiers such as VINs, IDs, and codes.
        </p>
      </section>
    </div>
  ),
};
