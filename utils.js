function secondsToTime(seconds) {
  // Ensure input is a number
  if (typeof seconds !== 'number' || isNaN(seconds)) {
    throw new Error('Input must be a number');
  }

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format the output string with two-digit seconds
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
