import {
  ProfileComponentTypes,
  ProfileDetailsSubpage,
} from '~/components/shared/organisms/ProfileTabsPage/profile-details.def';
// import { CitySelectionLevel } from '~/components/shared/organisms/gui/dynamicForms/components/CitySelector';

export const SEARCH_FILTERS_CONFIG: ProfileDetailsSubpage[] = [
  {
    name: 'general',
    sections: [
      {
        name: 'general',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'genres',
                  formMetaData: { inputType: 'chipPicker' },
                },
                {
                  name: 'cityWithCountry',
                  formMetaData: {
                    inputType: 'citySelector',
                    componentParams: {
                      // minimumSelectionLevel: CitySelectionLevel.BOROUGH,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      {
        name: 'dates',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'date',
                  formMetaData: { inputType: 'date' },
                },
              ],
            },
          },
        ],
      },
      {
        name: 'languages',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'spoken_languages',
                  formMetaData: { inputType: 'chipPicker' },
                },
                {
                  name: 'stage_languages',
                  formMetaData: { inputType: 'chipPicker' },
                },
                {
                  name: 'arts_languages',
                  formMetaData: { inputType: 'chipPicker' },
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: 'artists',
    sections: [
      {
        name: 'general',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'is_available_at',
                  formMetaData: {
                    inputType: 'dateInterval',
                    componentParams: {
                      disablePast: true,
                    },
                  },
                },
                {
                  name: 'has_albums',
                  formMetaData: { inputType: 'checkbox' },
                },
                {
                  name: 'music_awards',
                  formMetaData: { inputType: 'chipPicker' },
                },
              ],
            },
          },
        ],
      },
      {
        name: 'rating',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'overall',
                  formMetaData: { inputType: 'interval' },
                },
                {
                  name: 'talent',
                  formMetaData: { inputType: 'interval' },
                },
                {
                  name: 'performance',
                  formMetaData: { inputType: 'interval' },
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: 'places',
    sections: [
      {
        name: 'stage',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'stage_width',
                  formMetaData: { inputType: 'interval', config: { min: 0, max: 100 } },
                },
                {
                  name: 'stage_length',
                  formMetaData: { inputType: 'interval', config: { min: 0, max: 100 } },
                },
                {
                  name: 'stage_height',
                  formMetaData: { inputType: 'interval', config: { min: 0, max: 100 } },
                },
              ],
            },
          },
        ],
      },
      {
        name: 'backline',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'mics',
                  formMetaData: { inputType: 'interval', config: { min: 0, max: 100 } },
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: 'social_networks',
    sections: [
      {
        name: 'presence',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'has_social_networks',
                  formMetaData: { inputType: 'chipPicker' },
                },
              ],
            },
          },
        ],
      },
    ],
  },
];
