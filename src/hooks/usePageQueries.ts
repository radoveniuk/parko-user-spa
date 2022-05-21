import { useLocation } from 'react-router-dom';

const getPageQueries = (url: string) => {
  const params: { [paramKey: string]: string } = {};
  url.substring(1).split('&').forEach((pair) => {
    const [pairKey, pairValue] = pair.split('=').map(str => decodeURIComponent(str.replace(/\+/g, ' ')));
    if (pairKey) {
      params[pairKey] = pairValue;
    }
  });
  return params;
};

const usePageQueries = () => {
  const location = useLocation();
  return getPageQueries(location.search);
};

export default usePageQueries;
