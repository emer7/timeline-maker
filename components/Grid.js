import { BLACK, PALETTE } from '../consts';
import {
  parseFullNumericalEraFormat,
  eachCenturyOfInterval,
  calculateDuration,
} from '../utils';

export const Grid = ({
  scrollLeft,
  yearInPixels,
  vw,
  minStartDate,
  maxEndDate,
}) => {
  const parsedMinStartDate = parseFullNumericalEraFormat(minStartDate);
  const parsedMaxEndDate = parseFullNumericalEraFormat(maxEndDate);

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
