import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Head from 'next/head';
import { default as FrontPage } from '@/components/FrontPage';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <>
      <Head>
        <title>Sudoku helper</title>
        <meta name='description' content='Help you to solve sudoku' />
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
