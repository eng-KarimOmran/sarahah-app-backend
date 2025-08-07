const waitingTime = (targetTimestamp) => {
  const now = Date.now();
  const targetTime = new Date(targetTimestamp).getTime();
  let minutesLeft, secondsLeft;
  if (targetTime > now) {
    const diffInMs = targetTime - now;
    minutesLeft = Math.floor(diffInMs / (1000 * 60));
    secondsLeft = Math.floor((diffInMs % (1000 * 60)) / 1000);
  } else {
    minutesLeft = 0;
    secondsLeft = 0;
  }
  const message = `${
    minutesLeft > 0 ? `${minutesLeft} minutes and ` : ""
  }${secondsLeft} seconds`;
  return { minutesLeft, secondsLeft, message };
};

export default waitingTime;
