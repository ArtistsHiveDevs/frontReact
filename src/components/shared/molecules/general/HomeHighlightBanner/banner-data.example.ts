import { BannerItem } from './HomeHighlightBanner';

/**
 * Datos de ejemplo para el banner
 * Puedes reemplazar esto con datos dinámicos desde tu backend
 */
export const exampleBanners: BannerItem[] = [
  {
    img_src: '/img/bannerCH.jpeg', // Reemplaza con tu imagen real
    inner_url: '/circuito-hive-2026', // Navegación interna
    alt: 'Descubre nuevos artistas',
  },
  {
    img_src: '/img/bannerCH2.png', // Reemplaza con tu imagen real
    external_url: 'https://example.com/evento', // Link externo
    alt: 'Evento especial',
  },
  {
    img_src: '/img/bannerCH1.png', // Reemplaza con tu imagen real
    inner_url: '/artists', // Navegación interna
    alt: 'Descubre nuevos artistas',
  },
];
