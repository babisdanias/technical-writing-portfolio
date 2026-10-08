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
  wrapperClassName="home-wrapper"
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
         I'm a technical writer with a background in IT, based in Thessaloniki and looking for work in Helsinki.
        Since 2018 I've translated Greek poetry into English and compiled an anthology of philosophy,
        work that comes down to weighing one word against another. 
        I write API documentation the same way, and I run every call myself before I describe it.
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