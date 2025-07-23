import { Inter, Lusitana } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] }) as ReturnType<typeof Inter>;
export const lusitana = Lusitana({ weight: ['400','700'], subsets: ['latin'] }) as ReturnType<typeof Lusitana>;