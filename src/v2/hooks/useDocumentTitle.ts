import { useEffect, useState } from 'react';

const DEFAULT_TITLE = 'Parko User — Personal Managment System by Parko Staff';

const useDocumentTitle = (title: string) => {
  const [documentTitle, setDoucmentTitle] = useState(title);

  useEffect(() => {
    if (documentTitle) {
      document.title = `Parko user - ${documentTitle}`;
    } else {
      document.title = DEFAULT_TITLE;
    }
  }, [documentTitle]);

  return setDoucmentTitle;
};

export default useDocumentTitle;
