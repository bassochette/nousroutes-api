export const getFifteenMinutesAgo = () => {
  const fifteenMinutesAgo = new Date();
  fifteenMinutesAgo.setHours(
    fifteenMinutesAgo.getHours(),
    fifteenMinutesAgo.getMinutes() - 15,
  );

  return fifteenMinutesAgo;
};
