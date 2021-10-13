import {
  parseFullNumericalFormat,
  eachCenturyOfInterval,
  calculateDuration,
} from '../utils';

export const Years = ({
  scrollLeft,
  yearInPixels,
  minStartDate,
  maxEndDate,
}) => {
  const parsedMinStartDate = parseFullNumericalFormat(minStartDate);
  const parsedMaxEndDate = parseFullNumericalFormat(maxEndDate);

  const centuries = eachCenturyOfInterval({
    start: parsedMinStartDate,
    end: parsedMaxEndDate,
  });

  return (
    <g>
      {centuries.map(century => {
        const centuryDuration = calculateDuration(
          parsedMinStartDate,
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
