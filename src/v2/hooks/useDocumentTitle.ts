import { useLayoutEffect, useState } from 'react';

const DEFAULT_TITLE = 'Parko User | Personal Managment System by Parko Staff';

const useDocumentTitle = (title?: string) => {
  const [documentTitle, setDoucmentTitle] = useState(title);

  useLayoutEffect(() => {
    if (documentTitle) {
      document.title = `Parko User | ${documentTitle}`;
    } else {
      document.title = DEFAULT_TITLE;
    }
  }, [documentTitle]);

  return setDoucmentTitle;
};

export default useDocumentTitle;
