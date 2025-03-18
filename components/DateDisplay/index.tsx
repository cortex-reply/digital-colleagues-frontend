const DateDisplay = (date: Date) => {
  const now = Date.now();

  const SEC = 1000;
  const MIN = 60 * SEC;
  const HOUR = 60 * MIN;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;

  const diff = now - date.getTime();

  switch (true) {
    // case diff < SEC:
    //   return `now`
    case diff < MIN:
      return `now`;
    case diff < HOUR:
      const mins = Math.floor(diff / MIN);
      return `${mins} ${mins > 1 ? "minutes" : "minute"} ago.`;
    case diff < DAY:
      const hours = Math.floor(diff / HOUR);
      return `${hours} ${hours > 1 ? "hours" : "hour"} ago.`;
    case diff < WEEK:
      const weeks = Math.floor(diff / DAY);
      return `${weeks} ${weeks > 1 ? "weeks" : "week"} ago.`;
    default:
      return `${date.toLocaleDateString()}`;
  }
};

export default DateDisplay;
