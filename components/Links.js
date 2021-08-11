import React from 'react';

import {
  calculateDuration,
  calculateStartDuration,
  parseMultipleFormat,
  parseNumericalFullDate,
} from '../utils';

export const Links = ({
  yearInPixels,
  events,
  minStartDate,
  positions,
  links,
}) =>
  links.map(link => {
    const { origin, destination } = link;

    const { startDate: originStartDate, endDate: originEndDate } =
      events[origin];
    const { startDate: destinationStartDate } = events[destination];

    const parsedMinStartDate = parseNumericalFullDate(minStartDate);

    const parsedOriginStartDate = parseMultipleFormat(originStartDate);
    const parsedOriginEndDate = parseMultipleFormat(originEndDate);

    const parsedDestinationStartDate =
      parseMultipleFormat(destinationStartDate);

    const originHeight = calculateDuration(
      parsedOriginStartDate,
      parsedOriginEndDate,
      yearInPixels
    );
    const originTop = calculateStartDuration(
      parsedMinStartDate,
      parsedOriginStartDate,
      yearInPixels
    );
    const originLeft = positions[origin];

    const destinationTop = calculateStartDuration(
      parsedMinStartDate,
      parsedDestinationStartDate,
      yearInPixels
    );
    const destinationLeft = positions[destination];

    const isOriginLaterThanDestination =
      originTop + originHeight > destinationTop;

    const horizontalDistance = destinationLeft - originLeft;
    const verticalDistance = destinationTop - (originTop + originHeight);

    const d = isOriginLaterThanDestination
      ? `M ${originLeft} ${originTop + originHeight} 
          v 20 
          h ${horizontalDistance / 2} 
          v ${verticalDistance - 40} 
          h ${horizontalDistance / 2} 
          v 20`
      : `M ${originLeft} ${originTop + originHeight} 
          v ${verticalDistance / 2} 
          h ${horizontalDistance} 
          v ${verticalDistance / 2}`;

    return (
      <path
        className="cursor-pointer"
        d={d}
        stroke="#f00"
        strokeWidth="2"
        fill="none"
      />
    );
  });
