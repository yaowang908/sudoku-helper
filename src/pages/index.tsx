import Head from 'next/head';
import { default as FrontPage } from '@/components/FrontPage';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <>
      <Head>
        <title>Sudoku Helper — solve smarter</title>
        <meta
          name='description'
          content='A modern Sudoku helper that tracks candidate numbers for every cell so you can focus on solving.'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <Layout>
          <FrontPage />
        </Layout>
      </main>
    </>
  );
}
