export const DeMessages = {
  app: {
    name: 'App DE',
    loading: 'Wird geladen',
    general: {
      not_found_page: {
        title: 'Hoppla! Wir konnten nicht finden, wonach Sie suchen',
      },
    },
    domain_global_dictionary: { errors: {} },
    global_dictionary: {
      artists_hive: {
        slogan: 'Kreiere, Vernetze dich, Fliege....',
      },
      genders: {
        male: 'Mann',
        female: 'Frau',
        non_binary: 'Nicht binär',
        non_specified: 'Nicht spezifiziert',
      },
      art_types: {
        dance: 'Tanz',
        music: 'Musik',
        painting: 'Malerei',
        poetry: 'Poesie',
        photography: 'Fotografie',
        standup_comedy: 'Stand-up Comedy',
        theatre: 'Theater',
        video: 'Video',
      },
      actions: {
        accounts: {
          create_account: 'Konto erstellen',
          forgot_password: 'Passwort vergessen',
          login: 'Login',
          password: 'Passwort',
          remember_me: 'Angemeldet bleiben',
          signup: 'Registrieren',
          username_or_email: 'Benutzername oder E-Mail',
        },
        create: 'Erstellen',
        follow_us: 'Folst uns',
        save: 'Speichern',
        show_more: 'Mehr anzeigen',
        show_less: 'Weniger anzeigen',
        submit: 'Absenden',
        subscription: {
          subscribe: 'Abonnieren',
          unsubscribe: 'Abbestellen',
        },
        upload: 'Hochladen',
      },
      entities: {
        academies: { plural: 'Akademien', singular: 'Akademie' },
        artists: { plural: 'Künstler', singular: 'Künstler' },
        events: { plural: 'Veranstaltungen', singular: 'Veranstaltung' },
        places: { plural: 'Orte', singular: 'Ort' },
        promoters: { plural: 'Veranstalter', singular: 'Veranstalter' },
      },
      errors: {
        // Errores de Autenticación y Autorización
        AUTH_INVALID_CREDENTIALS: 'Ungültige Anmeldedaten',
        AUTH_USER_NOT_FOUND: 'Benutzer nicht gefunden',
        AUTH_NO_USER_PROVIDED: 'Kein Benutzer angegeben',
        AUTH_NO_PASSWORD_PROVIDED: 'Kein Passwort angegeben',
        AUTH_NO_TOKEN_PROVIDED: 'Kein Token angegeben',
        AUTH_WRONG_PASSWORD: 'Falsches Passwort',
        AUTH_TOKEN_EXPIRED: 'Token abgelaufen',
        AUTH_TOKEN_INVALID: 'Ungültiger Token',
        AUTH_PERMISSION_DENIED: 'Zugriff verweigert',

        // Errores de Red
        NETWORK_ERROR: 'Netzwerkfehler',
        NETWORK_TIMEOUT: 'Netzwerk-Zeitüberschreitung',
        NETWORK_NOT_CONNECTED: 'Keine Netzwerkverbindung',

        // Errores de Validación
        VALIDATION_EMAIL_INVALID: 'Ungültige E-Mail-Adresse',
        VALIDATION_PASSWORD_WEAK: 'Schwaches Passwort',
        VALIDATION_FIELD_REQUIRED: 'Feld erforderlich',
        VALIDATION_USERNAME_TAKEN: 'Benutzername bereits vergeben',

        // Errores de Usuario
        USER_PROFILE_NOT_FOUND: 'Benutzerprofil nicht gefunden',
        USER_PROFILE_UPDATE_FAILED: 'Aktualisierung des Benutzerprofils fehlgeschlagen',
        USER_ACCOUNT_SUSPENDED: 'Benutzerkonto gesperrt',
        USER_ACCOUNT_DELETED: 'Benutzerkonto gelöscht',

        // Errores de Contenido
        CONTENT_NOT_FOUND: 'Inhalt nicht gefunden',
        CONTENT_UPLOAD_FAILED: 'Hochladen des Inhalts fehlgeschlagen',
        CONTENT_TOO_LARGE: 'Inhalt zu groß',
        CONTENT_TYPE_NOT_SUPPORTED: 'Inhaltstyp nicht unterstützt',

        // Errores de Amistad/Conexión
        CONNECTION_REQUEST_FAILED: 'Verbindungsanfrage fehlgeschlagen',
        CONNECTION_ALREADY_EXISTS: 'Verbindung besteht bereits',
        CONNECTION_NOT_FOUND: 'Verbindung nicht gefunden',

        // Errores de Mensajes
        MESSAGE_SEND_FAILED: 'Nachricht senden fehlgeschlagen',
        MESSAGE_NOT_FOUND: 'Nachricht nicht gefunden',
        MESSAGE_CONTENT_INVALID: 'Ungültiger Nachrichteninhalt',

        // Errores de Publicación
        POST_CREATE_FAILED: 'Erstellung des Beitrags fehlgeschlagen',
        POST_NOT_FOUND: 'Beitrag nicht gefunden',
        POST_UPDATE_FAILED: 'Aktualisierung des Beitrags fehlgeschlagen',
        POST_DELETE_FAILED: 'Löschen des Beitrags fehlgeschlagen',

        // Errores de Pago
        PAYMENT_FAILED: 'Zahlung fehlgeschlagen',
        PAYMENT_METHOD_INVALID: 'Ungültige Zahlungsmethode',
        PAYMENT_INSUFFICIENT_FUNDS: 'Unzureichende Mittel',

        // Errores del Servidor
        SERVER_ERROR: 'Serverfehler',
        SERVER_MAINTENANCE: 'Serverwartung',

        // Errores Desconocidos
        UNKNOWN_ERROR: 'Unbekannter Fehler',
      },
      location: {
        borough: 'Stadtteil',
        canton: 'Kanton',
        city: 'Stadt',
        county: 'Landkreis',
        continent: 'Kontinent',
        country: 'Land',
        department: 'Departement',
        district: 'Bezirk',
        hamlet: 'Weiler',
        location: 'Ort',
        municipality: 'Gemeinde',
        province: 'Provinz',
        region: 'Region',
        state: 'Bundesland',
        town: 'Stadt',
        village: 'Dorf',
      },
      stats: {
        rating: {
          overall: 'Gesamtbewertung',
          stage: 'Bühne',
          sound: 'Ton',
          backline: 'Backline',
          lights: 'Beleuchtung',
          dressing_room: 'Umkleideraum',
          hospitality_food: 'Verpflegung',
          hospitality_drinks: 'Getränke',
          timeliness: 'Pünktlichkeit',
          communication: 'Kommunikation',
          transportation: 'Transport',
          logistic: 'Logistik',
          location: 'Ort',
          seating_capacity: 'Sitzplatzkapazität',
          total_rates: 'Gesamtbewertungen',
          talent: 'Talent',
          performance: 'Leistung',
          proffesionalism: 'Professionalität',
          stage_presence: 'Bühnenpräsenz',
          charisma: 'Charisma',
          respectfulness: 'Respektvoll',
        },
      },
    },
    pages: {
      app: {
        settings: {
          title: 'Einstellungen',
          language_selection: {
            title: 'Sprachauswahl',
          },
          user_profile: {
            title: 'Benutzerprofil',
            user: 'Benutzer',
            logout: 'Ausloggen',
            logged_user: 'Angemeldeter Benutzer',
            empty_user: 'Es gibt keinen Benutzer',
            user_info: 'Benutzerinfo',
            roles: 'Rollen',
            artist: 'Künstler',
            place: 'Ort',
          },
        },
      },

      app_base: {
        LoginPage: {
          paragraph1:
            'Du siehst gerade eine Testversion unserer Plattform. Derzeit ist die Benutzerregistrierung begrenzt.',
          paragraph2:
            'Wenn du dich dem Künstlerkollektiv anschließen möchtest, laden wir dich ein, dich zu registrieren, indem du auf den folgenden Button klickst.',
          paragraph3:
            'Denke daran, dass du dich entweder als Teil des Musikökosystems oder als Fan registrieren kannst. Registriere dich und behalte den Kulturkalender im Blick. Du erhältst Benachrichtigungen und Hinweise zu Veranstaltungen, die dich interessieren.',
          button: 'Registrieren Sie mich in der Testversion',
        },
        UsersPages: {
          UsersDetailsPage: {
            subpages: {
              general: {
                name: 'Allgemein',
                sections: {
                  general: {
                    name: 'Allgemeine Informationen',
                    attributes: {
                      fullname: 'Vollständiger Name',
                      gender: 'Geschlecht',
                      birthdate: 'Geburtstag',
                      birthplace: 'Geburtsort',
                      home_city: 'Wohnort',
                    },
                  },
                  contact: {
                    name: 'Kontakt',
                  },
                  emergency_contact: {
                    name: 'Notfallkontakt',
                  },
                  artists_info: {
                    name: 'Künstlerinformationen',
                    attributes: {
                      user_language: 'Benutzersprache',
                      blood_group: 'Blutgruppe',
                      dietary_restrictions: 'Diätetische Einschränkungen',
                      allergies: 'Allergien',
                    },
                  },
                },
              },
              arts: {
                name: 'Kunst',
                sections: {
                  music: {
                    name: 'Musik',
                  },
                  dance: {
                    name: 'Tanz',
                  },
                  photography: {
                    name: 'Fotografie',
                  },
                  video: {
                    name: 'Video',
                  },
                  painting: {
                    name: 'Malerei',
                  },
                  poetry: {
                    name: 'Poesie',
                  },
                  standup_comedy: {
                    name: 'Standup-Comedy',
                  },
                  awards: {
                    name: 'Preis',
                  },
                },
              },
              memberships: {
                name: 'Mitgliedschaften',
                sections: {
                  artists: {
                    name: 'Künstler',
                  },
                  places: {
                    name: 'Orte',
                  },
                },
              },
              my_shows: {
                name: 'Meine Veranstaltungen',
                sections: {
                  next_shows: {
                    name: 'Bevorstehende Sendungen',
                  },
                  past_shows: {
                    name: 'Vergangene Shows',
                  },
                },
              },
              my_liked_shows: {
                name: 'Meine liebe Veranstaltungen',
                sections: {
                  next_shows: {
                    name: 'Bevorstehende Sendungen',
                  },
                  past_shows: {
                    name: 'Vergangene Shows',
                  },
                },
              },
            },
          },
        },
      },
      domain: {
        CulturalAgenda: {
          title: 'Kulturelle Agenda',
        },
        AcademiesPages: {
          AcademiesDetailsPage: {
            subpages: {
              general: {
                name: 'Generale',
                sections: {
                  gallery: {
                    name: 'Galleria',
                  },
                  general: {
                    name: 'Info generale',
                    attributes: {
                      description: 'Beschreibung',
                      address: 'Indirizzo',
                      city: 'Città',
                      categories: 'Categorie',
                      since: 'Da',
                      spoken_languages: 'Lingue parlate',
                    },
                  },
                  contact: {
                    name: 'Contatto',
                    attributes: {
                      website: 'Website',
                      email: 'e-mail',
                      phone: 'Telefono',
                      mobile_phone: 'Cellulare',
                      whatsapp: 'WhatsApp',
                    },
                  },
                  social_networks: {
                    name: 'Reti Sociali',
                  },
                },
              },

              social: {
                name: 'Sociale',
                sections: {
                  social_network_presence: {
                    name: 'Presenza sui social network',
                  },
                  stats: {
                    name: 'Statistiche',
                    attributes: {
                      general_rate: 'Qualificazione generale',
                      followers: 'Followers',
                      event_followers: 'Eventi followers',
                    },
                  },
                },
              },
              shows: {
                name: 'Shows',
                sections: {
                  next_shows: {
                    name: 'Prossimi spettacoli',
                  },
                  past_shows: {
                    name: 'Spettacoli passati',
                  },
                },
              },
              backline: {
                name: 'Backline',
                sections: {
                  sound_backline: {
                    name: 'Sound Backline',
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
                name: 'Allgemein',
                sections: {
                  general: {
                    name: 'Allgemein',
                    attributes: {
                      since: 'Seit',
                      home_city: 'Heimatstadt',
                      categories: 'Kategorien',
                      spoken_languages: 'Gesprochene Sprachen',
                      stage_languages: 'Bühnensprachen',
                      arts_languages: 'Kunstsprachen',
                    },
                  },
                  contact: {
                    name: 'Kontakt',
                    attributes: {
                      production_manager_phone: 'Telefon des Produktionsleiters',
                      tour_manager_phone: 'Telefon des Tourmanagers',
                    },
                  },
                  general_technical_features: {
                    name: 'Allgemeine technische Merkmale',
                    attributes: {
                      frecuency_response: 'Frequenzantwort',
                      sound_pressure: 'Schalldruck',
                      foh_distance: 'FOH-Entfernung',
                    },
                  },
                },
              },
              people: {
                name: 'Personen',
                sections: {
                  staff: {
                    name: 'Personal',
                  },
                  allergies: {
                    name: 'Allergien',
                  },
                  rooming_list: {
                    name: 'Unterbringungsliste',
                  },
                  external_transportation: {
                    name: 'Externer Transport',
                    attributes: {
                      albums: 'Flüge',
                    },
                  },
                  internal_transportation: {
                    name: 'Interner Transport',
                    attributes: {
                      albums: 'Bodenverkehrsmittel',
                    },
                  },
                },
              },
              technical_requirements: {
                name: 'Technische Anforderungen',
                sections: {
                  staging: {
                    name: 'Bühnenaufbau',
                  },
                  audio_requirements: {
                    name: 'Audioanforderungen',
                    attributes: {
                      channelNumber: 'Kanalnummer',
                      instrumentName: 'Instrumentenname',
                      microphone: 'Mikrofon',
                      inserts: 'Einschübe',
                      mixNumber: 'Mischnummer',
                      description: 'Beschreibung',
                      monitor: 'Monitor',
                    },
                  },
                  video_requirements: {
                    name: 'Videoanforderungen',
                  },
                  lights_requirements: {
                    name: 'Lichtanforderungen',
                  },
                  stage_design: {
                    name: 'Bühnendesign',
                  },
                  special_effects: {
                    name: 'Sondereffekte',
                  },
                },
              },
              backline: {
                name: 'Backline',
                sections: {
                  external_required_backline: {
                    name: 'Externe benötigte Backline',
                  },
                  owned_backline: {
                    name: 'Eigene Backline',
                  },
                },
              },
              sound_test: {
                name: 'Soundtest',
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
          create_account_banner: 'Schließe dich dem Bienenstock an',
        },
        TourPlansPages: {
          TourPlanDetailsPage: {
            tourPlanNotFound: 'Tour nicht gefunden',
            subpages: {
              general: {
                name: 'Allgemein',
                sections: {
                  dates: {
                    name: 'Termine',
                    attributes: {
                      initial_date: 'Anfangsdatum',
                      final_date: 'Enddatum',
                      total_days: 'Gesamttage',
                      events_state_summary: 'Veranstaltungen',
                    },
                  },
                  shows: {
                    name: 'Shows',
                  },
                },
              },
              dates: {
                name: 'Termine',
              },
              budget: {
                name: 'Budget',
                sections: {
                  internal_transportation: {
                    name: 'Interne Beförderung',
                  },
                  intercity_transportation: {
                    name: 'Streckenbefeörderung',
                  },
                  accommodation: {
                    name: 'Unterkunft',
                  },
                  food: {
                    name: 'Verpflegung',
                  },
                },
              },
              wishes: {
                name: 'Wünsche',
                sections: {
                  guest_artists: {
                    name: 'Gastkünstler',
                  },
                  possible_shows: {
                    name: 'Mögliche Shows',
                  },
                },
              },
              settings: {
                name: 'Einstellungen',
              },
            },
          },
        },
      },
      ArtistsPages: {
        ArtistsDetailsPage: {
          subpages: {
            general: {
              name: 'Allgemeine',
              sections: {
                general: {
                  name: 'Allgemeine Informationen',
                  attributes: {
                    description: 'Beschreibung',
                    since: 'Seit',
                    home_city: 'Stadt der Niederlassung',
                    categories: 'Kategorien',
                    genres: 'Genres',
                    spoken_languages: 'Gesprochene Sprachen',
                    stage_languages: 'Sprachen auf der Bühne',
                    arts_languages: 'Sprachen der Künste',
                  },
                },
                genres: {
                  name: 'Genres',
                },
                contact: {
                  name: 'Kontakt',
                  attributes: {
                    website: 'Webseite',
                    email: 'e-mail',
                    phone: 'Telefon',
                    mobile_phone: 'Mobiltelefon',
                    whatsapp: 'WhatsApp',
                  },
                },
                social_networks: {
                  name: 'Soziale Netzwerke',
                },
                record_label: {
                  name: 'Plattenfirma',
                },
                members: {
                  name: 'Mitglieder',
                },
              },
            },
            arts: {
              name: 'Künste',
              sections: {
                discography: {
                  name: 'Diskographie',
                  attributes: {
                    albums: 'Alben',
                    dvd_video: 'DVD / Video',
                  },
                },
                media_channels: {
                  name: 'Medienkanäle',
                },
                gallery: {
                  name: 'Galerie',
                  attributes: {
                    photos: 'Fotos',
                    video: 'Video',
                  },
                },
                awards: {
                  name: 'Auszeichnungen',
                },
              },
            },
            social: {
              name: 'Sozial',
              sections: {
                social_network_presence: {
                  name: 'Präsenz in sozialen Netzwerken',
                },
                stats: {
                  name: 'Statistiken',
                  attributes: {
                    general_rate: 'Allgemeine Qualifikation',
                    followers: 'Anhänger',
                    event_followers: 'Follower-Ereignis',
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
                  name: 'Zusammenfassung',
                },
                next_shows: {
                  name: 'Nächsten Shows',
                },
                past_shows: {
                  name: 'Vergangenen Shows',
                },
              },
            },
          },
        },
      },
      HomePage: {
        welcome: 'Willkomen',
        news: 'Neu',
        artists: 'Artists',
        events: 'Ereignisses',
        places: 'Örtlichkeit',
        industry_offer: {
          title: 'Bist du Teil der Musikindustrie?',
          call_to_action: 'Erfahre mehr über unser Angebot',
        },
      },
      EventsPages: {
        EventDetailsPage: {
          subpages: {
            general: {
              name: 'Info',
              sections: {
                general: {
                  name: 'Allgemein',
                  attributes: {
                    national_code: 'PULEP',
                    timetable__initial_date: 'Wann?',
                    initial_time: 'Startzeit',
                    minimumAge: 'Mindestalter',
                    timetable__openning_doors: 'Tür öffnen',
                    promoter: 'Promoter',
                    tickets_website: 'Tickets-Website',
                  },
                },
                description: {
                  name: 'Beschreibung',
                },
                genres: {
                  name: 'Genres',
                },
              },
            },
            artists: {
              name: 'Künstler',
              sections: {
                main_artists: { name: 'Hauptkünstler' },
              },
            },
            place: {
              name: 'Örtlichkeit',
              sections: {
                location: {
                  name: 'Standort',
                },
              },
            },
            contact: {
              name: 'Kontakt & Media',
              sections: {
                contact: {
                  name: 'Kontaktinformation',
                },
                social_networks: {
                  name: 'Sozialen Medien',
                },
              },
            },
            extra_info: {
              name: 'Extras',
              sections: {
                additional_info: { name: 'Zusatzinfo' },
                dress_code: { name: 'Kleiderordnung' },
                discounts: { name: 'Rabatte' },
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
              name: 'Generale',
              sections: {
                gallery: {
                  name: 'Galleria',
                },
                general: {
                  name: 'Info generale',
                  attributes: {
                    description: 'Beschreibung',
                    address: 'Adresse',
                    city: 'Stadt',
                    cityWithCountry: 'Ort',
                    categories: 'Kategorien',
                    since: 'Seit',
                    spoken_languages: 'Gesprochene Sprachen',
                    stage_languages: 'Bühnensprachen',
                    arts_languages: 'Sprachen der Kunst',
                  },
                },
                genres: {
                  name: 'Genres',
                },
                contact: {
                  name: 'Contatto',
                  attributes: {
                    website: 'Website',
                    email: 'e-mail',
                    phone: 'Telefono',
                    mobile_phone: 'Cellulare',
                    whatsapp: 'WhatsApp',
                  },
                },
                social_networks: {
                  name: 'Reti Sociali',
                },
              },
            },
            stats: {
              name: 'Statistics',
              sections: {
                social_network_presence: {
                  name: 'Presenza sui social network',
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
                  name: 'Prossimi spettacoli',
                },
                past_shows: {
                  name: 'Spettacoli passati',
                },
              },
            },
            backline: {
              name: 'Backline',
              sections: {
                sound_backline: {
                  name: 'Sound Backline',
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
    },
    appbase: {
      betabar: {
        contact_us: 'Kontaktiere uns',
        disclaimer:
          'Du siehst gerade eine Testversion unserer Plattform. Wir hoffen, sie gefällt dir. Du kannst dich über den unten stehenden Button mit uns in Verbindung setzen.',
        our_email_is: 'Unsere E-Mail ist:',
      },
      footer: {
        columns: {
          what_we_do: {
            name: 'Was machen wir?',
            options: {
              cultural_agenda: 'Kulturagenda',
              for_academies: 'Für Akademien',
              for_artists: 'Für Künstler',
              for_places: 'Für Orte',
              for_promoters: 'Für Promoter',
              for_festivals: 'Für Festivals',
            },
          },
          about_us: {
            name: 'Über uns',
            options: {
              history: 'Unsere Geschichte',
              press: 'Presse',
              career: 'Werdegang',
              download: 'App herunterladen',
              data_policy: 'Datenrichtlinie',
            },
          },
          help: {
            name: 'Hilfe',
            options: {
              help_center: 'Hilfezentrum',
              contact_us: 'Kontaktiere uns',
              report: 'Bericht',
            },
          },
        },
        copywrite: {
          allRightsReserved: 'Alle Rechte vorbehalten',
        },
      },
      search: {
        empty_results: {
          title: 'Es gibt keine Ergebnisse, die Ihrer Suche entsprechen',
          suggestions: {
            statement: 'Probieren Sie einen der folgenden Vorschläge aus',
            spelling: 'Überprüfe deine Rechtschreibung',
            less_words: 'Verwenden Sie allgemeinere Wörter oder weniger Wörter',
            related_things: 'Durchsuchen Sie die Kategorien, um ähnliche Elemente zu finden',
          },
        },
        filters: {
          title: 'Filter',
          subpages: {
            general: {
              name: 'Allgemein',
              sections: {
                general: {
                  name: 'Allgemein',
                  attributes: {
                    genres: 'Genres',
                    cityWithCountry: 'Wo?',
                  },
                },
                dates: {
                  name: 'Termine',
                  attributes: {
                    date: 'Wann?',
                  },
                },
                languages: {
                  name: 'Sprachen',
                  attributes: {
                    spoken_languages: 'Gesprochene Sprachen',
                    stage_languages: 'Bühnensprachen',
                    arts_languages: 'Kunstsprachen',
                  },
                },
              },
            },
            artists: {
              name: 'Künstler',
              sections: {
                general: {
                  name: 'Allgemein',
                  attributes: {
                    is_available_at: 'Verfügbar in?',
                    has_albums: 'Hat Alben?',
                    music_awards: 'Auszeichnungen',
                  },
                },
                rating: {
                  name: 'Bewertung',
                  attributes: {
                    overall: 'Insgesamt',
                    talent: 'Talent',
                    performance: 'Aufführung',
                  },
                },
              },
            },
            places: {
              name: 'Orte',
              sections: {
                stage: {
                  name: 'Bühne',
                  attributes: {
                    stage_width: 'Breite',
                    stage_length: 'Länge',
                    stage_height: 'Höhe',
                  },
                },
                backline: {
                  name: 'Backline',
                  attributes: {
                    mics: 'Mikrofone',
                  },
                },
              },
            },
            social_networks: {
              name: 'Soziale Netzwerke',
              sections: {
                presence: {
                  name: 'Präsenz',
                  attributes: {
                    has_social_networks: 'Hat dieses Netzwerke?',
                  },
                },
              },
            },
          },
        },

        not_found_results: 'Keine Ergebnisse gefunden',
        recommendations: 'Empfehlungen',
        result_view_types: {
          list: 'Liste',
          map: 'Karte',
        },
        results: 'Ergebnisse',
        search: 'Suche',
        search_placeholder: 'Künstler, Ereignisse, Orte...',
        see_more: 'Mehr sehen',
        what_are_you_looking_for: 'Was suchst du?',
        types: {
          ARTISTS: 'Künstler',
          PLACES: 'Orte',
          EVENTS: 'Ereignisse',
        },
        type_your_search: 'Schreiben Sie Ihre Suche',
      },
      sidenav: {
        name: 'Hauptmenü',
        sections: {
          general: {
            name: 'Allgemein',
            options: {
              home: 'Home',
              cultural_agenda: 'Kulturagenda',
              search: 'Suchen',
            },
          },
          myInfo: {
            name: 'Meine Info',
            options: {
              inbox: 'Posteingang',
              'inbox.nested': {
                incoming: 'Eingehend',
                sent: 'Gesendet',
              },
              my_profile: 'Mein Profil',
              my_bands: 'Meine Bands',
              'my_bands.nested': { create: 'Band erstellen' },
              my_events: 'Meine Veranstaltungen',
              'my_events.nested': { create: 'Veranstaltungen erstellen' },
              my_riders: 'Meine Rider',
              my_places: 'Meine Orte',
              'my_places.nested': { create: 'Ort erstellen' },
              favourites: 'Favoriten',
              'favourites.nested': {
                saved: 'Gespeichert',
                tour_planning: 'Tourplanung',
              },
            },
          },
          settings: {
            name: 'Einstellungen',
            options: {
              settings: 'Einstellungen',
              help_center: 'Hilfebereich',
              report: 'Bericht',
              send_comments: 'Kommentare senden',
              logout: 'Abmelden',
            },
          },
        },
      },
    },
  },
};
