import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Button from 'v2/uikit/Button';

import { NotFoundPageWrapper } from './styles';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <NotFoundPageWrapper>
      <h1>{t('notFoundPage')}</h1>
      <section className="error-container">
        <span className="four"><span className="screen-reader-text">4</span></span>
        <span className="zero"><span className="screen-reader-text">0</span></span>
        <span className="four"><span className="screen-reader-text">4</span></span>
      </section>
      <div className="link-container">
        <Link to="/"><Button variant="contained">{t('navbar.home')}</Button></Link>
      </div>
    </NotFoundPageWrapper>
  );
};

export default NotFoundPage;
