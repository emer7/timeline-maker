import React from 'react';
import { PALETTE } from '../consts';

import {
  calculateDuration,
  parseMultipleFormat,
  parseNumericalFullDate,
} from '../utils';

export const Links = ({
  yearInPixels,
  events,
  minStartDate,
  positions,
  links,
  handleDeleteLink,
}) =>
  links.map((link, linkIndex) => {
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
    const originTop = calculateDuration(
      parsedMinStartDate,
      parsedOriginStartDate,
      yearInPixels
    );
    const originLeft = positions[origin];

    const destinationTop = calculateDuration(
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
        key={d}
        className="cursor-pointer"
        d={d}
        stroke={PALETTE[6]}
        strokeWidth="2"
        fill="none"
        marker-end="url(#arrowhead)"
        onClick={() => handleDeleteLink(linkIndex)}
      />
    );
  });
