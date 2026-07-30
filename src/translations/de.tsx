export const DeMessages = {
  app: {
    name: 'App DE',
    loading: 'Wird geladen',
    general: {
      not_found_page: {
        title: 'Hoppla! Wir konnten nicht finden, wonach Sie suchen',
      },
      component_error: {
        message: 'Diese Komponente konnte nicht geladen werden.',
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
        edit: 'Bearbeiten',
        follow_us: 'Folge uns',
        save: 'Speichern',
        cancel: 'Abbrechen',
        link_copied_to_clipboard: 'Link in die Zwischenablage kopiert',
        navigation: {
          back: 'Zurück',
          first: 'Erste',
          home: 'Startseite',
          last: 'Letzte',
          next: 'Nächste',
          previous: 'Vorherige',
          refresh: 'Aktualisieren',
          submit: 'Absenden',
          cancel: 'Abbrechen',
          close: 'Schließen',
          open: 'Öffnen',
          save: 'Speichern',
        },
        report: 'Bericht',
        share: 'Teilen',
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
        prebooking_requests: { plural: 'Vorreservierungen', singular: 'Vorreservierung' },
        users: {
          plural: 'Benutzer',
          singular: 'Benutzer',
          attributes: {
            agrees_to_a_blood_transfusion: {
              label: 'Akzeptieren Sie Bluttransfusionen?',
              values: {
                true: 'Akzeptiert Bluttransfusionen',
                false: 'Akzeptiert keine Bluttransfusionen',
              },
            },
          },
        },
      },
      errors: {
        // Data error
        NOT_AVAILABLE: 'Nicht verfügbar',

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
        AUTH_LOGIN_REQUIRED: 'Sie müssen sich anmelden, um diesen Inhalt zu sehen.',

        // Errores de Red
        NETWORK_ERROR: 'Netzwerkfehler',
        NETWORK_TIMEOUT: 'Netzwerk-Zeitüberschreitung',
        NETWORK_NOT_CONNECTED: 'Keine Netzwerkverbindung',

        // Errores de Validación
        VALIDATION_EMAIL_INVALID: 'Ungültige E-Mail-Adresse',
        VALIDATION_PASSWORD_WEAK: 'Schwaches Passwort',
        VALIDATION_FIELD_REQUIRED: 'Feld erforderlich',
        VALIDATION_USERNAME_TAKEN: 'Benutzername bereits vergeben',
        VALIDATION_USERNAME_FORMAT:
          'Der Benutzername darf nur Kleinbuchstaben, Ziffern, Unterstriche und Punkte enthalten (3-24 Zeichen, keine Leerzeichen).',

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
      forms: {
        validation_error: 'Bitte überprüfe die markierten Felder, bevor du das Formular sendest.',
        submit_error: 'Wir konnten die Änderungen nicht speichern. Bitte versuche es erneut.',
        submit_error_duplicate_key: 'Dieser Benutzername ist bereits vergeben. Bitte wähle einen anderen.',
        submit_error_validation: 'Einige Pflichtfelder fehlen oder sind ungültig. Bitte überprüfe das Formular.',
      },
      follows: {
        followers: 'Follower',
        following: 'Folgt',
        in_common: 'Gemeinsam',
        errors: {
          NO_FOLLOWING: 'Dieses Profil folgt niemandem.',
          NO_FOLLOWERS: 'Dieses Profil hat keine Follower.',
          NO_COMMON_FOLLOWERS: 'Keine gemeinsamen Follower.',
        },
      },
      prebooking: {
        title: 'Vorreservierungen',
        singular: 'Vorreservierung',
        create: 'Vorreservierung erstellen',
        create_short: 'Neue Vorreservierung',
        dashboard: 'Vorreservierungs-Dashboard',
        status: {
          DRAFT: 'Entwurf',
          PENDING: 'Ausstehend',
          PARTIALLY_VIEWED: 'Teilweise angesehen',
          PARTIALLY_ACCEPTED: 'Teilweise akzeptiert',
          ALL_ACCEPTED: 'Alle akzeptiert',
          REJECTED: 'Abgelehnt',
          CANCELLED: 'Storniert',
          CONVERTED: 'In Veranstaltung umgewandelt',
          EXPIRED: 'Abgelaufen',
        },
        approval_status: {
          ALL_PENDING: 'Alle ausstehend',
          PARTIAL: 'Teilweise',
          ALL_APPROVED: 'Alle genehmigt',
          REJECTED: 'Abgelehnt',
        },
        participant_status: {
          pending: 'Ausstehend',
          viewed: 'Gesehen',
          interested: 'Interessiert',
          not_interested: 'Nicht interessiert',
        },
        request_type: {
          single_date: 'Einzelnes Datum',
          date_range: 'Datumsbereich',
          week: 'Woche',
          month: 'Monat',
          quarter: 'Quartal',
        },
        fields: {
          event_name: 'Veranstaltungsname',
          description: 'Beschreibung',
          requested_date_start: 'Startdatum',
          requested_date_end: 'Enddatum',
          request_type: 'Reservierungstyp',
          flexible_dates: 'Flexible Daten',
          alternative_dates: 'Alternative Daten',
          expected_attendance: 'Erwartete Teilnehmerzahl',
          response_deadline: 'Antwortfrist',
          requester: 'Antragsteller',
          recipients: 'Empfänger',
          additional_participants: 'Zusätzliche Teilnehmer',
          notes: 'Notizen',
          participants: 'Teilnehmer',
        },
        actions: {
          approve: 'Genehmigen',
          reject: 'Ablehnen',
          cancel: 'Stornieren',
          convert_to_event: 'In Veranstaltung umwandeln',
          edit: 'Bearbeiten',
          add_note: 'Notiz hinzufügen',
          view_details: 'Details anzeigen',
          send_request: 'Anfrage senden',
        },
        tabs: {
          received: 'Empfangen',
          sent: 'Gesendet',
          all: 'Alle',
          pending: 'Ausstehend',
          accepted: 'Akzeptiert',
          rejected: 'Abgelehnt',
        },
        messages: {
          create_success: 'Vorreservierung erfolgreich erstellt',
          approve_success: 'Vorreservierung erfolgreich genehmigt',
          reject_success: 'Vorreservierung abgelehnt',
          cancel_success: 'Vorreservierung storniert',
          convert_success: 'Vorreservierung erfolgreich in Veranstaltung umgewandelt',
          update_success: 'Vorreservierung aktualisiert',
          no_requests_found: 'Keine Vorreservierungen gefunden',
          requires_action: 'Erfordert Ihre Aktion',
          approval_progress: '{approved} von {total} genehmigt',
          deadline_warning: 'Läuft in {days} Tagen ab',
          expired: 'Diese Anfrage ist abgelaufen',
        },
        errors: {
          create_failed: 'Fehler beim Erstellen der Vorreservierung',
          load_failed: 'Fehler beim Laden der Vorreservierungen',
          approve_failed: 'Fehler beim Genehmigen',
          reject_failed: 'Fehler beim Ablehnen',
          cancel_failed: 'Fehler beim Stornieren',
          convert_failed: 'Fehler beim Umwandeln in Veranstaltung',
          no_permission: 'Sie haben keine Berechtigung für diese Aktion',
          already_responded: 'Sie haben bereits auf diese Anfrage geantwortet',
          invalid_dates: 'Die ausgewählten Daten sind ungültig',
          past_date: 'Keine Reservierung für ein vergangenes Datum möglich',
        },
        tooltips: {
          flexible_dates: 'Ermöglicht das Vorschlagen alternativer Daten',
          auto_approved: 'Automatisch beim Erstellen genehmigt',
          requires_all_types: 'Erfordert mindestens eine Genehmigung von jedem Profiltyp',
          can_cancel: 'Nur der Antragsteller kann stornieren',
          can_convert: 'Kann umgewandelt werden, wenn alle genehmigen',
        },
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
      social_networks_analytics: {
        metrics: {
          followers: 'Follower',
          subscribers: 'Abonnenten',
          monthly_listeners: 'Monatliche Hörer',
          total_streams: 'Gesamte Streams',
          save_rate: 'Speicherrate',
          radio_streams: 'Radio-Streams',
          playlist_reach: 'Playlist-Reichweite',
          posts: 'Beiträge',
          avg_likes: 'Durchschnittliche Likes',
          engagement_rate: 'Engagement-Rate',
          avg_reach: 'Durchschnittliche Reichweite',
          total_likes: 'Gesamte Likes',
          videos_published: 'Veröffentlichte Videos',
          video_views: 'Videoaufrufe',
          posts_content: 'Inhaltsbeiträge',
          shares: 'Geteilt',
          total_views: 'Gesamtaufrufe',
          monthly_video_views: 'Monatliche Videoaufrufe',
          watch_time: 'Wiedergabezeit',
          new_subscribers: 'Neue Abonnenten',
          page_likes: 'Seiten-Likes',
          weekly_reach: 'Wöchentliche Reichweite',
          engagement: 'Engagement',
          tweets: 'Tweets',
          monthly_impressions: 'Monatliche Impressionen',
          mentions: 'Erwähnungen',
          total_plays: 'Gesamte Wiedergaben',
          stations_featuring_artist: 'Sender mit diesem Künstler',
          thumbs_up: 'Daumen hoch',
          shazams: 'Shazams',
        },
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
          proffesionalism: 'Professionalismus',
          stage_presence: 'Bühnenpräsenz',
          charisma: 'Charisma',
          respectfulness: 'Respekt',
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
        AdminPendingProfilesPage: {
          title: 'Überprüfung ausstehender Profile',
          unauthorized: {
            title: 'Zugriff verweigert',
            description: 'Sie haben keine Berechtigung, diese Seite anzuzeigen.',
          },
          sections: {
            artists: {
              title: 'Ausstehende Künstler',
            },
            places: {
              title: 'Ausstehende Orte',
            },
          },
          table: {
            name: 'Name',
            username: 'Benutzername',
            location: 'Standort',
            created_at: 'Eingereicht am',
            actions: 'Aktionen',
          },
          actions: {
            approve: 'Genehmigen',
            reject: 'Ablehnen',
          },
          empty_state: 'Keine ausstehenden Profile zur Überprüfung',
          error: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
        },
        LoginPage: {
          paragraph1:
            'Du siehst gerade eine Testversion unserer Plattform. Derzeit ist die Benutzerregistrierung begrenzt.',
          paragraph2:
            'Wenn du dich dem Künstlerkollektiv anschließen möchtest, laden wir dich ein, dich zu registrieren, indem du auf den folgenden Button klickst.',
          paragraph3:
            'Denke daran, dass du dich entweder als Teil des Musikökosystems oder als Fan registrieren kannst. Registriere dich und behalte den Kulturkalender im Blick. Du erhältst Benachrichtigungen und Hinweise zu Veranstaltungen, die dich interessieren.',
          button: 'Registriere mich in der Testversion',
        },
        UsersPages: {
          UsersDetailsPage: {
            fillProfileBanner: {
              content:
                'Bevor du weiterhin alle Vorteile von Artist Hive nutzen kannst, musst du dein persönliches Profil vervollständigen.',
            },
            subpages: {
              general: {
                name: 'Allgemein',
                sections: {
                  general: {
                    name: 'Allgemeine Informationen',
                    attributes: {
                      given_names: 'Vornamen',
                      surnames: 'Nachname',
                      stage_name: 'Künstlername',
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
                },
              },
              artist_info: {
                name: 'Info Pro',
                sections: {
                  emergency_contact: {
                    name: 'Notfallkontakt',
                  },
                  artists_info: {
                    name: 'Künstlerinformationen',
                    attributes: {
                      user_language: 'Benutzersprache',
                      spoken_languages: 'Gesprochene Sprachen',
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
                    attributes: {
                      played_instruments: 'Gespielte Instrumente',
                    },
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
                    name: 'Preise',
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
                    name: 'Bevorstehende Shows',
                  },
                  past_shows: {
                    name: 'Vergangene Shows',
                  },
                },
              },
              my_liked_shows: {
                name: 'Meine Lieblings-Veranstaltungen',
                sections: {
                  next_shows: {
                    name: 'Bevorstehende Shows',
                  },
                  past_shows: {
                    name: 'Vergangene Shows',
                  },
                },
              },
            },
          },
          activate_industry_banner: {
            banner: {
              title: 'Bist du Mitglied der Musikbranche?',
              content: 'Greife auf alle Tools für Künstler, Agenten, Veranstaltungsorte und andere Fachleute zu.',
            },
            button: 'Jetzt aktivieren',
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
                name: 'Allgemein',
                sections: {
                  gallery: {
                    name: 'Galerie',
                  },
                  general: {
                    name: 'Allgemeine Informationen',
                    attributes: {
                      description: 'Beschreibung',
                      address: 'Adresse',
                      city: 'Stadt',
                      categories: 'Kategorien',
                      since: 'Seit',
                      spoken_languages: 'Gesprochene Sprachen',
                    },
                  },
                  contact: {
                    name: 'Kontakt',
                    attributes: {
                      website: 'Website',
                      email: 'E-Mail',
                      phone: 'Telefon',
                      mobile_phone: 'Mobiltelefon',
                      whatsapp: 'WhatsApp',
                    },
                  },
                  social_networks: {
                    name: 'Soziale Netzwerke',
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
                      general_rate: 'Allgemeine Bewertung',
                      followers: 'Followers',
                      event_followers: 'Veranstaltungs-Follower',
                    },
                  },
                },
              },
              shows: {
                name: 'Shows',
                sections: {
                  next_shows: {
                    name: 'Kommende Shows',
                  },
                  past_shows: {
                    name: 'Vergangene Shows',
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
                  main_course: { name: 'Hauptgericht' },
                  second_course: { name: 'Zweites Gericht' },
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
        IndustryPages: {
          CreateIndustryEntityPage: {
            title: 'Mitglied der Musikindustrie',
            intro:
              'Danke für dein Interesse, dich als Mitglied der Musikindustrie zu registrieren, sei es als Künstler, Agent, Venue-Besitzer, Probenraum oder andere Einrichtung.',
            intro_secondary: 'Suche dein Profil, falls es bereits im System existiert, oder erstelle ein neues, um loszulegen.',
            search_section: {
              title: 'Suche dein Profil',
              input_placeholder: 'Name des Künstlers oder Ortes...',
              search_button: 'Suchen',
              artists_found: 'Das sind die verwandten Künstler',
              places_found: 'Das sind die verwandten Orte',
            },
            create_section: {
              title: 'Oder erstelle ein neues Profil',
            },
            reset_section: {
              remove_artists_button: 'Meine Künstlerprofile entfernen',
              remove_places_button: 'Meine Ortsprofile entfernen',
              confirm_title: 'Aktion bestätigen',
              confirm_content:
                'Diese Aktion entfernt die Verknüpfung aller deiner Profile dieses Typs mit deinem Konto. Die Profile selbst werden nicht gelöscht, erscheinen aber nicht mehr in deinen Mitgliedschaften. Möchtest du fortfahren?',
              confirm_action: 'Ja, entfernen',
              cancel_action: 'Abbrechen',
            },
          },
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
                    name: 'Fernverkehr',
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
                    email: 'E-Mail',
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
            members: {
              name: 'Mitglieder',
              sections: {
                music_performance: {
                  name: 'Instrumente',
                },
                audio_engineering: {
                  name: 'Tontechnik',
                },
                visual_arts: {
                  name: 'Visuelles',
                },
                management: {
                  name: 'Management',
                },
                production: {
                  name: 'Produktion',
                },
                support: {
                  name: 'Support',
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
                    top_tracks: 'Beliebte Titel',
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
                    event_followers: 'Event-Follower',
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
                  attributes: {
                    priceRange: 'Preise',
                  },
                },
                next_shows: {
                  name: 'Nächste Shows',
                },
                past_shows: {
                  name: 'Vergangene Shows',
                },
              },
            },
            followers: {
              name: 'Followers',
            },
          },
        },
      },
      HomePage: {
        welcome: 'Willkommen',
        news: 'Neu',
        artists: 'Künstler',
        events: 'Veranstaltungen',
        places: 'Orte',
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
                other_artists: { name: 'Andere Künstler' },
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
            tickets: {
              name: 'Tickets',
              sections: {
                general: {
                  name: 'Allgemeine Informationen',
                  attributes: {
                    tickets_website: 'Ticket-Website',
                    price: 'Preis',
                  },
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
              name: 'Allgemein',
              sections: {
                gallery: {
                  name: 'Galerie',
                },
                general: {
                  name: 'Allgemeine Informationen',
                  attributes: {
                    description: 'Beschreibung',
                    address: 'Adresse',
                    city: 'Stadt',
                    cityWithCountry: 'Ort',
                    categories: 'Kategorien',
                    since: 'Seit',
                    spoken_languages: 'Gesprochene Sprachen',
                    stage_languages: 'Bühnensprachen',
                    arts_languages: 'Kunstsprachen',
                    activity: 'Ist es aktiv?',
                    has_open_mic: 'Hat es ein offenes Mikrofon?',
                    total_audience_capacity: 'Max. Kapazität',
                    bookingRatesPolicy: 'Buchungsrichtlinien',
                    regulatory_closing_time: 'Behördliche Schließzeit',
                  },
                },
                genres: {
                  name: 'Genres',
                },
                contact: {
                  name: 'Kontakt',
                  attributes: {
                    website: 'Webseite',
                    email: 'E-Mail',
                    phone: 'Telefon',
                    mobile_phone: 'Mobiltelefon',
                    whatsapp: 'WhatsApp',
                  },
                },
                social_networks: {
                  name: 'Soziale Netzwerke',
                },
              },
            },
            stats: {
              name: 'Statistiken',
              sections: {
                social_network_presence: {
                  name: 'Präsenz in sozialen Netzwerken',
                },
                rating: {
                  name: 'Bewertung',
                },
              },
            },
            shows: {
              name: 'Shows',
              sections: {
                next_shows: {
                  name: 'Kommende Shows',
                },
                past_shows: {
                  name: 'Vergangene Shows',
                },
              },
            },
            backline: {
              name: 'Backline',
              sections: {
                sound_backline: {
                  name: 'Sound-Backline',
                },
                light_backline: {
                  name: 'Licht-Backline',
                },
              },
            },
            menu: {
              name: 'Menü',
              sections: {
                main_course: {
                  name: 'Hauptgericht',
                },
                second_course: {
                  name: 'Zweites Gericht',
                },
              },
            },
            followers: {
              name: 'Followers',
            },
          },
        },
      },
      OpenCallsListPage: {
        subpages: {
          active: { name: 'Aktive Open-Calls' },
          past: { name: 'Vergangene Open-Calls' },
          available: { name: 'Verfügbar' },
          applications: { name: 'Meine Bewerbungen' },
        },
        attributes: {
          event_name: 'Name der Veranstaltung',
          event_date: 'Veranstaltungsdatum',
          start_date: 'Beginn',
          end_date: 'Ende',
          status: 'Status',
          applications_count: 'Bewerbungen',
          city: 'Stadt',
          genres: 'Genres',
          application_status: 'Status deiner Bewerbung',
        },
      },
      OpenCallDetailsPage: {
        event_label: 'Veranstaltung',
        open_until_label: 'Bewerbungen offen bis',
        applications_received_suffix: 'erhaltene Bewerbungen',
        applications_received_title: 'Erhaltene Bewerbungen',
        your_application_title: 'Deine Bewerbung',
        no_applications_yet: 'Für diese Ausschreibung liegen noch keine Bewerbungen vor.',
        not_applied_yet: 'Du hast dich für diese Ausschreibung noch nicht beworben.',
        loading_applications: 'Bewerbungen werden geladen...',
        loading_your_application: 'Deine Bewerbung wird geladen...',
        unauthorized_message: 'Melde dich mit einem Artist- oder Place-Profil an, um die Bewerbungen dieser Ausschreibung zu sehen.',
        back_button: 'Zurück zu meinen Ausschreibungen',
        status: {
          pending: 'Ausstehend',
          accepted: 'Angenommen',
          rejected: 'Abgelehnt',
        },
        actions: {
          accept: 'Annehmen',
          reject: 'Ablehnen',
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
      claimProfileBanner: {
        PROFILE_AUTO_GENERATED_CAPTION:
          'Dieses Profil wurde mit öffentlich verfügbaren Informationen aus dem Internet erstellt. Ist es deins? Fordere dein kostenloses Profil an, um es zu verwalten und zu aktualisieren.',
        PROFILE_CONFIRMATION_MESSAGE:
          'Vielen Dank für dein Interesse an der Übernahme dieses Profils. Durch Klicken auf die Schaltfläche „Profil übernehmen“ gibst du uns die Erlaubnis, den Validierungsprozess zur Eigentumsprüfung in deinem Namen zu starten. Sobald das Eigentum bestätigt ist, erhältst du Zugriff auf das Profil mit Administratorrechten, damit du mit deinen Fans und der Musikbranche über alle Tools von Artist Hive interagieren kannst. <br />Bitte beachte, dass der Validierungsprozess zwischen 5 und 10 Werktagen dauern kann. Wir benachrichtigen dich per E-Mail oder über die sozialen Netzwerke des Profils.',
        CLAIM_REQUEST_CONFIRMATION:
          'Deine Anfrage wurde erfolgreich registriert. Wir werden dich per E-Mail oder über soziale Netzwerke kontaktieren, sobald sie bearbeitet wurde.',
        CLAIM_BUTTON: 'Profil übernehmen',
      },
      reportProfileForm: {
        title: 'Profil melden',
        reason_label: 'Grund der Meldung',
        reasons: {
          DUPLICATE: 'Doppeltes Profil',
          FAKE: 'Gefälschtes Profil',
          WRONG_INFO: 'Falsche Informationen',
          BELONGS_TO_ME: 'Dieses Profil gehört mir, ist aber einer anderen Person zugewiesen',
          INAPPROPRIATE_CONTENT: 'Unangemessener Inhalt',
          OTHER: 'Sonstiges',
        },
        description_label: 'Beschreibung (optional)',
        description_placeholder: 'Erzähl uns mehr Details zu dieser Meldung',
        submit_button: 'Meldung senden',
        success_message: 'Deine Meldung wurde gesendet. Danke, dass du hilfst, die Plattform sicher zu halten.',
        error_message: 'Beim Senden deiner Meldung ist ein Fehler aufgetreten. Bitte versuche es erneut.',
        duplicate_pending_error: 'Du hast bereits eine ausstehende Meldung für dieses Profil.',
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
            },
          },
          help: {
            name: 'Hilfe',
            options: {
              data_policy: 'Datenrichtlinie',
              terms: 'Nutzungsbedingungen',
              help_center: 'Hilfezentrum',
              contact_us: 'Kontaktiere uns',
              report: 'Bericht',
            },
          },
        },
        copyright: {
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
              opportunities: 'Gelegenheiten',
              search: 'Suchen',
            },
          },
          industry: {
            name: 'Musikindustrie',
            options: {
              industry_member: 'Bist du Teil der Musikindustrie?',
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
              crew: 'Meine Crew',
              my_profile: 'Mein Profil',
              my_bands: 'Meine Bands',
              'my_bands.nested': { create: 'Band erstellen' },
              my_events: 'Meine Veranstaltungen',
              'my_events.nested': { create: 'Veranstaltungen erstellen' },
              my_riders: 'Meine Rider',
              my_open_calls: 'Meine Open-Calls',
              my_places: 'Meine Orte',
              'my_places.nested': { create: 'Ort erstellen' },
              favourites: 'Favoriten',
              'favourites.nested': {
                saved: 'Gespeichert',
                tour_planning: 'Tourplanung',
              },
              my_prebooking_requests: 'Meine Anfragen',
              my_calendar: 'Mein Kalender',
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
      memberships_list: {
        approval_status: {
          pending: 'Ausstehende Überprüfung',
          rejected: 'Abgelehnt',
        },
      },
    },
  },
};
