export const getCookieValue = (name: string) => (
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '' // || true
);

export const setCookie = (name: string, value: string, expire: number) => {
  let expires = '';
  if (expire) {
    const date = new Date();
    date.setTime(date.getTime() + expire);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
};

export const eraseCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=-99999999;`;
};
