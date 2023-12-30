export const __phoneNumberExp__ = /^([+]|[00]{2})([0-9]|[ -])*/;
export const __passwordExp__ =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/;

export const isValidPhoneNumber = (phoneNumber: string): boolean =>
  __phoneNumberExp__.test(phoneNumber);
export const isValidPassword = (password: string): boolean =>
  __passwordExp__.test(password);
