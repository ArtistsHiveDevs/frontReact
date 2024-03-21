import {
  ProfileComponentTypes,
  ProfileDetailsSubpage,
} from '~/components/shared/organisms/ProfileTabsPage/profile-details.def';
import { ArtistRiderModel } from '~/models/domain/rider/rider.model';

export const RIDER_DETAILS_SUB_PAGE_CONFIG: ProfileDetailsSubpage[] = [
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
                  name: 'description',
                  emptyTitle: true,
                },
                {
                  name: 'since',
                  icon: 'BsCalendar',
                },
                {
                  name: 'home_city',
                  icon: 'AiFillHome',
                },
                {
                  name: 'categories',
                  icon: 'BsInfoCircleFill',
                },
                {
                  name: 'spoken_languages',
                  icon: 'TbWorld',
                },
                {
                  name: 'stage_languages',
                  icon: 'BsTranslate',
                },
                {
                  name: 'arts_languages',
                  icon: 'BsFillMegaphoneFill',
                },
              ],
            },
          },
        ],
      },
      {
        name: 'contact',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'email',
                },
                {
                  name: 'production_manager_phone',
                },
                {
                  name: 'tour_manager_phone',
                },
              ],
            },
          },
        ],
      },
      {
        name: 'general_technical_features',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'frecuency_response',
                },
                {
                  name: 'sound_pressure',
                },
                {
                  name: 'foh_distance',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: 'people',
    sections: [
      {
        name: 'staff',
        components: [
          {
            componentName: ProfileComponentTypes.CREW_LIST_VIEW,
            data: {
              crewList: 'staff.crewList',
            },
          },
        ],
      },
      {
        name: 'external_transportation',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'albums',
                  icon: 'BsInfoCircleFill',
                },
              ],
            },
          },
        ],
      },
      {
        name: 'internal_transportation',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'albums',
                  icon: 'BsInfoCircleFill',
                },
              ],
            },
          },
        ],
      },
      {
        name: 'rooming_list',
        components: [
          {
            componentName: ProfileComponentTypes.TABLE,
            data: {},
          },
        ],
      },
    ],
  },
  {
    name: 'technical_requirements',
    sections: [
      {
        name: 'staging',
        components: [
          {
            componentName: ProfileComponentTypes.TITLE,
            data: {
              title: 'Stage plot',
              size: '3',
            },
          },
          {
            componentName: ProfileComponentTypes.TITLE,
            data: {
              title: 'Top view',
              size: '5',
            },
          },
          {
            componentName: ProfileComponentTypes.IMAGE_GALLERY,
            data: {
              image: 'stage_plot.topview',
            },
          },
          {
            componentName: ProfileComponentTypes.TITLE,
            data: {
              title: 'Front view',
              size: '5',
            },
          },
          {
            componentName: ProfileComponentTypes.IMAGE_GALLERY,
            data: {
              image: 'stage_plot.frontview',
            },
          },
          {
            componentName: ProfileComponentTypes.TITLE,
            data: {
              title: 'Stage & structures',
              size: '3',
            },
          },
          {
            componentName: ProfileComponentTypes.TITLE,
            data: {
              title: 'Tarima',
              size: '5',
            },
          },
          {
            componentName: ProfileComponentTypes.TITLE,
            data: {
              title: 'Sobre Tarima',
              size: '5',
            },
          },
          {
            componentName: ProfileComponentTypes.TITLE,
            data: {
              title: 'Structures',
              size: '3',
            },
          },
          {
            componentName: ProfileComponentTypes.TITLE,
            data: {
              title: 'Roofs',
              size: '5',
            },
          },
          {
            componentName: ProfileComponentTypes.TITLE,
            data: {
              title: 'House Mix',
              size: '5',
            },
          },
        ],
      },
      {
        name: 'audio_requirements',
        components: [
          {
            componentName: ProfileComponentTypes.TITLE,
            data: {
              title: 'Input List',
              size: '3',
            },
          },
          {
            componentName: ProfileComponentTypes.TABLE,
            data: {
              tableConfig: (rider: ArtistRiderModel) => {
                let config = undefined;
                if (rider?.requirements?.audio?.inputList?.length) {
                  config = {
                    columns: Object.keys(rider.requirements.audio.inputList[0]),
                    rows: rider.requirements.audio.inputList,
                  };
                }
                return config;
              },
            },
          },
          {
            componentName: ProfileComponentTypes.TITLE,
            data: {
              title: 'Mezclas y monitoreo',
              size: '3',
            },
          },
          {
            componentName: ProfileComponentTypes.TABLE,
            data: {
              tableConfig: (rider: ArtistRiderModel) => {
                let config = undefined;
                if (rider?.requirements?.audio?.mixesList?.length) {
                  config = {
                    columns: Object.keys(rider.requirements.audio.mixesList[0]),
                    rows: rider.requirements.audio.mixesList,
                  };
                }
                return config;
              },
            },
          },
        ],
      },
      {
        name: 'video_requirements',
        components: [
          {
            componentName: ProfileComponentTypes.TITLE,
            data: {
              title: 'Reproducción de video',
              size: '3',
            },
          },
          {
            componentName: ProfileComponentTypes.TITLE,
            data: {
              title: 'Pantallas',
              size: '3',
            },
          },
          {
            componentName: ProfileComponentTypes.TITLE,
            data: {
              title: 'Pantalla izquierda',
              size: '5',
            },
          },
          {
            componentName: ProfileComponentTypes.TITLE,
            data: {
              title: 'Pantalla Central',
              size: '5',
            },
          },
          {
            componentName: ProfileComponentTypes.TITLE,
            data: {
              title: 'Pantalla Derecha',
              size: '5',
            },
          },
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'Facebook',
                  emptyTitle: true,
                  icon: 'BsFacebook',
                },
              ],
            },
          },
        ],
      },
      {
        name: 'lights_requirements',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'Facebook',
                  emptyTitle: true,
                  icon: 'BsFacebook',
                },
              ],
            },
          },
        ],
      },
      {
        name: 'stage_design',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'Facebook',
                  emptyTitle: true,
                  icon: 'BsFacebook',
                },
              ],
            },
          },
        ],
      },
      {
        name: 'special_effects',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'Facebook',
                  emptyTitle: true,
                  icon: 'BsFacebook',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: 'backline',
    sections: [
      {
        name: 'external_required_backline',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'Facebook',
                  emptyTitle: true,
                  icon: 'BsFacebook',
                },
              ],
            },
          },
        ],
      },
      {
        name: 'owned_backline',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'Facebook',
                  emptyTitle: true,
                  icon: 'BsFacebook',
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: 'sound_test',
    sections: [
      {
        name: 'timing',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'Facebook',
                  emptyTitle: true,
                  icon: 'BsFacebook',
                },
              ],
            },
          },
        ],
      },
    ],
  },
];
