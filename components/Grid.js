import { PALETTE } from '../consts';
import { eachCenturyOfInterval, calculateDuration } from '../utils';

export const Grid = ({
  scrollLeft,
  yearInPixels,
  vw,
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
          <line
            key={century.getFullYear()}
            className="select-none"
            x1={scrollLeft}
            x2={scrollLeft + vw}
            y1={centuryDuration}
            y2={centuryDuration}
            stroke={PALETTE[2]}
          />
        );
      })}
    </g>
  );
};
