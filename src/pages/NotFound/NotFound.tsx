import React from 'react';
import { Link } from 'react-router-dom';
import { MdHome, MdArrowBack } from 'react-icons/md';
import Card from '@/components/Atoms/Card';
import Button from '@/components/Atoms/Button';
import PageContainer from '@/components/Atoms/PageContainer';
import styles from './NotFound.module.sass';

const NotFound: React.FC = () => {
  return (
    <PageContainer>
      <div className={styles.notFound}>
        <Card
          className={styles.notFoundCard}
          title="404"
          description="Página no encontrada"
        >
          <div className={styles.content}>
            <div className={styles.icon}>
              <span>🔍</span>
            </div>

            <div className={styles.message}>
              <h2>¡Oops! Página no encontrada</h2>
              <p>
                La página que estás buscando no existe o ha sido movida. Puedes
                volver al inicio o usar los enlaces de navegación.
              </p>
            </div>

            <div className={styles.actions}>
              <Link to="/">
                <Button theme="primary">
                  <MdHome />
                  Ir al Inicio
                </Button>
              </Link>

              <Button theme="secondary" onClick={() => window.history.back()}>
                <MdArrowBack />
                Volver Atrás
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default NotFound;
