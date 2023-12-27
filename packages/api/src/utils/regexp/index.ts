export const __phoneNumberExp__ =
  /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
export const __passwordExp__ =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/;

export const isValidPhoneNumber = (phoneNumber: string): boolean =>
  __phoneNumberExp__.test(phoneNumber);
export const isValidPassword = (password: string): boolean =>
  __passwordExp__.test(password);
