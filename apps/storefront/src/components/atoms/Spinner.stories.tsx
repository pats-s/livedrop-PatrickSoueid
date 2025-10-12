import type { Meta, StoryObj } from '@storybook/react';
import Spinner from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div>
        <p className="text-sm mb-2">Small</p>
        <Spinner size="sm" />
      </div>
      <div>
        <p className="text-sm mb-2">Medium</p>
        <Spinner size="md" />
      </div>
      <div>
        <p className="text-sm mb-2">Large</p>
        <Spinner size="lg" />
      </div>
    </div>
  ),
};