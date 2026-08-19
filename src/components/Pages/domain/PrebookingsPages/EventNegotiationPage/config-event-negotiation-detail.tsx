import Flag from 'react-world-flags';
import { ProfilePictureListConstants } from '~/components/shared/atoms/gui/ProfilePictureList/ProfilePictureList';
import { RatingStarsView } from '~/components/shared/atoms/gui/rating-stars-view/RatingStarsView';
import { ComponentTypes, PageSection } from '~/components/shared/organisms/gui/builders/component-types.def';
// import { CitySelectionLevel } from '~/components/shared/organisms/gui/dynamicForms/components/CitySelector';
import { PlaceModel, PlaceRatingTemplate } from '~/models/domain/place/place.model';
import { EventNegotiationModel } from '~/models/domain/prebooking/event-negotiation.model';

export const TRANSLATION_BASE_EVENT_NEGOTIATION_DETAIL_PAGE =
  'app.pages.domain.PrebookingPages.EventNegotiationPages.EventNegociationDetailsPage';

export const EVENT_NEGOTIATION_DETAIL_SUB_PAGE_CONFIG: PageSection[] = [
  // ─────────────────────────────────────────────
  // SECTION 1: PARTES
  // ─────────────────────────────────────────────
  {
    name: 'general',
    title: 'NEG',
    sections: [
      {
        name: 'description',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'description',
                  emptyTitle: true,
                  formMetaData: {
                    inputType: 'textarea',
                  },
                },
              ],
            },
          },
        ],
      },
      {
        name: 'schedule',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'event_date',
                  icon: 'BsCalendar',
                  formMetaData: {
                    inputType: 'date',
                  },
                },
                {
                  name: 'load_in_time',
                  value: (negotiation: EventNegotiationModel) => {
                    return negotiation.load_in_time.format('hh:mm a');
                  },
                  icon: 'TbTruckLoading',
                  formMetaData: { inputType: 'time' },
                },
                {
                  name: 'soundcheck_time',
                  value: (negotiation: EventNegotiationModel) => {
                    return negotiation.soundcheck_time.format('hh:mm a');
                  },
                  icon: 'ri RiSoundModuleFill',
                  formMetaData: { inputType: 'time' },
                },
                {
                  name: 'doors_open_time',
                  value: (negotiation: EventNegotiationModel) => {
                    return negotiation.doors_open_time.format('hh:mm a');
                  },
                  icon: 'FaDoorOpen',
                  formMetaData: { inputType: 'time' },
                },
                {
                  name: 'show_start_time',
                  value: (negotiation: EventNegotiationModel) => {
                    return negotiation.show_start_time.format('hh:mm a');
                  },
                  icon: 'lu LuMicVocal',
                  formMetaData: { inputType: 'time' },
                },
                {
                  name: 'show_end_time',
                  value: (negotiation: EventNegotiationModel) => {
                    return negotiation.show_end_time.format('hh:mm a');
                  },
                  icon: 'GiTempleDoor',
                  formMetaData: { inputType: 'time' },
                },
                {
                  name: 'load_out_time',
                  value: (negotiation: EventNegotiationModel) => {
                    return negotiation.load_out_time.format('hh:mm a');
                  },
                  icon: 'fa6 FaPersonWalkingLuggage',
                  formMetaData: { inputType: 'time' },
                },
                // Derived / read-only — shown but not editable
                {
                  name: 'regulatory_closing_time',
                  value: (negotiation: EventNegotiationModel) => {
                    return negotiation.regulatory_closing_time.format('hh:mm a');
                  },
                  icon: 'tb TbContract',
                  formMetaData: { hidden: true }, // venue-fixed, not editable in form
                },
                // {
                //   name: 'estimated_teardown_minutes',
                //   icon: 'tb TbContract',
                //   formMetaData: { hidden: true },
                // },
                // {
                //   name: 'max_show_end_time', // derived: closing - teardown
                //   icon: 'tb TbContract',
                //   formMetaData: { hidden: true },
                // },
              ],
            },
            formMetaData: {
              fieldName: 'schedule',
            },
          },
          // {
          //   componentName: ComponentTypes.HTML_CONTENT,
          //   // componentName: ComponentTypes.PROFILE_APPROVALS_VIEW,
          //   data: {
          //     content: '<p>--- approvals: schedule ---</p>',
          //   },
          //   // data: { section: 'schedule' },
          //   // clickHandlerName: 'onApprovalChange',
          // },
        ],
      },
    ],
  },
  {
    name: 'parties',
    title: 'NEG',
    sections: [
      {
        name: 'participants',
        components: [
          {
            componentName: ComponentTypes.PROFILE_PICTURE_LIST,
            // componentName: ComponentTypes.PROFILE_PARTICIPANTS_LIST,
            data: { data_source: 'participants' },
            clickHandlerName: 'onClickParticipant',
          },
        ],
      },

      {
        name: 'setlist_tracks',
        components: [
          {
            componentName: ComponentTypes.TOP_TRACKS_LIST_VIEW,
            data: { tracks: 'setlist' },
            clickHandlerName: 'onClickSetlistTrack',
            formMetaData: {
              inputType: 'textarea', // V1: free-form; V2: structured track list
              fieldName: 'setlist',
            },
          },
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'setlist_total_time',
                  icon: 'md MdOutlineTimer',
                  hidden: (negotiation: EventNegotiationModel) => negotiation.contract_type === 'hospitality',
                  formMetaData: { inputType: 'textarea', fieldName: 'hospitality_description' },
                },
              ],
            },
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // SECTION 4: RIDER TÉCNICO
  // Sub-sections: sound | backline | lights | visuals
  // ─────────────────────────────────────────────
  {
    name: 'technical_rider',
    sections: [
      // SOUND
      {
        name: 'sound_rider',
        components: [
          {
            componentName: ComponentTypes.GENERIC_TECH_RIDER_REQUIREMENTS_VIEW,
            data: {
              artist_requirements: 'rider.sound.artist',
              venue_provisions: 'rider.sound.venue',
              technical_field: 'Sonido',
            },
            formMetaData: {
              inputType: 'textarea',
              fieldName: 'rider.sound',
            },
          },
        ],
      },
      // BACKLINE
      {
        name: 'backline_rider',
        components: [
          {
            componentName: ComponentTypes.GENERIC_TECH_RIDER_REQUIREMENTS_VIEW,
            data: {
              artist_requirements: 'rider.sound.artist',
              venue_provisions: 'rider.sound.venue',
              technical_field: 'Backline',
            },
            formMetaData: {
              inputType: 'textarea',
              fieldName: 'rider.sound',
            },
          },
        ],
      },
      // LIGHTS
      {
        name: 'light_rider',
        components: [
          {
            componentName: ComponentTypes.GENERIC_TECH_RIDER_REQUIREMENTS_VIEW,
            data: {
              artist_requirements: 'rider.sound.artist',
              venue_provisions: 'rider.sound.venue',
              technical_field: 'Luces',
            },
            formMetaData: {
              inputType: 'textarea',
              fieldName: 'rider.sound',
            },
          },
        ],
      },
      // VISUALS
      {
        name: 'visuals_rider',
        components: [
          {
            componentName: ComponentTypes.GENERIC_TECH_RIDER_REQUIREMENTS_VIEW,
            data: {
              artist_requirements: 'rider.sound.artist',
              venue_provisions: 'rider.sound.venue',
              technical_field: 'Visuales',
            },
            formMetaData: {
              inputType: 'textarea',
              fieldName: 'rider.sound',
            },
          },
        ],
      },
      // {
      //   name: 'approvals',
      //   components: [
      //     {
      //       componentName: ComponentTypes.HTML_CONTENT,
      //       // componentName: ComponentTypes.PROFILE_APPROVALS_VIEW,
      //       data: {
      //         content: '<p>--- approvals: technical_rider ---</p>',
      //       },
      //       // data: { section: 'technical_rider' },
      //       // clickHandlerName: 'onApprovalChange',
      //     },
      //   ],
      // },
    ],
  },

  // ─────────────────────────────────────────────
  // SECTION 5: COMPENSACIÓN
  // ─────────────────────────────────────────────
  {
    name: 'compensation',
    sections: [
      {
        name: 'economic',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'contract_type',
                  icon: 'tb TbContract',
                  formMetaData: {
                    inputType: 'select',
                    fieldName: 'contract_type',
                    componentParams: {
                      options: ['venue_hires_artist', 'co_production', 'artist_rents_venue', 'hospitality'],
                    },
                  },
                },
                // venue_hires_artist
                {
                  name: 'fee',
                  icon: 'tb TbContract',
                  hidden: (negotiation: EventNegotiationModel) => negotiation.contract_type !== 'venue_hires_artist',
                  formMetaData: { inputType: 'text', fieldName: 'fee' },
                },
                // co_production
                {
                  name: 'door_split_artist_pct',
                  icon: 'tb TbContract',
                  hidden: (negotiation: EventNegotiationModel) => negotiation.contract_type !== 'co_production',
                  formMetaData: { inputType: 'text', fieldName: 'door_split_artist_pct' },
                },
                {
                  name: 'door_split_venue_pct',
                  icon: 'tb TbContract',
                  hidden: (negotiation: EventNegotiationModel) => negotiation.contract_type !== 'co_production',
                  formMetaData: { inputType: 'text', fieldName: 'door_split_venue_pct' },
                },
                {
                  name: 'bar_split_artist_pct',
                  icon: 'tb TbContract',
                  hidden: (negotiation: EventNegotiationModel) => negotiation.contract_type !== 'co_production',
                  formMetaData: { inputType: 'text', fieldName: 'bar_split_artist_pct' },
                },
                // artist_rents_venue
                {
                  name: 'venue_rental_fee',
                  icon: 'tb TbContract',
                  hidden: (negotiation: EventNegotiationModel) => negotiation.contract_type !== 'artist_rents_venue',
                  formMetaData: { inputType: 'text', fieldName: 'venue_rental_fee' },
                },
                // hospitality
                {
                  name: 'hospitality_description_compensation',
                  icon: 'tb TbContract',
                  hidden: (negotiation: EventNegotiationModel) => negotiation.contract_type !== 'hospitality',
                  formMetaData: { inputType: 'textarea', fieldName: 'hospitality_description' },
                },
                // common
                // {
                //   name: 'advance_payment',
                //   icon: 'tb TbContract',
                //   hidden: (negotiation: EventNegotiationModel) => negotiation.contract_type === 'hospitality',
                //   formMetaData: { inputType: 'text', fieldName: 'advance_payment' },
                // },
                {
                  name: 'advance_payment_due_date',
                  icon: 'BsCalendar',
                  hidden: (negotiation: EventNegotiationModel) =>
                    !negotiation.advance_payment || negotiation.contract_type === 'hospitality',
                  formMetaData: { inputType: 'date', fieldName: 'advance_payment_due_date' },
                },
              ],
            },
          },
        ],
      },
      {
        name: 'hospitality',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                // hospitality
                {
                  name: 'hospitality_description',
                  icon: 'tb TbContract',
                  emptyTitle: true,
                  hidden: (negotiation: EventNegotiationModel) => negotiation.contract_type === 'hospitality',
                  formMetaData: { inputType: 'textarea', fieldName: 'hospitality_description' },
                },
              ],
            },
          },
        ],
      },
      // {
      //   name: 'approvals',
      //   components: [
      //     {
      //       componentName: ComponentTypes.HTML_CONTENT,
      //       // componentName: ComponentTypes.PROFILE_APPROVALS_VIEW,
      //       data: {
      //         content: '<p>--- approvals: compensation ---</p>',
      //       },
      //       // data: { section: 'compensation' },
      //       // clickHandlerName: 'onApprovalChange',
      //     },
      //   ],
      // },
    ],
  },

  // ─────────────────────────────────────────────
  // SECTION 6: RESPONSABILIDADES
  // ─────────────────────────────────────────────
  {
    name: 'responsibilities',
    sections: [
      {
        name: 'promotion_responsible',
        components: [
          {
            componentName: ComponentTypes.PROFILE_PICTURE_LIST,
            // componentName: ComponentTypes.PROFILE_PARTICIPANTS_LIST,
            data: {
              data_source: 'participants',
              are_participants_selectable: true,
              isSelectable: true,
              display_direction: ProfilePictureListConstants.DISPLAY_VERTICAL,
            },
            clickHandlerName: 'onClickParticipant',
          },
        ],
      },
      {
        name: 'ticketing_responsible',
        components: [
          {
            componentName: ComponentTypes.PROFILE_PICTURE_LIST,
            // componentName: ComponentTypes.PROFILE_PARTICIPANTS_LIST,
            data: {
              data_source: 'participants',
              are_participants_selectable: true,
              isSelectable: true,
              display_direction: ProfilePictureListConstants.DISPLAY_VERTICAL,
            },
            clickHandlerName: 'onClickParticipant',
          },
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                // hospitality
                {
                  name: 'ticket_link',
                  icon: 'io5 IoTicketOutline',
                  emptyTitle: true,
                  hidden: (negotiation: EventNegotiationModel) => false,
                  formMetaData: { inputType: 'textarea', fieldName: 'hospitality_description' },
                },
              ],
            },
          },
        ],
      },
      {
        name: 'security_responsible',
        components: [
          {
            componentName: ComponentTypes.PROFILE_PICTURE_LIST,
            // componentName: ComponentTypes.PROFILE_PARTICIPANTS_LIST,
            data: {
              data_source: 'participants',
              are_participants_selectable: true,
              isSelectable: true,
              display_direction: ProfilePictureListConstants.DISPLAY_VERTICAL,
            },
            clickHandlerName: 'onClickParticipant',
          },
        ],
      },
      {
        name: 'additional_staff_responsible',
        components: [
          {
            componentName: ComponentTypes.PROFILE_PICTURE_LIST,
            // componentName: ComponentTypes.PROFILE_PARTICIPANTS_LIST,
            data: {
              data_source: 'participants',
              are_participants_selectable: true,
              isSelectable: true,
              display_direction: ProfilePictureListConstants.DISPLAY_VERTICAL,
            },
            clickHandlerName: 'onClickParticipant',
          },
        ],
      },
      //   componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
      //   data: {
      //     attributes: [
      //       {
      //         name: 'publicity_responsible',
      //         icon: 'md MdGroups',
      //         formMetaData: {
      //           inputType: 'chipPicker',
      //           fieldName: 'publicity_responsible',
      //           componentParams: {
      //             options: ['venue', 'artist', 'shared'],
      //             singleSelect: true,
      //           },
      //         },
      //       },
      //       {
      //         name: 'ticketing_responsible',
      //         icon: 'tb TbContract',
      //         formMetaData: {
      //           inputType: 'chipPicker',
      //           fieldName: 'ticketing_responsible',
      //           componentParams: {
      //             options: ['venue', 'artist'],
      //             singleSelect: true,
      //           },
      //         },
      //       },
      //       {
      //         name: 'security_responsible',
      //         icon: 'md MdGroups',
      //         formMetaData: {
      //           inputType: 'chipPicker',
      //           fieldName: 'security_responsible',
      //           componentParams: {
      //             options: ['venue', 'promoter', 'artist'],
      //             singleSelect: true,
      //           },
      //         },
      //       },
      //       {
      //         name: 'bar_staff_responsible',
      //         icon: 'md MdGroups',
      //         formMetaData: {
      //           inputType: 'chipPicker',
      //           fieldName: 'bar_staff_responsible',
      //           componentParams: {
      //             options: ['venue', 'promoter'],
      //             singleSelect: true,
      //           },
      //         },
      //       },
      //     ],
      //   },
      // },
      //   ],
      // },
      // {
      //   name: 'approvals',
      //   components: [
      //     {
      //       componentName: ComponentTypes.HTML_CONTENT,
      //       // componentName: ComponentTypes.PROFILE_APPROVALS_VIEW,
      //       data: {
      //         content: '<p>--- approvals: responsibilities ---</p>',
      //       },
      //       // data: { section: 'responsibilities' },
      //       // clickHandlerName: 'onApprovalChange',
      //     },
      //   ],
      // },
    ],
  },

  // ─────────────────────────────────────────────
  // SECTION 7: OTROS
  // ─────────────────────────────────────────────
  {
    name: 'other',
    sections: [
      {
        name: 'other_notes',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'notes',
                  emptyTitle: true,
                  formMetaData: { inputType: 'textarea', value: 'asdasd', fieldName: 'notes' },
                },
              ],
            },
          },
        ],
      },
      // {
      //   name: 'approvals',
      //   components: [
      //     {
      //       componentName: ComponentTypes.HTML_CONTENT,
      //       // componentName: ComponentTypes.PROFILE_APPROVALS_VIEW,
      //       data: {
      //         content: '<p>--- approvals: other ---</p>',
      //       },
      //       // data: { section: 'other' },
      //       // clickHandlerName: 'onApprovalChange',
      //     },
      //   ],
      // },
    ],
  },
];
