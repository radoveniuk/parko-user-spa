import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Button from 'components/shared/Button';

import { NotFoundPageWrapper } from './styles';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <NotFoundPageWrapper>
      <section className="page_404">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 ">
              <div className="col-sm-10 col-sm-offset-1 text-center">
                <div className="four_zero_four_bg">
                  <h1 className="text-center">404</h1>
                </div>
                <div className="contant_box_404">
                  <h3 className="h2">
                    {t('notFoundPage')}
                  </h3>
                  <Link to="/"><Button>{t('navbar.home')}</Button></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </NotFoundPageWrapper>
  );
};

export default NotFoundPage;
