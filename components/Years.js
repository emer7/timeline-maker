import { eachCenturyOfInterval, calculateDuration } from '../utils';

export const Years = ({
  scrollLeft,
  yearInPixels,
  minStartDate,
  maxEndDate,
}) => {
  const centuries = eachCenturyOfInterval({
    start: minStartDate,
    end: maxEndDate,
  });

  return (
    <g>
      {centuries.map(century => {
        const centuryDuration = calculateDuration(
          minStartDate,
          century,
          yearInPixels
        );

        return (
          <text
            key={century.getFullYear()}
            className="select-none"
            x={scrollLeft}
            y={centuryDuration - 8}
            textAnchor="start"
            alignmentBaseline="baseline"
          >
            {century.getFullYear()}
          </text>
        );
      })}
    </g>
  );
};
