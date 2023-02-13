export const DeMessages = {
  app: {
    name: "App DE",
    loading: "Wird geladen",
    general: {
      not_found_page: {
        title: "Hoppla! Wir konnten nicht finden, wonach Sie suchen",
      },
    },
    global_dictionary: {
      genders: {
        male: "Mann",
        female: "Frau",
        non_binary: "Nicht binär",
        non_specified: "Nicht spezifiziert",
      },
    },
    pages: {
      app: {
        settings: {
          title: "Einstellungen",
          language_selection: {
            title: "Sprachauswahl",
          },
          user_profile: {
            title: "Benutzerprofil",
            user: "Benutzer",
            logout: "Ausloggen",
            logged_user: "Angemeldeter Benutzer",
            empty_user: "Es gibt keinen Benutzer",
            user_info: "Benutzerinfo",
            roles: "Rollen",
            artist: "Künstler",
            place: "Ort",
          },
        },
      },

      app_base: {
        UsersPages: {
          UsersDetailsPage: {
            subpages: {
              general: {
                name: "Allgemein",
                sections: {
                  general: {
                    name: "Allgemeine Informationen",
                    attributes: {
                      fullname: "Vollständiger Name",
                    },
                  },
                  contact: {
                    name: "Kontakt",
                  },
                  emergency_contact: {
                    name: "Notfallkontakt",
                  },
                },
              },
              arts: {
                name: "Kunst",
                sections: {
                  music: {
                    name: "Musik",
                  },
                  dance: {
                    name: "Tanz",
                  },
                  photography: {
                    name: "Fotografie",
                  },
                  video: {
                    name: "Video",
                  },
                  painting: {
                    name: "Malerei",
                  },
                  poetry: {
                    name: "Poesie",
                  },
                  standup_comedy: {
                    name: "Standup-Comedy",
                  },
                  awards: {
                    name: "Preis",
                  },
                },
              },
              memberships: {
                name: "Mitgliedschaften",
                sections: {
                  artists: {
                    name: "Künstler",
                  },
                  places: {
                    name: "Orte",
                  },
                },
              },
              shows: {
                name: "Meine Veranstaltungen",
                sections: {
                  my_liked_shows: {
                    name: "Meine Abonnements",
                  },
                  next_shows: {
                    name: "Bevorstehende Sendungen",
                  },
                  past_shows: {
                    name: "Vergangene Shows",
                  },
                },
              },
            },
          },
        },
      },
      ArtistsPages: {
        ArtistsDetailsPage: {
          subpages: {
            general: {
              name: "Allgemeine",
              sections: {
                general: {
                  name: "Allgemeine Informationen",
                  attributes: {
                    description: "",
                    since: "Seit",
                    home_city: "Stadt der Niederlassung",
                    categories: "Kategorien",
                    genres: "Genres",
                    spoken_languages: "Gesprochene Sprachen",
                    stage_languages: "Sprachen auf der Bühne",
                    arts_languages: "Sprachen der Künste",
                  },
                },
                contact: {
                  name: "Kontakt",
                  attributes: {
                    website: "Webseite",
                    email: "e-mail",
                    phone: "Telefon",
                    mobile_phone: "Mobiltelefon",
                    whatsapp: "WhatsApp",
                  },
                },
                social_networks: {
                  name: "Soziale Netzwerke",
                },
                record_label: {
                  name: "Plattenfirma",
                },
                members: {
                  name: "Mitglieder",
                },
              },
            },
            arts: {
              name: "Künste",
              sections: {
                discography: {
                  name: "Diskographie",
                  attributes: {
                    albums: "Alben",
                    dvd_video: "DVD / Video",
                  },
                },
                media_channels: {
                  name: "Medienkanäle",
                },
                gallery: {
                  name: "Galerie",
                  attributes: {
                    photos: "Fotos",
                    video: "Video",
                  },
                },
                awards: {
                  name: "Auszeichnungen",
                },
              },
            },
            social: {
              name: "Sozial",
              sections: {
                social_network_presence: {
                  name: "Präsenz in sozialen Netzwerken",
                },
                stats: {
                  name: "Statistiken",
                  attributes: {
                    general_rate: "Allgemeine Qualifikation",
                    followers: "Anhänger",
                    event_followers: "Follower-Ereignis",
                  },
                },
              },
            },
            shows: {
              name: "Shows",
              sections: {
                next_shows: {
                  name: "Nächsten Shows",
                },
                past_shows: {
                  name: "Vergangenen Shows",
                },
              },
            },
          },
        },
      },
      HomePage: {
        welcome: "Willkomen",
        news: "Neu",
        artists: "Artists",
        events: "Ereignisses",
        places: "Örtlichkeit",
      },
      EventsPages: {
        EventDetailsPage: {
          subpages: {
            general: {
              name: "Info",
              sections: {
                general: {
                  name: "Allgemein",
                  attributes: {
                    national_code: "PULEP",
                    timetable__initial_date: "Wann?",
                    initial_time: "Startzeit",
                    minimumAge: "Mindestalter",
                    timetable__openning_doors: "Tür öffnen",
                    promoter: "Promoter",
                  },
                },
                description: {
                  name: "Beschreibung",
                },
              },
            },
            artists: {
              name: "Künstler",
              sections: {
                main_artists: { name: "Hauptkünstler" },
              },
            },
            place: {
              name: "Örtlichkeit",
              sections: {
                location: {
                  name: "Standort",
                },
              },
            },
            contact: {
              name: "Kontakt & Media",
              sections: {
                contact: {
                  name: "Kontaktinformation",
                },
                social_networks: {
                  name: "Sozialen Medien",
                },
              },
            },
            extra_info: {
              name: "Extras",
              sections: {
                additional_info: { name: "Zusatzinfo" },
                dress_code: { name: "Kleiderordnung" },
                discounts: { name: "Rabatte" },
                promoter: { name: "Promoter" },
              },
            },
          },
        },
      },
      PlacesPages: {
        PlacesDetailsPage: {
          subpages: {
            general: {
              name: "Generale",
              sections: {
                gallery: {
                  name: "Galleria",
                },
                general: {
                  name: "Info generale",
                  attributes: {
                    description: "",
                    address: "Indirizzo",
                    city: "Città",
                    categories: "Categorie",
                    since: "Da",
                    spoken_languages: "Lingue parlate",
                  },
                },
                contact: {
                  name: "Contatto",
                  attributes: {
                    website: "Website",
                    email: "e-mail",
                    phone: "Telefono",
                    mobile_phone: "Cellulare",
                    whatsapp: "WhatsApp",
                  },
                },
                social_networks: {
                  name: "Reti Sociali",
                },
              },
            },

            social: {
              name: "Sociale",
              sections: {
                social_network_presence: {
                  name: "Presenza sui social network",
                },
                stats: {
                  name: "Statistiche",
                  attributes: {
                    general_rate: "Qualificazione generale",
                    followers: "Followers",
                    event_followers: "Eventi followers",
                  },
                },
              },
            },
            shows: {
              name: "Shows",
              sections: {
                next_shows: {
                  name: "Prossimi spettacoli",
                },
                past_shows: {
                  name: "Spettacoli passati",
                },
              },
            },
            backline: {
              name: "Backline",
              sections: {
                sound_backline: {
                  name: "Sound Backline",
                },
                light_backline: {
                  name: "Light Backline",
                },
              },
            },
            menu: {
              name: "Menu",
              sections: {
                main_course: { name: "Main course" },
                second_course: { name: "Second course" },
              },
            },
          },
        },
      },
    },
    appbase: {
      footer: {
        columns: {
          what_we_do: {
            name: "Was machen wir?",
            options: {
              cultural_agenda: "Kulturagenda",
              for_artists: "Für Künstler",
              for_places: "Für Orte",
              for_promoters: "Für Promoter",
              for_festivals: "Für Festivals",
            },
          },
          about_us: {
            name: "Über uns",
            options: {
              history: "Unsere Geschichte",
              press: "Presse",
              career: "Werdegang",
              download: "App herunterladen",
              data_policy: "Datenrichtlinie",
            },
          },
          help: {
            name: "Hilfe",
            options: {
              help_center: "Hilfezentrum",
              contact_us: "Kontaktiere uns",
              report: "Bericht",
            },
          },
        },
        copywrite: {
          allRightsReserved: "Alle Rechte vorbehalten",
        },
      },
      search: {
        not_found_results: "Keine Ergebnisse gefunden",
        recommendations: "Empfehlungen",
        results_list: "Ergebnisliste",
        search_placeholder: "Künstler, Ereignisse, Orte...",
        see_more: "Mehr sehen",
        types: {
          ARTISTS: "Künstler",
          PLACES: "Orte",
          EVENTS: "Ereignisse",
        },
        type_your_search: "Schreiben Sie Ihre Suche",
      },
      sidenav: {
        name: "Hauptmenü",
        sections: {
          general: {
            name: "Allgemein",
            options: {
              home: "Home",
              cultural_agenda: "Kulturagenda",
            },
          },
          myInfo: {
            name: "Meine Info",
            options: {
              inbox: "Posteingang",
              my_profile: "Meine Profil",
              my_bands: "Meine Bands",
              my_events: "Meine Veranstaltungen",
              my_riders: "Meine riders",
              my_places: "Meine Orte",
            },
          },
          settings: {
            name: "Einstellungen",
            options: {
              settings: "Einstellungen",
              help_center: "Hilfebereich",
              report: "Bericht",
              send_comments: "Kommentare senden",
              logout: "Abmelden",
            },
          },
        },
      },
    },
  },
};
