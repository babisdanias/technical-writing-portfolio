import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

export default function Home() {
  return (
<Layout
  title="Babis Danias — Technical Writer"
  description="Technical writer specializing in API documentation and developer guides."
  noFooter
>
      <main className={styles.hero}>
        <div className={styles.container}>

          <img
            src="/img/img.jpg"
            alt="Babis Danias"
            className={styles.photo}
          />

          <h1 className={styles.name}>Babis Danias</h1>
          <p className={styles.statement2}>
            I've spent years translating poetry and editing philosophy, 
            the kind of work where one wrong word changes everything. 
            I document APIs the same way: exact meaning, no guessing, nothing wasted.
          </p>

          <div className={styles.buttonRow}>
            <Link className={styles.buttonPrimary} to="/docs/intro">
              Portfolio
            </Link>
            <Link className={styles.buttonSecondary} to="/about">
              About me
            </Link>
          </div>

        </div>
      </main>
    </Layout>
  );
}