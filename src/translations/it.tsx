export const ItMessages = {
  app: {
    name: 'App IT',
    loading: 'Caricamento in corso',
    general: {
      not_found_page: {
        title: 'Oops! Non siamo riusciti a trovare quello che stai cercando',
      },
    },
    domain_global_dictionary: { errors: {} },
    global_dictionary: {
      artists_hive: {
        slogan: 'Crea, Connettiti, Vola...',
      },
      genders: {
        male: 'Uomo',
        female: 'Donna',
        non_binary: 'Non binario',
        non_specified: 'Non specificato',
      },
      art_types: {
        dance: 'Danza',
        music: 'Musica',
        painting: 'Pittura',
        poetry: 'Poesia',
        photography: 'Fotografia',
        standup_comedy: 'Cavaliere',
        theatre: 'Teatro',
        video: 'Video',
      },
      actions: {
        accounts: {
          create_account: 'Crea account',
          forgot_password: 'Password dimenticata',
          login: 'Accedi',
          password: 'Password',
          remember_me: 'Ricordami',
          signup: 'Registrati',
          username_or_email: 'Nome utente o email',
        },
        create: 'Creare',
        follow_us: 'Seguici',
        save: 'Salvare',
        cancel: 'Annulla',
        show_more: 'Mostra di più',
        show_less: 'Mostra di meno',
        submit: 'Invia',
        subscription: {
          subscribe: 'Iscriversi',
          unsubscribe: 'Disiscriversi',
        },
        upload: 'Carica',
      },
      entities: {
        academies: { plural: 'Accademie', singular: 'Accademia' },
        artists: { plural: 'Artisti', singular: 'Artista' },
        events: { plural: 'Eventi', singular: 'Evento' },
        places: { plural: 'Luoghi', singular: 'Luogo' },
        promoters: { plural: 'Promotori', singular: 'Promotore' },
      },
      errors: {
        // Data error
        NOT_AVAILABLE: 'Non disponibile',

        // Errores de Autenticación y Autorización
        AUTH_INVALID_CREDENTIALS: 'Credenziali non valide',
        AUTH_USER_NOT_FOUND: 'Utente non trovato',
        AUTH_NO_USER_PROVIDED: 'Nessun utente fornito',
        AUTH_NO_PASSWORD_PROVIDED: 'Nessuna password fornita',
        AUTH_NO_TOKEN_PROVIDED: 'Nessun token fornito',
        AUTH_WRONG_PASSWORD: 'Password errata',
        AUTH_TOKEN_EXPIRED: 'Token scaduto',
        AUTH_TOKEN_INVALID: 'Token non valido',
        AUTH_PERMISSION_DENIED: 'Permesso negato',
        AUTH_LOGIN_REQUIRED: 'Devi accedere per visualizzare questo contenuto.',

        // Errores de Red
        NETWORK_ERROR: 'Errore di rete',
        NETWORK_TIMEOUT: 'Timeout di rete',
        NETWORK_NOT_CONNECTED: 'Non connesso alla rete',

        // Errores de Validación
        VALIDATION_EMAIL_INVALID: 'Email non valida',
        VALIDATION_PASSWORD_WEAK: 'Password debole',
        VALIDATION_FIELD_REQUIRED: 'Campo obbligatorio',
        VALIDATION_USERNAME_TAKEN: 'Nome utente già in uso',

        // Errores de Usuario
        USER_PROFILE_NOT_FOUND: 'Profilo utente non trovato',
        USER_PROFILE_UPDATE_FAILED: 'Aggiornamento del profilo utente non riuscito',
        USER_ACCOUNT_SUSPENDED: 'Account utente sospeso',
        USER_ACCOUNT_DELETED: 'Account utente eliminato',

        // Errores de Contenido
        CONTENT_NOT_FOUND: 'Contenuto non trovato',
        CONTENT_UPLOAD_FAILED: 'Caricamento del contenuto non riuscito',
        CONTENT_TOO_LARGE: 'Contenuto troppo grande',
        CONTENT_TYPE_NOT_SUPPORTED: 'Tipo di contenuto non supportato',

        // Errores de Amistad/Conexión
        CONNECTION_REQUEST_FAILED: 'Richiesta di connessione non riuscita',
        CONNECTION_ALREADY_EXISTS: 'Connessione già esistente',
        CONNECTION_NOT_FOUND: 'Connessione non trovata',

        // Errores de Mensajes
        MESSAGE_SEND_FAILED: 'Invio del messaggio non riuscito',
        MESSAGE_NOT_FOUND: 'Messaggio non trovato',
        MESSAGE_CONTENT_INVALID: 'Contenuto del messaggio non valido',

        // Errores de Publicación
        POST_CREATE_FAILED: 'Creazione del post non riuscita',
        POST_NOT_FOUND: 'Post non trovato',
        POST_UPDATE_FAILED: 'Aggiornamento del post non riuscito',
        POST_DELETE_FAILED: 'Eliminazione del post non riuscita',

        // Errores de Pago
        PAYMENT_FAILED: 'Pagamento non riuscito',
        PAYMENT_METHOD_INVALID: 'Metodo di pagamento non valido',
        PAYMENT_INSUFFICIENT_FUNDS: 'Fondi insufficienti',

        // Errores del Servidor
        SERVER_ERROR: 'Errore del server',
        SERVER_MAINTENANCE: 'Manutenzione del server',

        // Errores Desconocidos
        UNKNOWN_ERROR: 'Errore sconosciuto',
      },
      follows: {
        followers: 'Follower',
        following: 'Seguiti',
        in_common: 'In comune',
        errors: {
          NO_FOLLOWING: 'Questo profilo non segue nessuno.',
          NO_FOLLOWERS: 'Questo profilo non ha follower.',
          NO_COMMON_FOLLOWERS: 'Nessun follower in comune.',
        },
      },
      location: {
        borough: 'Quartiere',
        canton: 'Cantone',
        city: 'Città',
        county: 'Contea',
        continent: 'Continente',
        country: 'Paese',
        department: 'Dipartimento',
        district: 'Distretto',
        hamlet: 'Borgo',
        location: 'Luogo',
        municipality: 'Comune',
        province: 'Provincia',
        region: 'Regione',
        state: 'Stato',
        town: 'Città',
        village: 'Villaggio',
      },
      stats: {
        rating: {
          overall: 'Valutazione complessiva',
          stage: 'Palcoscenico',
          sound: 'Audio',
          backline: 'Backline',
          lights: 'Luci',
          dressing_room: 'Sala trucco e parrucco',
          hospitality_food: 'Cibo ospitalità',
          hospitality_drinks: 'Bevande ospitalità',
          timeliness: 'Puntualità',
          communication: 'Comunicazione',
          transportation: 'Trasporto',
          logistic: 'Logistica',
          location: 'Posizione',
          seating_capacity: 'Capacità sedute',
          total_rates: 'Valutazioni totali',
          talent: 'Talento',
          performance: 'Performance',
          proffesionalism: 'Professionalità',
          stage_presence: 'Presenza scenica',
          charisma: 'Carisma',
          respectfulness: 'Rispetto',
        },
      },
    },
    pages: {
      app: {
        settings: {
          title: 'Impostazioni',
          language_selection: {
            title: 'Selezione della lingua',
          },
          user_profile: {
            title: 'Profilo utente',
            user: 'Utente',
            logout: 'Disconnettersi',
            logged_user: 'Utente registrato',
            empty_user: "Non c'è un utente",
            user_info: 'Informazioni utente',
            roles: 'Ruoli',
            artist: 'Artista',
            place: 'Luogo',
          },
        },
      },

      app_base: {
        LoginPage: {
          paragraph1:
            'Stai visualizzando una versione di prova della nostra piattaforma. Attualmente, la registrazione degli utenti è limitata.',
          paragraph2:
            'Se desideri unirti alla comunità degli artisti, ti invitiamo a registrarti facendo clic sul seguente pulsante.',
          paragraph3:
            "Ricorda che puoi registrarti sia come parte dell'ecosistema musicale che come fan. Registrati e tieni presente l'agenda culturale, riceverai notifiche e avvisi per eventi di tuo interesse.",
          button: 'Registrarmi nella versione di prova',
        },
        UsersPages: {
          UsersDetailsPage: {
            fillProfileBanner: {
              content:
                'Prima di continuare a usare tutti i benefici di Artist Hive, è necessario completare il tuo profilo personale.',
            },
            subpages: {
              general: {
                name: 'Generale',
                sections: {
                  general: {
                    name: 'Informazioni generali',
                    attributes: {
                      given_names: 'Nomi',
                      surnames: 'Cognome',
                      stage_name: "Nome d'arte",
                      fullname: 'Nome e cognome',
                      gender: 'Genere',
                      birthdate: 'Data di nascita',
                      birthplace: 'Luogo di nascita',
                      home_city: 'Città di residenza',
                    },
                  },
                  contact: {
                    name: 'Contatto',
                  },
                },
              },
              artist_info: {
                name: 'Info Pro',
                sections: {
                  emergency_contact: {
                    name: 'Contatto di emergenza',
                  },
                  artists_info: {
                    name: "Informazioni sull'artista",
                    attributes: {
                      user_language: "Lingua dell'utente",
                      blood_group: 'Gruppo sanguigno',
                      dietary_restrictions: 'Restrizioni dietetiche',
                      allergies: 'Allergie',
                    },
                  },
                },
              },
              arts: {
                name: 'Arte',
                sections: {
                  music: {
                    name: 'Musica',
                  },
                  dance: {
                    name: 'Danza',
                  },
                  photography: {
                    name: 'Fotografia',
                  },
                  video: {
                    name: 'Video',
                  },
                  painting: {
                    name: 'Pittura',
                  },
                  poetry: {
                    name: 'Poesia',
                  },
                  standup_comedy: {
                    name: 'Cabatteria',
                  },
                  awards: {
                    name: 'Prezzo',
                  },
                },
              },
              memberships: {
                name: 'Abbonamenti',
                sections: {
                  artists: {
                    name: 'Artisti',
                  },
                  places: {
                    name: 'Luoghi',
                  },
                },
              },
              my_shows: {
                name: 'Miei eventi',
                sections: {
                  next_shows: {
                    name: 'Prossimi spettacoli',
                  },
                  past_shows: {
                    name: 'Spettacoli passati',
                  },
                },
              },
              my_liked_shows: {
                name: 'Miei abbonamenti',
                sections: {
                  next_shows: {
                    name: 'Prossimi spettacoli',
                  },
                  past_shows: {
                    name: 'Spettacoli passati',
                  },
                },
              },
            },
          },
          activate_industry_banner: {
            banner: {
              title: "Sei un membro dell'industria?",
              content: 'Accedi a tutti gli strumenti per artisti, agenti, venue e altri professionisti.',
            },
            button: 'Attiva ora',
          },
        },
      },
      domain: {
        CulturalAgenda: {
          title: 'Agenda culturale',
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
                      description: 'Descrizione',
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
                    name: 'Backline suono',
                  },
                  light_backline: {
                    name: 'Backline luce',
                  },
                },
              },
              menu: {
                name: 'Menu',
                sections: {
                  main_course: { name: 'Piatto principale' },
                  second_course: { name: 'Secundo Piatto' },
                },
              },
            },
          },
        },
        RidersPages: {
          RidersDetailsPage: {
            subpages: {
              general: {
                name: 'Generale',
                sections: {
                  general: {
                    name: 'Generale',
                    attributes: {
                      since: 'Da',
                      home_city: 'Città di origine',
                      categories: 'Categorie',
                      spoken_languages: 'Lingue parlate',
                      stage_languages: 'Lingue di palco',
                      arts_languages: 'Lingue artistiche',
                    },
                  },
                  contact: {
                    name: 'Contatto',
                    attributes: {
                      production_manager_phone: 'Telefono del responsabile di produzione',
                      tour_manager_phone: 'Telefono del tour manager',
                    },
                  },
                  general_technical_features: {
                    name: 'Caratteristiche tecniche generali',
                    attributes: {
                      frecuency_response: 'Risposta in frequenza',
                      sound_pressure: 'Pressione sonora',
                      foh_distance: 'Distanza FOH',
                    },
                  },
                },
              },
              people: {
                name: 'Persone',
                sections: {
                  staff: {
                    name: 'Staff',
                  },
                  allergies: {
                    name: 'Allergie',
                  },
                  rooming_list: {
                    name: 'Lista di alloggio',
                  },
                  external_transportation: {
                    name: 'Trasporto esterno',
                    attributes: {
                      albums: 'Voli',
                    },
                  },
                  internal_transportation: {
                    name: 'Trasporto interno',
                    attributes: {
                      albums: 'Trasporto terrestre',
                    },
                  },
                },
              },
              technical_requirements: {
                name: 'Requisiti tecnici',
                sections: {
                  staging: {
                    name: 'Scenografia',
                  },
                  audio_requirements: {
                    name: 'Requisiti audio',
                    attributes: {
                      channelNumber: 'Numero di canale',
                      instrumentName: 'Nome dello strumento',
                      microphone: 'Microfono',
                      inserts: 'Inserti',
                      mixNumber: 'Numero di mixaggio',
                      description: 'Descrizione',
                      monitor: 'Monitor',
                    },
                  },
                  video_requirements: {
                    name: 'Requisiti video',
                  },
                  lights_requirements: {
                    name: 'Requisiti di illuminazione',
                  },
                  stage_design: {
                    name: 'Progettazione palco',
                  },
                  special_effects: {
                    name: 'Effetti speciali',
                  },
                },
              },
              backline: {
                name: 'Backline',
                sections: {
                  external_required_backline: {
                    name: 'Backline esterno richiesto',
                  },
                  owned_backline: {
                    name: 'Backline di proprietà',
                  },
                },
              },
              sound_test: {
                name: 'Test del suono',
                sections: {
                  timing: {
                    name: 'Tempistica',
                  },
                },
              },
            },
          },
        },
        IndustryOfferPage: {
          create_account_banner: "Unisciti all'alveare",
        },
        TourPlansPages: {
          TourPlanDetailsPage: {
            tourPlanNotFound: 'Tour non trovato',
            subpages: {
              general: {
                name: 'Generale',
                sections: {
                  dates: {
                    name: 'Date',
                    attributes: {
                      initial_date: 'Data Iniziale',
                      final_date: 'Data Finale',
                      total_days: 'Giorni Totali',
                      events_state_summary: 'Eventi',
                    },
                  },
                  shows: {
                    name: 'Spettacoli',
                  },
                },
              },
              dates: {
                name: 'Date',
              },
              budget: {
                name: 'Budget',
                sections: {
                  internal_transportation: {
                    name: 'Trasporto Interno',
                  },
                  intercity_transportation: {
                    name: 'Trasporto tra Città',
                  },
                  accommodation: {
                    name: 'Alloggio',
                  },
                  food: {
                    name: 'Cibo',
                  },
                },
              },
              wishes: {
                name: 'Desideri',
                sections: {
                  guest_artists: {
                    name: 'Artisti Ospiti',
                  },
                  possible_shows: {
                    name: 'Spettacoli Possibili',
                  },
                },
              },
              settings: {
                name: 'Impostazioni',
              },
            },
          },
        },
      },
      ArtistsPages: {
        ArtistsDetailsPage: {
          subpages: {
            general: {
              name: 'Generale',
              sections: {
                general: {
                  name: 'Info generale',
                  attributes: {
                    description: 'Descrizione',
                    since: 'Da',
                    home_city: 'Città ',
                    cityWithCountry: 'Città',
                    categories: 'Categorie',
                    genres: 'Generi',
                    spoken_languages: 'Lingue parlate',
                    stage_languages: 'Lingue en scena',
                    arts_languages: "Lingue dell'arte",
                  },
                },
                genres: {
                  name: 'Generi',
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
                record_label: {
                  name: 'Etichetta',
                },
                members: {
                  name: 'Membri',
                },
              },
            },
            arts: {
              name: 'Arti',
              sections: {
                discography: {
                  name: 'Discografia',
                  attributes: {
                    albums: 'Albums',
                    top_tracks: 'Migliori canzoni',
                    dvd_video: 'DVD / Video',
                  },
                },
                media_channels: {
                  name: 'Canali Multimediali',
                },
                gallery: {
                  name: 'Galleria',
                  attributes: {
                    photos: 'Foto',
                    video: 'Video',
                  },
                },
                awards: {
                  name: 'Premi',
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
                rating: {
                  name: 'Qualificazione',
                },
              },
            },
            shows: {
              name: 'Shows',
              sections: {
                summary: {
                  name: 'Riassunto',
                },
                next_shows: {
                  name: 'Prossimi spettacoli',
                },
                past_shows: {
                  name: 'Spettacoli passati',
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
        welcome: 'Bienvenuti',
        news: 'Notizia',
        artists: 'Artisti',
        events: 'Eventi',
        places: 'Posti',
        industry_offer: {
          title: "Fai parte dell'industria musicale?",
          call_to_action: 'Scopri la nostra proposta',
        },
      },
      EventsPages: {
        EventDetailsPage: {
          subpages: {
            general: {
              name: 'Info',
              sections: {
                general: {
                  name: 'Informazione Generale',
                  attributes: {
                    national_code: 'PULEP',
                    timetable__initial_date: 'Quando?',
                    initial_time: 'Ora',
                    minimumAge: 'Età minima',
                    timetable__openning_doors: 'Apertura porte',
                    promoter: 'Promoter',
                    tickets_website: 'Sito dei biglietti',
                  },
                },
                description: {
                  name: 'Descrizione',
                },
                genres: {
                  name: 'Generi',
                },
              },
            },
            artists: {
              name: 'Artisti',
              sections: {
                main_artists: { name: 'Headliner' },
                other_artists: { name: 'Altri artisti' },
              },
            },
            place: {
              name: 'Posto',
              sections: {
                location: {
                  name: 'Localizzazione',
                },
              },
            },
            tickets: {
              name: 'Biglietti',
              sections: {
                general: {
                  name: 'Informazioni Generali',
                  attributes: {
                    tickets_website: 'Sito Web dei Biglietti',
                    price: 'Prezzo',
                  },
                },
              },
            },
            contact: {
              name: 'Contatto & Media',
              sections: {
                contact: {
                  name: 'Informazioni di contatto',
                },
                social_networks: {
                  name: 'Mezzi sociali',
                },
              },
            },
            extra_info: {
              name: 'Extras',
              sections: {
                additional_info: { name: 'Informazioni aggiuntive' },
                dress_code: { name: 'Codice di abbigliamento' },
                discounts: { name: 'Sconti' },
                promoter: { name: 'Promotore' },
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
                  name: 'Informazioni Generali',
                  attributes: {
                    description: 'Descrizione',
                    address: 'Indirizzo',
                    city: 'Città',
                    cityWithCountry: 'Posizione',
                    categories: 'Categorie',
                    since: 'Dal',
                    spoken_languages: 'Lingue parlate',
                    stage_languages: 'Lingue di scena',
                    arts_languages: 'Lingue nelle arti',
                  },
                },
                genres: {
                  name: 'Generi',
                },
                contact: {
                  name: 'Contatto',
                  attributes: {
                    website: 'Sito web',
                    email: 'E-mail',
                    phone: 'Telefono',
                    mobile_phone: 'Cellulare',
                    whatsapp: 'WhatsApp',
                  },
                },
                social_networks: {
                  name: 'Reti sociali',
                },
              },
            },
            stats: {
              name: 'Statistiche',
              sections: {
                social_network_presence: {
                  name: 'Presenza sui social network',
                },
                rating: {
                  name: 'Valutazione',
                },
              },
            },
            shows: {
              name: 'Spettacoli',
              sections: {
                next_shows: {
                  name: 'Prossimi Spettacoli',
                },
                past_shows: {
                  name: 'Spettacoli Passati',
                },
              },
            },
            backline: {
              name: 'Backline',
              sections: {
                sound_backline: {
                  name: 'Backline del Suono',
                },
                light_backline: {
                  name: 'Backline delle Luci',
                },
              },
            },
            menu: {
              name: 'Menu',
              sections: {
                main_course: {
                  name: 'Piatto principale',
                },
                second_course: {
                  name: 'Secondo piatto',
                },
              },
            },
            followers: {
              name: 'Followers',
            },
          },
        },
      },
    },
    appbase: {
      betabar: {
        contact_us: 'Contattaci',
        disclaimer:
          'Stai visualizzando una versione di prova della nostra piattaforma. Speriamo che ti piaccia. Puoi contattarci utilizzando il pulsante sottostante.',
        our_email_is: 'Il nostro indirizzo email è:',
      },
      claimProfileBanner: {
        PROFILE_AUTO_GENERATED_CAPTION:
          'Questo profilo è stato creato con informazioni pubbliche disponibili online. È il tuo? Richiedi gratuitamente il tuo profilo per gestirlo e aggiornarlo.',
        PROFILE_CONFIRMATION_MESSAGE:
          'Grazie per il tuo interesse nel richiedere questo profilo. Cliccando sul pulsante "Richiedi il profilo", ci autorizzi ad avviare il processo di verifica della proprietà a tuo nome. Una volta confermata la proprietà, avrai accesso al profilo con i ruoli di amministratore per interagire con i tuoi fan e con l\'industria musicale utilizzando tutti gli strumenti offerti da Artist Hive. <br />Tieni presente che il processo di verifica può richiedere dai 5 ai 10 giorni lavorativi. Ti informeremo via email o attraverso i social media del profilo.',
        CLAIM_REQUEST_CONFIRMATION:
          'La tua richiesta è stata registrata con successo. Ti contatteremo via email o tramite i social media non appena sarà risolta.',
        CLAIM_BUTTON: 'Richiedi il profilo',
      },
      footer: {
        columns: {
          what_we_do: {
            name: 'Cosa facciamo?',
            options: {
              cultural_agenda: 'Agenda culturale',
              for_academies: 'Per le accademie',
              for_artists: 'Per gli artisti',
              for_places: 'Per luoghi',
              for_promoters: 'Per i promotori',
              for_festivals: 'Per i festival',
            },
          },
          about_us: {
            name: 'Chi siamo',
            options: {
              history: 'La nostra storia',
              press: 'Premere',
              career: 'Carriera',
              download: 'Scarica app',
            },
          },
          help: {
            name: 'Aiuta',
            options: {
              data_policy: 'Informativa sui dati',
              help_center: 'Centro assistenza',
              contact_us: 'Contattaci',
              report: 'Rapporto',
              terms: 'Termini di servizio',
            },
          },
        },
        copywrite: {
          allRightsReserved: 'Tutti i diritti riservati',
        },
      },
      search: {
        empty_results: {
          title: 'Non ci sono resultati che corrispondono alla tua ricerca',
          suggestions: {
            statement: 'Prova uno dei seguenti suggerimenti',
            spelling: 'Controlla la tua ortografia',
            less_words: 'Usa parole più generiche o meno parole',
            related_things: 'Sfoglia le categorie per trovare elementi simili',
          },
        },
        filters: {
          title: 'Filtri',
          subpages: {
            general: {
              name: 'Generale',
              sections: {
                general: {
                  name: 'Generale',
                  attributes: {
                    genres: 'Generi',
                    cityWithCountry: 'Dove?',
                  },
                },
                dates: {
                  name: 'Date',
                  attributes: {
                    date: 'Quando?',
                  },
                },
                languages: {
                  name: 'Lingue',
                  attributes: {
                    spoken_languages: 'Lingue parlate',
                    stage_languages: 'Lingue di scena',
                    arts_languages: 'Lingue artistiche',
                  },
                },
              },
            },
            artists: {
              name: 'Artisti',
              sections: {
                general: {
                  name: 'Generale',
                  attributes: {
                    is_available_at: 'È disponibile presso?',
                    has_albums: 'Ha album?',
                    music_awards: 'Premi musicali',
                  },
                },
                rating: {
                  name: 'Valutazione',
                  attributes: {
                    overall: 'Generale',
                    talent: 'Talento',
                    performance: 'Performance',
                  },
                },
              },
            },
            places: {
              name: 'Luoghi',
              sections: {
                stage: {
                  name: 'Palco',
                  attributes: {
                    stage_width: 'Larghezza',
                    stage_length: 'Lunghezza',
                    stage_height: 'Altezza',
                  },
                },
                backline: {
                  name: 'Backline',
                  attributes: {
                    mics: 'Microfoni',
                  },
                },
              },
            },
            social_networks: {
              name: 'Social Network',
              sections: {
                presence: {
                  name: 'Presenza',
                  attributes: {
                    has_social_networks: 'Ha questi network?',
                  },
                },
              },
            },
          },
        },
        not_found_results: 'Nessun risultato trovato',
        recommendations: 'Raccomandazioni',
        result_view_types: {
          list: 'Lista',
          map: 'Mappa',
        },
        results: 'Resultati',
        search: 'Cerca',
        search_placeholder: 'Artisti, eventi, luoghi...',
        see_more: 'Vedi di più',
        what_are_you_looking_for: 'Cosa stai cercando?',
        types: {
          ARTISTS: 'Artisti',
          PLACES: 'Luoghi',
          EVENTS: 'Eventi',
        },
        type_your_search: 'Scrivi la tua ricerca',
      },
      sidenav: {
        name: 'Menu principale',
        sections: {
          general: {
            name: 'Generale',
            options: {
              home: 'Home',
              cultural_agenda: 'Agenda culturale',
              search: 'Cercare',
            },
          },
          industry: {
            name: 'Industria Musicale',
            options: {
              industry_member: "Fai parte dell'industria musicale?",
            },
          },
          myInfo: {
            name: 'Mie Info',
            options: {
              inbox: 'Posta in arrivo',
              'inbox.nested': {
                incoming: 'In arrivo',
                sent: 'Inviati',
              },
              my_profile: 'Il mio profilo',
              my_bands: 'Le mie band',
              'my_bands.nested': { create: 'Crea una band' },
              my_events: 'I miei eventi',
              'my_events.nested': { create: 'Crea un evento' },
              my_riders: 'I miei rider',
              my_places: 'I miei luoghi',
              'my_places.nested': { create: 'Crea luogo' },
              favourites: 'Preferiti',
              'favourites.nested': {
                saved: 'Salvati',
                tour_planning: 'Pianificazione del tour',
              },
            },
          },
          settings: {
            name: 'Impostazioni',
            options: {
              settings: 'Impostazioni',
              help_center: 'Centro assistenza',
              report: 'Segnala',
              send_comments: 'Invia comenti',
              logout: 'Esci',
            },
          },
        },
      },
    },
  },
};
