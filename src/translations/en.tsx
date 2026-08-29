export const EnMessages = {
  app: {
    name: 'App EN',
    loading: 'Loading',
    general: {
      not_found_page: {
        title: "Oops! We couldn't find what you're looking for",
      },
      component_error: {
        message: 'This component could not be loaded.',
      },
    },
    domain_global_dictionary: { errors: {} },
    global_dictionary: {
      artists_hive: {
        slogan: 'Create, Connect, Fly...',
      },
      art_types: {
        dance: 'Dance',
        music: 'Music',
        painting: 'Painting',
        poetry: 'Poetry',
        photography: 'Photography',
        standup_comedy: 'Stand-up Comedy',
        theatre: 'Theatre',
        video: 'Video',
      },
      actions: {
        add: 'Add',
        accounts: {
          create_account: 'Create account',
          forgot_password: 'Forgot Password',
          login: 'Login',
          password: 'Password',
          phone_number: 'Phone Number',
          phone_number_placeholder: '1234567890',
          remember_me: 'Remember me',
          signup: 'Sign up',
          username_or_email: 'Username or Email',
        },
        create: 'Create',
        edit: 'Edit',
        follow_us: 'Follow us',
        save: 'Save',
        cancel: 'Cancel',
        link_copied_to_clipboard: 'Link copied to clipboard',
        navigation: {
          back: 'Back',
          first: 'First',
          home: 'Home',
          last: 'Last',
          next: 'Next',
          previous: 'Previous',
          refresh: 'Refresh',
          submit: 'Submit',
          cancel: 'Cancel',
          close: 'Close',
          open: 'Open',
          save: 'Save',
        },
        report: 'Report',
        selection: {
          select_all: 'Select all',
          clear_selection: 'Clear selection',
        },
        share: 'Share',
        show_more: 'Show more',
        show_less: 'Show less',
        submit: 'Submit',
        subscription: {
          subscribe: 'Subscribe',
          unsubscribe: 'Unsubscribe',
        },
        upload: 'Upload',
        files_limit_exceded: 'Maximum number of allowed files exceeded',
      },
      entities: {
        academies: { plural: 'Academies', singular: 'Academy' },
        artists: {
          plural: 'Artists',
          singular: 'Artist',
          attributes: {
            project_format: {
              label: 'Project Format',
              values: {
                solo_artist: 'Solo Artist',
                duo: 'Duo',
                band: 'Band',
                dj: 'DJ',
                group: 'Group',
                collective: 'Collective',
                orchestra: 'Orchestra',
                choir: 'Choir',
                symphonic_choral: 'Symphonic Choir',
                other: 'Other',
              },
            },
          },
        },
        events: {
          plural: 'Events',
          singular: 'Event',
          attributes: {
            event_type: {
              label: 'Event Type',
              values: {
                concert: 'Concert',
                conversation: 'Conversation',
                festival: 'Festival',
                jam_session: 'Jam session',
                market: 'Market',
                other: 'Other',
                residency: 'Artist residency',
                showcase: 'Showcase',
                workshop: 'Workshop',
              },
            },
          },
        },
        open_calls: {
          plural: 'Open Calls',
          singular: 'Open Call',
          attributes: {
            support_provision: {
              label: 'Support Provision',
              values: {
                no: 'No',
                yes: 'Yes',
                partial: 'Partial',
                negotiable: 'Negotiable',
              },
            },
          },
        },
        places: {
          plural: 'Places',
          singular: 'Place',
          attributes: {
            place_types: {
              label: 'Place Types',
              values: {
                bar: 'Bar',
                club: 'Club',
                theater: 'Theater',
                concert_hall: 'Concert Hall',
                cultural_center: 'Cultural Center',
                restaurant: 'Restaurant',
                outdoor: 'Outdoor',
                other: 'Other',
              },
            },
            stage_types: {
              label: 'Stage Types',
              values: {
                indoor: 'Indoor',
                outdoor: 'Outdoor',
                amphitheater: 'Amphitheater',
                club: 'Club',
                theater: 'Theater',
                other: 'Other',
              },
            },
          },
        },
        promoters: { plural: 'Promoters', singular: 'Promoter' },
        prebooking_requests: { plural: 'Pre-Bookings', singular: 'Pre-Booking' },
        users: {
          plural: 'Users',
          singular: 'User',
          attributes: {
            agrees_to_a_blood_transfusion: {
              label: 'Do you accept blood transfusions?',
              values: {
                true: 'Accepts',
                false: 'Does not accept',
              },
            },
            dietary_restrictions: {
              label: 'Dietary restrictions',
              values: {
                none: 'None',
                vegetarian: 'Vegetarian',
                vegan: 'Vegan',
                celiac: 'Celiac',
              },
            },
            gender: {
              label: 'Gender',
              values: {
                male: 'Man',
                female: 'Woman',
                non_binary: 'Non binary',
                non_specified: 'Non specified',
              },
            },
          },
        },
      },
      forms: {
        errors: {
          submit_error: "We couldn't save your changes. Please try again.",
          submit_error_duplicate_key: 'That username is already taken. Please choose another one.',
          submit_error_validation: 'Some required fields are missing or invalid. Please review the form.',
          validation_error: 'Some required fields are missing or invalid. Please review the fields marked in red.',
        },
      },
      errors: {
        // Data error
        NOT_AVAILABLE: 'Not available',
        NO_RESULTS: 'No results',

        // Authentication and Authorization Errors
        AUTH_INVALID_CREDENTIALS: 'Invalid credentials',
        AUTH_USER_NOT_FOUND: 'User not found',
        AUTH_NO_USER_PROVIDED: 'No user provided',
        AUTH_NO_PASSWORD_PROVIDED: 'No password provided',
        AUTH_NO_TOKEN_PROVIDED: 'No token provided',
        AUTH_WRONG_PASSWORD: 'Wrong password',
        AUTH_TOKEN_EXPIRED: 'Token expired',
        AUTH_TOKEN_INVALID: 'Invalid token',
        AUTH_PERMISSION_DENIED: 'Permission denied',
        AUTH_LOGIN_REQUIRED: 'You need to log in to view this content.',

        // Network Errors
        NETWORK_ERROR: 'Network error',
        NETWORK_TIMEOUT: 'Network timeout',
        NETWORK_NOT_CONNECTED: 'Not connected to the network',

        // Validation Errors
        VALIDATION_EMAIL_INVALID: 'Invalid email',
        VALIDATION_PASSWORD_WEAK: 'Weak password',
        VALIDATION_FIELD_REQUIRED: 'Field required',
        VALIDATION_USERNAME_TAKEN: 'Username already taken',
        VALIDATION_USERNAME_FORMAT:
          'Username can only contain lowercase letters, numbers, dots and underscores (3-24 characters, no spaces).',

        // User Errors
        USER_PROFILE_NOT_FOUND: 'User profile not found',
        USER_PROFILE_UPDATE_FAILED: 'User profile update failed',
        USER_ACCOUNT_SUSPENDED: 'User account suspended',
        USER_ACCOUNT_DELETED: 'User account deleted',

        // Content Errors
        CONTENT_NOT_FOUND: 'Content not found',
        CONTENT_UPLOAD_FAILED: 'Content upload failed',
        CONTENT_TOO_LARGE: 'Content too large',
        CONTENT_TYPE_NOT_SUPPORTED: 'Content type not supported',

        // Connection Errors
        CONNECTION_REQUEST_FAILED: 'Connection request failed',
        CONNECTION_ALREADY_EXISTS: 'Connection already exists',
        CONNECTION_NOT_FOUND: 'Connection not found',

        // Message Errors
        MESSAGE_SEND_FAILED: 'Message send failed',
        MESSAGE_NOT_FOUND: 'Message not found',
        MESSAGE_CONTENT_INVALID: 'Invalid message content',

        // Post Errors
        POST_CREATE_FAILED: 'Post creation failed',
        POST_NOT_FOUND: 'Post not found',
        POST_UPDATE_FAILED: 'Post update failed',
        POST_DELETE_FAILED: 'Post deletion failed',

        // Payment Errors
        PAYMENT_FAILED: 'Payment failed',
        PAYMENT_METHOD_INVALID: 'Invalid payment method',
        PAYMENT_INSUFFICIENT_FUNDS: 'Insufficient funds',

        // Server Errors
        SERVER_ERROR: 'Server error',
        SERVER_MAINTENANCE: 'Server maintenance',

        // Unknown Errors
        UNKNOWN_ERROR: 'Unknown error',
      },
      follows: {
        followers: 'Followers',
        following: 'Following',
        in_common: 'In common',
        errors: {
          NO_FOLLOWING: 'This profile is not following anyone.',
          NO_FOLLOWERS: 'This profile has no followers.',
          NO_COMMON_FOLLOWERS: 'No common followers.',
        },
      },
      prebooking: {
        title: 'Pre-Bookings',
        singular: 'Pre-Booking',
        create: 'Create Pre-Booking',
        create_short: 'New Pre-Booking',
        dashboard: 'Pre-Booking Dashboard',
        status: {
          DRAFT: 'Draft',
          PENDING: 'Pending',
          PARTIALLY_VIEWED: 'Partially Viewed',
          PARTIALLY_ACCEPTED: 'Partially Accepted',
          ALL_ACCEPTED: 'All Accepted',
          REJECTED: 'Rejected',
          CANCELLED: 'Cancelled',
          CONVERTED: 'Converted to Event',
          EXPIRED: 'Expired',
        },
        approval_status: {
          ALL_PENDING: 'All Pending',
          PARTIAL: 'Partial',
          ALL_APPROVED: 'All Approved',
          REJECTED: 'Rejected',
        },
        participant_status: {
          pending: 'Pending',
          viewed: 'Viewed',
          interested: 'Interested',
          not_interested: 'Not interested',
        },
        request_type: {
          single_date: 'Single Date',
          date_range: 'Date Range',
          week: 'Week',
          month: 'Month',
          quarter: 'Quarter',
        },
        fields: {
          event_name: 'Event Name',
          description: 'Description',
          requested_date_start: 'Start Date',
          requested_date_end: 'End Date',
          request_type: 'Booking Type',
          flexible_dates: 'Flexible Dates',
          alternative_dates: 'Alternative Dates',
          expected_attendance: 'Expected Attendance',
          response_deadline: 'Response Deadline',
          requester: 'Requester',
          recipients: 'Recipients',
          additional_participants: 'Additional Participants',
          notes: 'Notes',
          participants: 'Participants',
        },
        actions: {
          approve: 'Approve',
          reject: 'Reject',
          cancel: 'Cancel',
          convert_to_event: 'Convert to Event',
          edit: 'Edit',
          add_note: 'Add Note',
          view_details: 'View Details',
          send_request: 'Send Request',
        },
        tabs: {
          received: 'Received',
          sent: 'Sent',
          all: 'All',
          pending: 'Pending',
          accepted: 'Accepted',
          rejected: 'Rejected',
        },
        messages: {
          create_success: 'Pre-booking created successfully',
          approve_success: 'Pre-booking approved successfully',
          reject_success: 'Pre-booking rejected',
          cancel_success: 'Pre-booking cancelled',
          convert_success: 'Pre-booking converted to event successfully',
          update_success: 'Pre-booking updated',
          no_requests_found: 'No pre-bookings found',
          requires_action: 'Requires your action',
          approval_progress: '{approved} of {total} approved',
          deadline_warning: 'Expires in {days} days',
          expired: 'This request has expired',
        },
        errors: {
          create_failed: 'Failed to create pre-booking',
          load_failed: 'Failed to load pre-bookings',
          approve_failed: 'Failed to approve',
          reject_failed: 'Failed to reject',
          cancel_failed: 'Failed to cancel',
          convert_failed: 'Failed to convert to event',
          no_permission: 'You do not have permission for this action',
          already_responded: 'You have already responded to this request',
          invalid_dates: 'The selected dates are not valid',
          past_date: 'Cannot create a booking for a past date',
        },
        tooltips: {
          flexible_dates: 'Allows suggesting alternative dates',
          auto_approved: 'Automatically approved upon creation',
          requires_all_types: 'Requires at least one approval from each profile type',
          can_cancel: 'Only the requester can cancel',
          can_convert: 'Can be converted when all approve',
        },
      },
      location: {
        borough: 'Borough',
        canton: 'Canton',
        city: 'City',
        county: 'County',
        continent: 'Continent',
        country: 'Country',
        department: 'Department',
        district: 'District',
        hamlet: 'Hamlet',
        location: 'Location',
        municipality: 'Municipality',
        province: 'Province',
        region: 'Region',
        state: 'State',
        town: 'Town',
        village: 'Village',
      },
      location_info: {
        search_country_or_code: 'Search country or code...',
      },
      social_networks_analytics: {
        metrics: {
          followers: 'Followers',
          subscribers: 'Subscribers',
          monthly_listeners: 'Monthly listeners',
          total_streams: 'Total streams',
          save_rate: 'Save rate',
          radio_streams: 'Radio streams',
          playlist_reach: 'Playlist reach',
          posts: 'Posts',
          avg_likes: 'Average likes',
          engagement_rate: 'Engagement rate',
          avg_reach: 'Average reach',
          total_likes: 'Total likes',
          videos_published: 'Published videos',
          video_views: 'Video views',
          posts_content: 'Content posts',
          shares: 'Shares',
          total_views: 'Total views',
          monthly_video_views: 'Monthly video views',
          watch_time: 'Watch time',
          new_subscribers: 'New subscribers',
          page_likes: 'Page likes',
          weekly_reach: 'Weekly reach',
          engagement: 'Engagement',
          tweets: 'Tweets',
          monthly_impressions: 'Monthly impressions',
          mentions: 'Mentions',
          total_plays: 'Total plays',
          stations_featuring_artist: 'Stations featuring artist',
          thumbs_up: 'Thumbs up',
          shazams: 'Shazams',
        },
      },
      stats: {
        rating: {
          overall: 'Overall',
          stage: 'Stage',
          sound: 'Sound',
          backline: 'Backline',
          lights: 'Lights',
          dressing_room: 'Dressing room',
          hospitality_food: 'Hospitality Food',
          hospitality_drinks: 'Hospitality Drinks',
          timeliness: 'Timeliness',
          communication: 'Communication',
          transportation: 'Transportation',
          logistic: 'Logistic',
          location: 'Location',
          seating_capacity: 'Seating capacity',
          total_rates: 'Total rates',
          talent: 'Talent',
          performance: 'Performance',
          professionalism: 'Professionalism',
          stage_presence: 'Stage presence',
          charisma: 'Charisma',
          respectfulness: 'Respectfulness',
        },
      },
    },
    pages: {
      app: {
        settings: {
          title: 'Settings',
          language_selection: {
            title: 'Language selection',
          },
          user_profile: {
            title: 'User Profile',
            user: 'User',
            logout: 'Logout',
            logged_user: 'Logged User',
            empty_user: 'There is no user',
            user_info: 'User Info',
            roles: 'Roles',
            artist: 'Artist',
            place: 'Place',
          },
        },
      },

      app_base: {
        LoginPage: {
          paragraph1: 'You are viewing a trial version of our platform. Currently, user registration is limited.',
          paragraph2:
            'If you want to join the community of artists, we invite you to register by clicking on the button below.',
          paragraph3:
            'Remember that you can register as part of the music ecosystem or as a fan. Register and keep track of the cultural agenda. You will receive notifications and alerts for events of your interest.',
          button: 'Sign me up for the trial version',
        },
        UsersPages: {
          UsersDetailsPage: {
            fillProfileBanner: {
              content:
                "Before you continue using all the benefits of Artist Hive, it's necessary to complete your personal profile.",
            },
            subpages: {
              general: {
                name: 'General',
                sections: {
                  general: {
                    name: 'General Info',
                    attributes: {
                      given_names: 'Names',
                      surnames: 'Surnames',
                      stage_name: 'Stage name',
                      fullname: 'Full name',
                      gender: 'Gender',
                      birthdate: 'Birthday',
                      birthplace: 'Birthplace',
                      home_city: 'Place of residence',
                    },
                  },
                  contact: {
                    name: 'Contact',
                  },
                },
              },
              artist_info: {
                name: 'Info Pro',
                sections: {
                  emergency_contact: {
                    name: 'Emergency Contact',
                  },
                  artists_info: {
                    name: 'Artist Information',
                    attributes: {
                      user_language: 'User language',
                      spoken_languages: 'User languages',
                      blood_group: 'Blood Group',
                      dietary_restrictions: 'Dietary restrictions',
                      allergies: 'Allergies',
                    },
                  },
                },
              },
              arts: {
                name: 'Arts',
                sections: {
                  music: {
                    name: 'Music',
                    attributes: {
                      played_instruments: 'Played instruments',
                    },
                  },
                  dance: {
                    name: 'Dance',
                  },
                  photography: {
                    name: 'Photography',
                  },
                  video: {
                    name: 'Video',
                  },
                  painting: {
                    name: 'Painting',
                  },
                  poetry: {
                    name: 'Poetry',
                  },
                  standup_comedy: {
                    name: 'Stand-up Comedy',
                  },
                  awards: {
                    name: 'Awards',
                  },
                },
              },
              memberships: {
                name: 'Memberships',
                sections: {
                  artists: {
                    name: 'Artists',
                  },
                  places: {
                    name: 'Places',
                  },
                },
              },
              my_shows: {
                name: 'My Shows',
                sections: {
                  next_shows: {
                    name: 'Next shows',
                  },
                  past_shows: {
                    name: 'Past shows',
                  },
                },
              },
              my_liked_shows: {
                name: 'My liked shows',
                sections: {
                  next_shows: {
                    name: 'Next shows',
                  },
                  past_shows: {
                    name: 'Past shows',
                  },
                },
              },
            },
          },
          activate_industry_banner: {
            banner: {
              title: 'Are you an industry member?',
              content: 'Access all tools for artists, agents, venues, and other professionals.',
            },
            button: 'Activate now',
          },
        },
      },
      domain: {
        CalendarPage: {
          title: 'My calendar',
          empty_state: 'There are no events in this date range',
          error: 'Something went wrong while loading your calendar. Please try again.',
          deadline_label: 'Deadline',
          types: {
            concert: 'Concerts',
            call: 'Open call deadlines',
            activity: 'Activities',
          },
          meta: {
            expired: 'Expired open call',
            city: 'City',
            event_date: 'Event date',
            applications_count: 'Applications',
            notes: 'Notes',
          },
          actions: {
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            delete: 'Delete',
            cancel: 'Cancel',
          },
          activity_form: {
            create_title: 'New activity',
            edit_title: 'Edit activity',
            save_error: 'The activity could not be saved. Please try again.',
            fields: {
              title: 'Title',
              type: 'Type',
              all_day: 'All day',
              start_date: 'Start date',
              start_time: 'Start time',
              end_date: 'End date',
              end_time: 'End time',
              notes: 'Notes',
            },
            types: {
              rehearsal: 'Rehearsal',
              soundcheck: 'Soundcheck',
              other: 'Other',
            },
            validation: {
              title_required: 'Title is required',
              start_date_required: 'Start date is required',
              start_time_required: 'Start time is required',
            },
            delete_confirmation: {
              title: 'Delete activity',
              message: 'Are you sure you want to delete this activity? This action cannot be undone.',
            },
          },
        },
        CulturalAgenda: {
          title: 'Cultural Agenda',
        },
        AcademiesPages: {
          AcademiesDetailsPage: {
            subpages: {
              general: {
                name: 'General',
                sections: {
                  gallery: {
                    name: 'Gallery',
                  },
                  general: {
                    name: 'General Info',
                    attributes: {
                      description: 'Description',
                      address: 'Address',
                      city: 'City',
                      cityWithCountry: 'City',
                      categories: 'Categories',
                      since: 'Since',
                      spoken_languages: 'Spoken languages',
                    },
                  },
                  contact: {
                    name: 'Contact',
                    attributes: {
                      website: 'Website',
                      email: 'e-mail',
                      phone: 'Phone',
                      mobile_phone: 'Mobile Phone',
                      whatsapp: 'WhatsApp',
                    },
                  },
                  social_networks: {
                    name: 'Social Networks',
                  },
                },
              },

              social: {
                name: 'Social',
                sections: {
                  social_network_presence: {
                    name: 'Social network presence',
                  },
                  stats: {
                    name: 'Statistics',
                    attributes: {
                      general_rate: 'General rating',
                      followers: 'Followers',
                      event_followers: 'Event followers',
                    },
                  },
                },
              },
              shows: {
                name: 'Shows',
                sections: {
                  next_shows: {
                    name: 'Next shows',
                  },
                  past_shows: {
                    name: 'Past shows',
                  },
                },
              },
              backline: {
                name: 'Backline',
                sections: {
                  sound_backline: {
                    name: 'Sound backline',
                  },
                  light_backline: {
                    name: 'Light Backline',
                  },
                },
              },
              menu: {
                name: 'Menu',
                sections: {
                  main_course: { name: 'Main course' },
                  second_course: { name: 'Second course' },
                },
              },
            },
          },
        },
        RidersPages: {
          RidersDetailsPage: {
            subpages: {
              general: {
                name: 'General',
                sections: {
                  general: {
                    name: 'General',
                    attributes: {
                      since: 'Since',
                      home_city: 'Home city',
                      categories: 'Categories',
                      spoken_languages: 'Spoken Languages',
                      stage_languages: 'Stage languages',
                      arts_languages: 'Arts Languages',
                    },
                  },
                  contact: {
                    name: 'Contact',
                    attributes: {
                      production_manager_phone: 'Production Manager Phone',
                      tour_manager_phone: 'Tour Manager Phone',
                    },
                  },
                  general_technical_features: {
                    name: 'General Technical Features',
                    attributes: {
                      frequency_response: 'Frequency Response',
                      sound_pressure: 'Sound Pressure',
                      foh_distance: 'FOH Distance',
                    },
                  },
                },
              },
              people: {
                name: 'People',
                sections: {
                  staff: {
                    name: 'Staff',
                  },
                  allergies: {
                    name: 'Allergies',
                  },
                  rooming_list: {
                    name: 'Rooming List',
                  },
                  external_transportation: {
                    name: 'External transportation',
                    attributes: {
                      albums: 'Flights',
                    },
                  },
                  internal_transportation: {
                    name: 'Internal transportation',
                    attributes: {
                      albums: 'Ground transportation',
                    },
                  },
                },
              },
              technical_requirements: {
                name: 'Technical Requirements',
                sections: {
                  staging: {
                    name: 'Staging',
                  },
                  audio_requirements: {
                    name: 'Audio Requirements',
                    attributes: {
                      channelNumber: 'Channel number',
                      instrumentName: 'Instrument name',
                      microphone: 'Microphone',
                      inserts: 'Inserts',
                      mixNumber: 'Mix number',
                      description: 'Description',
                      monitor: 'Monitor',
                    },
                  },
                  video_requirements: {
                    name: 'Video Requirements',
                  },
                  lights_requirements: {
                    name: 'Lights Requirements',
                  },
                  stage_design: {
                    name: 'Stage Design',
                  },
                  special_effects: {
                    name: 'Special Effects',
                  },
                },
              },
              backline: {
                name: 'Backline',
                sections: {
                  external_required_backline: {
                    name: 'External required backline',
                  },
                  owned_backline: {
                    name: 'Owned backline',
                  },
                },
              },
              sound_test: {
                name: 'Sound Test',
                sections: {
                  timing: {
                    name: 'Timing',
                  },
                },
              },
            },
          },
        },
        IndustryOfferPage: {
          create_account_banner: 'Join the hive',
        },
        IndustryPages: {
          CreateIndustryEntityPage: {
            title: 'Industry member',
            intro:
              'Thanks for your interest in registering as an industry member, whether as an artist, agent, venue owner, rehearsal space or other entity.',
            intro_secondary:
              'Search for your profile if it already exists in the system, or create a new one to get started.',
            search_section: {
              title: 'Search for your profile',
              input_placeholder: 'Artist or place name...',
              search_button: 'Search',
              artists_found: 'These are the related artists',
              places_found: 'These are the related places',
            },
            create_section: {
              title: 'Or create a new profile',
            },
            reset_section: {
              remove_artists_button: 'Remove my Artist profiles',
              remove_places_button: 'Remove my Place profiles',
              confirm_title: 'Confirm action',
              confirm_content:
                'This action will remove the association of all your profiles of this type with your account. The profiles themselves will not be deleted, but they will stop appearing in your memberships. Do you want to continue?',
              confirm_action: 'Yes, remove',
              cancel_action: 'Cancel',
            },
          },
        },
        PrebookingPages: {},

        TourPlansPages: {
          TourPlanDetailsPage: {
            tourPlanNotFound: 'Tour not found',
            subpages: {
              general: {
                name: 'General',
                sections: {
                  dates: {
                    name: 'Dates',
                    attributes: {
                      initial_date: 'Initial Date',
                      final_date: 'Final Date',
                      total_days: 'Total days',
                      events_state_summary: 'Events',
                    },
                  },
                  shows: {
                    name: 'Shows',
                  },
                },
              },
              dates: { name: 'Dates' },
              budget: {
                name: 'Budget',
                sections: {
                  internal_transportation: { name: 'Internal transportation' },
                  intercity_transportation: {
                    name: 'Intercity transportation',
                  },
                  accommodation: { name: 'Accommodation' },
                  food: { name: 'Food' },
                },
              },
              wishes: {
                name: 'Wishes',
                sections: {
                  guest_artists: { name: 'Guest Artists' },
                  possible_shows: { name: 'Possible shows' },
                },
              },
              settings: { name: 'Settings' },
            },
          },
        },
      },
      ArtistsPages: {
        ArtistsDetailsPage: {
          subpages: {
            general: {
              name: 'General',
              sections: {
                artist_gallery: {
                  name: 'Artist gallery',
                  attributes: {
                    members: 'Members',
                    live: 'Live',
                  },
                },
                live_gallery: {
                  name: 'Live Gallery',
                },
                general: {
                  name: 'General Info',
                  attributes: {
                    description: 'Description',
                    since: 'Since',
                    origin_city: 'Origin city',
                    home_city: 'Home city',
                    categories: 'Categories',
                    genres: 'Genres',
                    spoken_languages: 'Spoken languages',
                    stage_languages: 'Stage languages',
                    arts_languages: 'Art languages',
                  },
                },
                genres: {
                  name: 'Genres',
                },
                contact: {
                  name: 'Contact',
                  attributes: {
                    website: 'Website',
                    email: 'e-mail',
                    phone: 'Phone',
                    mobile_phone: 'Mobile',
                    whatsapp: 'WhatsApp',
                  },
                },
                social_networks: {
                  name: 'Social networks',
                },
                record_label: {
                  name: 'Record Labels',
                },
                members: {
                  name: 'Members',
                },
              },
            },
            members: {
              name: 'Members',
              sections: {
                music_performance: {
                  name: 'Instruments',
                  attributes: {
                    member_names: 'Names',
                    member_surenames: 'Surenames',
                    member_role: 'Role',
                    member_instrument: 'Instrument',
                    gender: 'Gender',
                    email: 'E-Mail',
                    stage_name: 'Stage name',
                  },
                },
                audio_engineering: {
                  name: 'Audio Engineering',
                },
                visual_arts: {
                  name: 'Visuals',
                },
                management: {
                  name: 'Management',
                },
                production: {
                  name: 'Production',
                },
                support: {
                  name: 'Support',
                },
              },
            },
            arts: {
              name: 'Arts',
              sections: {
                discography: {
                  name: 'Discography',
                  attributes: {
                    albums: 'Albums',
                    top_tracks: 'Top tracks',
                    dvd_video: 'DVD / Video',
                  },
                },
                media_channels: {
                  name: 'Media channels',
                },
                gallery: {
                  name: 'Gallery',
                  attributes: {
                    photos: 'Photos',
                    video: 'Video',
                  },
                },
                awards: {
                  name: 'Awards',
                },
              },
            },
            social: {
              name: 'Social',
              sections: {
                social_network_presence: {
                  name: 'Social network presence',
                },
                stats: {
                  name: 'Statistics',
                  attributes: {
                    general_rate: 'General rate',
                    followers: 'Followers',
                    event_followers: 'Event followers',
                  },
                },
                rating: {
                  name: 'Rating',
                },
              },
            },
            shows: {
              name: 'Shows',
              sections: {
                summary: {
                  name: 'Summary',
                  attributes: {
                    priceRange: 'Prices',
                  },
                },
                next_shows: {
                  name: 'Next shows',
                },
                past_shows: {
                  name: 'Past shows',
                },
              },
            },
            followers: {
              name: 'Followers',
            },
            documents: {
              name: 'Docs',
              sections: {
                technical_docs: {
                  name: 'Technical Documents',
                  docs: {
                    technical_epk: 'EPK',
                    technical_rider: 'Technical Rider',
                    stage_plot: 'Stage Plot',
                  },
                },
              },
            },
          },
        },
      },
      HomePage: {
        welcome: 'Welcome',
        news: 'News',
        artists: 'Artists',
        events: 'Events',
        places: 'Places',
        industry_offer: {
          title: 'Are you part of the music industry?',
          call_to_action: 'Discover our proposal',
        },
      },
      EventsPages: {
        EventDetailsPage: {
          subpages: {
            general: {
              name: 'Info',
              sections: {
                general: {
                  name: 'General Information',
                  attributes: {
                    national_code: 'PULEP',
                    timetable__initial_date: 'When?',
                    initial_time: 'Starting time',
                    minimumAge: 'Minimum age',
                    timetable__openning_doors: 'Doors opening',
                    promoter: 'Promoter',
                    tickets_website: 'Tickets Website',
                  },
                },
                description: {
                  name: 'Description',
                },
                genres: {
                  name: 'Genres',
                },
              },
            },
            artists: {
              name: 'Artists',
              sections: {
                main_artists: { name: 'Headliners' },
                other_artists: { name: 'Other artists' },
              },
            },
            place: {
              name: 'Place',
              sections: {
                location: {
                  name: 'Location',
                },
              },
            },
            tickets: {
              name: 'Tickets',
              sections: {
                general: {
                  name: 'General Information',
                  attributes: {
                    tickets_website: 'Tickets Website',
                    price: 'Price',
                  },
                },
              },
            },
            contact: {
              name: 'Contact & Media',
              sections: {
                contact: {
                  name: 'Contact Info',
                },
                social_networks: {
                  name: 'Social networks',
                },
              },
            },
            extra_info: {
              name: 'Extras',
              sections: {
                additional_info: { name: 'Additional Info' },
                dress_code: { name: 'Dress code' },
                discounts: { name: 'Discounts' },
                promoter: { name: 'Promoter' },
              },
            },
          },
        },
      },
      PlacesPages: {
        PlacesDetailsPage: {
          subpages: {
            general: {
              name: 'General',
              sections: {
                gallery: {
                  name: 'Gallery',
                },
                general: {
                  name: 'General Info',
                  attributes: {
                    description: 'Description',
                    place_type: 'Venue Type',
                    address: 'Address',
                    city: 'City',
                    cityWithCountry: 'Location',
                    home_city: 'Location',
                    categories: 'Categories',
                    since: 'Since',
                    spoken_languages: 'Spoken Languages',
                    stage_languages: 'Stage Languages',
                    arts_languages: 'Arts Languages',
                    activity: 'Is active?',
                    has_open_mic: 'Has open mic?',
                    total_audience_capacity: 'Max. capacity',
                    bookingRatesPolicy: 'Booking Policies',
                    regulatory_closing_time: 'Regulatory closing time',
                  },
                },
                genres: {
                  name: 'Genres',
                },
                contact: {
                  name: 'Contact',
                  attributes: {
                    website: 'Website',
                    email: 'Email',
                    phone: 'Phone',
                    mobile_phone: 'Mobile Phone',
                    whatsapp: 'WhatsApp',
                  },
                },
                social_networks: {
                  name: 'Social Networks',
                },
              },
            },
            stats: {
              name: 'Statistics',
              sections: {
                social_network_presence: {
                  name: 'Social Network Presence',
                },
                rating: {
                  name: 'Rating',
                },
              },
            },
            shows: {
              name: 'Shows',
              sections: {
                next_shows: {
                  name: 'Next Shows',
                },
                past_shows: {
                  name: 'Past Shows',
                },
              },
            },
            backline: {
              name: 'Backline',
              sections: {
                backline_instruments: {
                  name: 'Instruments',
                },
                backline_sound: {
                  name: 'Sound',
                },
                backline_lights: {
                  name: 'Lights',
                },
                backline_video: {
                  name: 'Video',
                },
                backline_additional_info: {
                  name: 'Additional Info',
                },
              },
            },
            menu: {
              name: 'Menu',
              sections: {
                main_course: {
                  name: 'Main Course',
                },
                second_course: {
                  name: 'Second Course',
                },
              },
            },
            followers: {
              name: 'Followers',
            },
          },
        },
      },
      OpenCallPage: {
        title: 'Open Call',
        subtitle:
          'Fill in the form to apply as an artist. Every detail helps us evaluate your proposal and coordinate the logistics of the event.',
        step_counter: 'Step {current} of {total}',
        step_progress: '{progress}% completed',
        required_notice: 'Fields marked with * are required',
        prev_button: 'Previous',
        next_button: 'Next',
        submit_button: 'Submit application',
        submitting_button: 'Sending...',
        save_notice: 'You can save and continue later',
        no_artist_profile: {
          title: 'You have no active artist profile',
          message:
            'You can only apply to an Open Call from an Artist profile. Check that you are logged in with the right profile.',
        },
        success: {
          title: 'Application sent',
          message:
            'We have received your application. We will review your proposal and contact you at the email address you provided.',
          back_button: 'Back to home',
        },
        already_applied: {
          title: 'You have already applied to this Open Call',
          message: 'You can only send one application per Open Call.',
          status_label: 'Your application status:',
          details_button: 'View the Open Call',
        },
        application_status: {
          pending: 'Pending',
          accepted: 'Accepted',
          rejected: 'Rejected',
        },
        submit_errors: {
          duplicate: 'You have already applied to this Open Call.',
          not_accepting_applications:
            'This Open Call is not accepting applications: it is closed or past its deadline.',
          open_call_not_found: 'We could not find this Open Call. It may have been removed.',
          generic: 'We could not send your application. Please try again later.',
        },
      },
      OpenCallsListPage: {
        subpages: {
          active: { name: 'Active Open-calls' },
          past: { name: 'Past Open-calls' },
          available: { name: 'Available' },
          applications: { name: 'My Applications' },
        },
        attributes: {
          event_name: 'Event Name',
          event_date: 'Event Date',
          start_date: 'Opens On',
          end_date: 'Closes On',
          status: 'Status',
          applications_count: 'Applications',
          city: 'City',
          genres: 'Genres',
          application_status: 'Application Status',
        },
      },
      OpenCallDetailsPage: {
        applications_received_title: 'Applications Received',
        your_application_title: 'Your Application',
        no_applications_yet: 'No applications yet for this Open Call.',
        not_applied_yet: "You haven't applied to this Open Call yet.",
        loading_applications: 'Loading applications...',
        loading_your_application: 'Loading your application...',
        unauthorized_message: "Log in with an Artist or Place profile to see this Open Call's applications.",
        back_button: 'Back to My Open Calls',
        apply_button: 'Apply to this Open Call',
        open_call_status: {
          DRAFT: 'Draft',
          OPEN: 'Open',
          CLOSED: 'Closed',
          CANCELLED: 'Cancelled',
        },
        presentation: {
          open_badge: 'Applications open',
          expired_badge: 'Applications closed',
          apply_deadline_title: 'Application period',
          event_date_label: 'Event date',
          minutes_suffix: 'min',
          sections: {
            about: 'About this Open Call',
            conditions: 'Conditions and requirements',
            technical: 'Technical details',
            compensation: 'Compensation and logistics',
          },
          fields: {
            description: 'Description',
            genres: 'Genres',
            accepted_project_types: 'Accepted project types',
            requirements_description: 'Requirements',
            set_duration: 'Set duration',
            max_applications: 'Maximum applications',
            available_slots: 'Available slots',
            expected_audience: 'Expected audience',
            stage_type: 'Stage type',
            stage_dimensions: 'Stage dimensions',
            provided_sound: 'Sound provided',
            provided_backline: 'Backline provided',
            provided_lighting: 'Lighting provided',
            technical_notes: 'Technical notes',
            fee: 'Fee',
            travel_support: 'Travel support',
            accommodation_provided: 'Accommodation',
            meals_provided: 'Meals',
            additional_notes: 'Additional notes',
          },
        },
        status: {
          pending: 'Pending',
          accepted: 'Accepted',
          rejected: 'Rejected',
        },
        actions: {
          accept: 'Accept',
          reject: 'Reject',
        },
      },
    },
    appbase: {
      betabar: {
        contact_us: 'Contact us',
        disclaimer:
          'You are viewing a trial version of our platform. We hope you like it. You can contact us using the button below.',
        our_email_is: 'Our email is:',
      },
      claimProfileBanner: {
        PROFILE_AUTO_GENERATED_CAPTION:
          'This profile was created using publicly available information online. Is it yours? Claim your free profile to manage and update it.',
        PROFILE_CONFIRMATION_MESSAGE:
          "Thank you for your interest in claiming this profile. By clicking the 'Claim your profile' button, you authorize us to begin the ownership validation process in your name. Once ownership is verified, you will have access to the profile with admin roles so you can interact with your fans and the music industry through all the tools Artist Hive offers. <br />Please note that the validation process may take between 5 and 10 business days. We will notify you by email or through the profile's social media channels.",
        CLAIM_REQUEST_CONFIRMATION:
          'Your request has been successfully submitted. We will contact you via email or through social media as soon as it is resolved.',
        CLAIM_BUTTON: 'Claim your profile',
      },
      reportProfileForm: {
        title: 'Report profile',
        reason_label: 'Report reason',
        reasons: {
          DUPLICATE: 'Duplicate profile',
          FAKE: 'Fake profile',
          WRONG_INFO: 'Incorrect information',
          BELONGS_TO_ME: 'This profile belongs to me but is assigned to someone else',
          INAPPROPRIATE_CONTENT: 'Inappropriate content',
          OTHER: 'Other',
        },
        description_label: 'Description',
        description_placeholder: 'Tell us more details about this report',
        submit_button: 'Send report',
        success_message: 'Your report has been sent. Thank you for helping us keep the platform safe.',
        error_message: 'An error occurred while sending your report. Please try again.',
        duplicate_pending_error: 'You already have a pending report for this profile.',
      },
      footer: {
        columns: {
          what_we_do: {
            name: 'What we do?',
            options: {
              cultural_agenda: 'Cultural Agenda',
              for_academies: 'For academies',
              for_artists: 'For artists',
              for_places: 'For places',
              for_promoters: 'For promoters',
              for_festivals: 'For festivals',
            },
          },
          about_us: {
            name: 'About us',
            options: {
              history: 'Our history',
              press: 'Press',
              career: 'Career',
              download: 'Download the app',
            },
          },
          help: {
            name: 'Help',
            options: {
              help_center: 'Help center',
              data_policy: 'Data Policy',
              terms: 'Terms of Service',
              contact_us: 'Contact us',
              report: 'Report',
            },
          },
        },
        copyright: {
          allRightsReserved: 'All rights reserved',
        },
      },
      search: {
        empty_results: {
          title: 'There are no results that match your search',
          suggestions: {
            statement: 'Try any of the following suggestions',
            spelling: 'Check your spelling',
            less_words: 'Use more generic words or fewer words',
            related_things: 'Browse categories to find similar elements',
          },
        },
        filters: {
          title: 'Filters',
          subpages: {
            general: {
              name: 'General',
              sections: {
                general: {
                  name: 'General',
                  attributes: {
                    genres: 'Genres',
                    cityWithCountry: 'Where?',
                  },
                },
                dates: {
                  name: 'Dates',
                  attributes: {
                    date: 'When?',
                  },
                },
                languages: {
                  name: 'Languages',
                  attributes: {
                    spoken_languages: 'Spoken Languages',
                    stage_languages: 'Stage Languages',
                    arts_languages: 'Arts Languages',
                  },
                },
              },
            },
            artists: {
              name: 'Artists',
              sections: {
                general: {
                  name: 'General',
                  attributes: {
                    is_available_at: 'Is available at?',
                    has_albums: 'Has albums?',
                    music_awards: 'Music Awards',
                  },
                },
                rating: {
                  name: 'Rating',
                  attributes: {
                    overall: 'Overall',
                    talent: 'Talent',
                    performance: 'Performance',
                  },
                },
              },
            },
            places: {
              name: 'Places',
              sections: {
                stage: {
                  name: 'Stage',
                  attributes: {
                    stage_width: 'Width',
                    stage_length: 'Length',
                    stage_height: 'Height',
                  },
                },
                backline: {
                  name: 'Backline',
                  attributes: {
                    mics: 'Mics',
                  },
                },
              },
            },
            social_networks: {
              name: 'Social Networks',
              sections: {
                presence: {
                  name: 'Presence',
                  attributes: {
                    has_social_networks: 'Has these networks?',
                  },
                },
              },
            },
          },
        },
        not_found_results: 'No results found',
        recommendations: 'Recommendations',
        result_view_types: {
          list: 'List',
          map: 'Map',
        },
        results: 'Results',
        search: 'Search',
        search_placeholder: 'Artists, events, places...',
        see_more: 'See more',
        what_are_you_looking_for: 'What are you looking for?',
        types: {
          ARTISTS: 'Artists',
          PLACES: 'Places',
          EVENTS: 'Events',
        },
        type_your_search: 'Write your search',
      },
      sidenav: {
        name: 'Main menu',
        sections: {
          general: {
            name: 'General',
            options: {
              home: 'Home',
              cultural_agenda: 'Cultural agenda',
              opportunities: 'Opportunities',
              search: 'Search',
            },
          },
          industry: {
            name: 'Music Industry',
            options: {
              industry_member: 'Are you part of the music industry?',
            },
          },
          myInfo: {
            name: 'My Info',
            options: {
              inbox: 'Inbox',
              'inbox.nested': {
                incoming: 'Incoming',
                sent: 'Sent',
              },
              crew: 'My Crew',
              my_profile: 'My Profile',
              my_bands: 'My Bands',
              'my_bands.nested': { create: 'Create Band' },
              my_events: 'My Events',
              'my_events.nested': { create: 'Create event' },
              my_riders: 'My Riders',
              my_open_calls: 'My Open-calls',
              my_places: 'My Places',
              'my_places.nested': { create: 'Create Place' },
              favourites: 'Favorites',
              'favourites.nested': {
                saved: 'Saved',
                tour_planning: 'Tour Planning',
              },
              my_prebooking_requests: 'My Booking Requests',
              my_calendar: 'My Calendar',
            },
          },
          settings: {
            name: 'Settings',
            options: {
              settings: 'Settings',
              help_center: 'Help Center',
              report: 'Report',
              send_comments: 'Send Comments',
              logout: 'Logout',
            },
          },
        },
      },
    },
  },
};
