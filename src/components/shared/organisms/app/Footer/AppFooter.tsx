import { FooterColumnTemplate } from '~/components/shared/Footer/columns-menu';
import FooterColumns from '~/components/shared/Footer/columns-menu/ColumnsMenu';
import FooterCopywrite from '~/components/shared/Footer/footer-copywrite/FooterCopywrite';
import FooterSocialNetworks from '~/components/shared/Footer/footer-social-networks/FooterSocialNetworks';
import { PATHS } from '~/constants';
import './AppFooter.scss';

export const AppFooter = () => {
  // Footer
  const footerColumns: FooterColumnTemplate[] = [
    {
      columnName: 'what_we_do',
      options: [
        {
          name: 'cultural_agenda',
          link: PATHS.CULTURAL_AGENDA,
        },
        {
          name: 'for_artists',
          link: `${PATHS.INDUSTRY_OFFER}${PATHS.ARTISTS}`,
        },
        {
          name: 'for_promoters',
          link: `${PATHS.INDUSTRY_OFFER}${PATHS.PROMOTERS}`,
        },
        { name: 'for_places', link: `${PATHS.INDUSTRY_OFFER}${PATHS.PLACES}` },
        {
          name: 'for_academies',
          link: `${PATHS.INDUSTRY_OFFER}${PATHS.ACADEMIES}`,
        },

        { name: 'for_festivals' },
      ],
    },
    {
      columnName: 'about_us',
      options: [
        { name: 'history' },
        { name: 'press' },
        { name: 'career' },
        { name: 'download' },
        { name: 'data_policy', link: PATHS.PRIVACY_POLICY },
      ],
    },
    // {
    //   columnTitle: "Proyectos",
    //   options: [{ text: "Conoce tu país" }],
    // },
    {
      columnName: 'help',
      options: [{ name: 'help_center' }, { name: 'contact_us', link: PATHS.CONTACT_US }, { name: 'report' }],
    },
  ];
  return (
    <>
      <FooterColumns footerColumns={footerColumns} />
      <FooterSocialNetworks />
      <FooterCopywrite />
    </>
  );
};
