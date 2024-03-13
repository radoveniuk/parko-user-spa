import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

const useCopyToClipboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  function copyToClipboard (text: string): Promise<boolean> {
    return navigator.clipboard.writeText(text)
      .then(() => {
        enqueueSnackbar(t('copied'), { variant: 'info' });
        return true;
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
        return false;
      });
  }
  return copyToClipboard;
};

export default useCopyToClipboard;
