import { Html, Head, Main, NextScript } from 'next/document';
import { colorModeScript } from '../utils/color-mode';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <script dangerouslySetInnerHTML={{ __html: colorModeScript }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
