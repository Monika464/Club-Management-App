import adminuid from "./consts/adminuid";

export const useIsAdmin = (userid: string | undefined) => {
  if (
    // "Y19J2pywqfd2YKN3zVVGlzYEWR82" === userid ||
    // "QQnLoM9alXNiJDcO5NYioj5YrE32" === userid ||
    // "xrDY59QKlAQsDJsVW0Eoxx0NUjW2" === userid
    adminuid === userid
  ) {
    return true;
  } else {
    return false;
  }
};
//QQnLoM9alXNiJDcO5NYioj5YrE32
