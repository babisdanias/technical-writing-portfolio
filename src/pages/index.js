import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

export default function Home() {
  return (
<Layout
  title="Babis Danias — Technical Writer & Software Tester"
  description="Technical writer and software tester: documentation, QA and software product support. EU citizen, relocating to Helsinki."
  noFooter
  wrapperClassName="home-wrapper"
>
      <main className={styles.hero}>
        <div className={styles.container}>

          <img
            src="/img/img.jpg"
            alt="Babis Danias"
            className={styles.photo}
            style={{ marginTop: '3rem' }}
          />

          <h1 className={styles.name}>Babis Danias</h1>
          <p
            className={styles.tagline}
            style={{ color: '#f2f2f2', fontWeight: 600, marginTop: '-1rem' }}
          >
            Technical&nbsp;Writer &amp; Software&nbsp;Tester
          </p>
          <p
            className={styles.intro}
            style={{
              marginTop: '-0.5rem',
              maxWidth: '35em',
              marginLeft: 'auto',
              marginRight: 'auto',
              textWrap: 'pretty',
            }}
          >
            I write documentation, test software and help people when something breaks.
            Every writing job I've done comes down to one thing: make what's written match what's true.
            I've done it in merged Fedora and Canonical docs, in Linux kernel patches, and in my books,
            from translating Cavafy to a philosophy anthology built&nbsp;on&nbsp;400+&nbsp;sources.
          </p>
          <p className={styles.meta} style={{ marginTop: '1rem' }}>Thessaloniki,&nbsp;Greece · Relocating&nbsp;to&nbsp;Helsinki · EU&nbsp;citizen</p>

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