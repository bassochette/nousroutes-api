export const getFifteenMinutesAgo = () => {
  const fifteenMinutesAgo = new Date();
  fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

  return fifteenMinutesAgo;
};
