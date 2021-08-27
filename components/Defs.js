import { PALETTE } from '../consts';

export const Defs = () => (
  <defs>
    <marker
      id="arrowhead"
      markerWidth="4"
      markerHeight="4"
      refX="0"
      refY="2"
      orient="auto"
    >
      <polygon points="0 0, 4 2, 0 4" fill={PALETTE[6]} />
    </marker>
  </defs>
);
