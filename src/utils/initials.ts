export const getInitials = (name: string) => {
  let initials = "";
  const splitName = name.split(" ");
  const LENGTH = 2;
  for (let i = 0; i < LENGTH; i++) {
    if (typeof splitName[i] !== "undefined") {
      initials += splitName[i][0];
    }
  }
  return initials;
};
