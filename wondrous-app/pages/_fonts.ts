import { Lato } from '@next/font/google';
import localFont from '@next/font/local';

export const spaceGrotesk = Lato({ subsets: ['latin'], weight: ['700', '400', '300'] });

export const carmenSans = localFont({
  src: [
    {
      path: '../assets/fonts/CarmenSansSemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/CarmenSansBold.otf',
      weight: 'bold',
      style: 'normal',
    },
  ],
  fallback: ['Helvetica', 'ui-sans-serif'],
});

export const faktum = localFont({
  src: [
    {
      path: '../assets/fonts/FaktumRegular.otf',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../assets/fonts/FaktumBold.otf',
      weight: 'bold',
      style: 'normal',
    },
  ],
  fallback: ['Helvetica', 'ui-sans-serif'],
});
