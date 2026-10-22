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
      <p className={styles.tagline}> Technical&nbsp;Writer · Software&nbsp;Tester · IT&nbsp;Support</p>
<p className={styles.intro}>
  Since 2018 I've translated Greek poetry into English and compiled an anthology of philosophy,
  work that comes down to weighing one word against another. I bring the same care to API documentation and testing,
  and I run every call myself before I write it up.
</p>
<p className={styles.meta}>Thessaloniki,&nbsp;Greece · Relocating&nbsp;to&nbsp;Helsinki · EU&nbsp;citizen</p>

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