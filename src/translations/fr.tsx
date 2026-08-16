export const FrMessages = {
  app: {
    name: 'App FR',
    loading: 'Chargement en cours',
    general: {
      not_found_page: {
        title: "Oups ! Nous n'avons pas trouvé ce que vous cherchez",
      },
    },
    domain_global_dictionary: { errors: {} },
    global_dictionary: {
      artists_hive: {
        slogan: 'Crée, Connecte-toi, Envole-toi...',
      },
      art_types: {
        dance: 'Danse',
        music: 'Musique',
        painting: 'Peinture',
        poetry: 'Poésie',
        photography: 'Photographie',
        standup_comedy: 'Comédie Stand-up',
        theatre: 'Théâtre',
        video: 'Vidéo',
      },
      actions: {
        add: 'Ajouter',
        accounts: {
          create_account: 'Créer un compte',
          forgot_password: 'Mot de passe oublié',
          login: 'Connexion',
          password: 'Mot de passe',
          phone_number: 'Numéro de téléphone',
          phone_number_placeholder: '1234567890',
          remember_me: 'Se souvenir de moi',
          signup: "S'inscrire",
          username_or_email: "Nom d'utilisateur ou email",
        },
        create: 'Créer',
        edit: 'Modifier',
        follow_us: 'Suivez-nous',
        save: 'Enregistrer',
        cancel: 'Annuler',
        link_copied_to_clipboard: 'Lien copié dans le presse-papiers',
        navigation: {
          back: 'Retour',
          first: 'Premier',
          home: 'Accueil',
          last: 'Dernier',
          next: 'Suivant',
          previous: 'Précédent',
          refresh: 'Rafraîchir',
          submit: 'Envoyer',
          cancel: 'Annuler',
          close: 'Fermer',
          open: 'Ouvrir',
          save: 'Enregistrer',
        },
        report: 'Signaler',
        selection: {
          select_all: 'Tout sélectionner',
          clear_selection: 'Effacer la sélection',
        },
        share: 'Partager',
        show_more: 'Afficher plus',
        show_less: 'Afficher moins',
        submit: 'Soumettre',
        subscription: {
          subscribe: "S'abonner",
          unsubscribe: 'Se désabonner',
        },
        upload: 'Télécharger',
        files_limit_exceded: 'Nombre maximum de fichiers autorisés dépassé',
      },
      entities: {
        academies: { plural: 'Académies', singular: 'Académie' },
        artists: {
          plural: 'Artistes',
          singular: 'Artiste',
          attributes: {
            project_format: {
              label: 'Format de Projet',
              values: {
                solo_artist: 'Artiste Solo',
                duo: 'Duo',
                band: 'Groupe (Band)',
                dj: 'DJ',
                group: 'Groupe (Group)',
                collective: 'Collectif',
                orchestra: 'Orchestre',
                choir: 'Chorale',
                symphonic_choral: 'Chœur Symphonique',
                other: 'Autre',
              },
            },
          },
        },
        events: {
          plural: 'Événements',
          singular: 'Événement',
          attributes: {
            event_type: {
              label: 'Type d\'Événement',
              values: {
                concert: 'Concert',
                conversation: 'Conversation',
                festival: 'Festival',
                jam_session: 'Jam session',
                market: 'Marché',
                other: 'Autre',
                residency: 'Résidence artistique',
                showcase: 'Vitrine',
                workshop: 'Atelier',
              },
            },
          },
        },
        open_calls: {
          plural: 'Appels Ouverts',
          singular: 'Appel Ouvert',
          attributes: {
            support_provision: {
              label: 'Fourniture de Support',
              values: {
                no: 'Non',
                yes: 'Oui',
                partial: 'Partiel',
                negotiable: 'Négociable',
              },
            },
          },
        },
        places: {
          plural: 'Lieux',
          singular: 'Lieu',
          attributes: {
            place_types: {
              label: 'Types de Lieu',
              values: {
                bar: 'Bar',
                club: 'Club',
                theater: 'Théâtre',
                concert_hall: 'Salle de Concert',
                cultural_center: 'Centre Culturel',
                restaurant: 'Restaurant',
                outdoor: 'En Plein Air',
                other: 'Autre',
              },
            },
            stage_types: {
              label: 'Types de Scène',
              values: {
                indoor: 'Intérieur',
                outdoor: 'Extérieur',
                amphitheater: 'Amphithéâtre',
                club: 'Club',
                theater: 'Théâtre',
                other: 'Autre',
              },
            },
          },
        },
        promoters: { plural: 'Promoteurs', singular: 'Promoteur' },
        prebooking_requests: { plural: 'Pré-Réservations', singular: 'Pré-Réservation' },
        users: {
          plural: 'Utilisateurs',
          singular: 'Utilisateur',
          attributes: {
            agrees_to_a_blood_transfusion: {
              label: 'Acceptez-vous les transfusions sanguines ?',
              values: {
                true: 'Accepte',
                false: "N'accepte pas",
              },
            },
            dietary_restrictions: {
              label: 'Restrictions alimentaires',
              values: {
                none: 'Aucune',
                vegetarian: 'Végétarien',
                vegan: 'Végétalien',
                celiac: 'Cœliaque',
              },
            },
            gender: {
              label: 'Sexe',
              values: {
                male: 'Homme',
                female: 'Femme',
                non_binary: 'Non binaire',
                non_specified: 'Non spécifié',
              },
            },
          },
        },
      },
      errors: {
        // Data error
        NOT_AVAILABLE: 'Non disponible',
        NO_RESULTS: 'Aucun résultat',

        // Errores de Autenticación y Autorización
        AUTH_INVALID_CREDENTIALS: 'Identifiants invalides',
        AUTH_USER_NOT_FOUND: 'Utilisateur non trouvé',
        AUTH_NO_USER_PROVIDED: 'Aucun utilisateur fourni',
        AUTH_NO_PASSWORD_PROVIDED: 'Aucun mot de passe fourni',
        AUTH_NO_TOKEN_PROVIDED: 'Aucun jeton fourni',
        AUTH_WRONG_PASSWORD: 'Mot de passe incorrect',
        AUTH_TOKEN_EXPIRED: 'Jeton expiré',
        AUTH_TOKEN_INVALID: 'Jeton invalide',
        AUTH_PERMISSION_DENIED: 'Permission refusée',
        AUTH_LOGIN_REQUIRED: 'Vous devez vous connecter pour voir ce contenu.',

        // Errores de Red
        NETWORK_ERROR: 'Erreur réseau',
        NETWORK_TIMEOUT: "Délai d'attente réseau dépassé",
        NETWORK_NOT_CONNECTED: 'Non connecté au réseau',

        // Errores de Validación
        VALIDATION_EMAIL_INVALID: 'Adresse e-mail invalide',
        VALIDATION_PASSWORD_WEAK: 'Mot de passe faible',
        VALIDATION_FIELD_REQUIRED: 'Champ requis',
        VALIDATION_USERNAME_TAKEN: "Nom d'utilisateur déjà pris",
        VALIDATION_USERNAME_FORMAT:
          "Le nom d'utilisateur ne peut contenir que des minuscules, des chiffres, des underscores et des points (3 à 24 caractères, sans espaces).",

        // Errores de Usuario
        USER_PROFILE_NOT_FOUND: 'Profil utilisateur non trouvé',
        USER_PROFILE_UPDATE_FAILED: 'Échec de la mise à jour du profil utilisateur',
        USER_ACCOUNT_SUSPENDED: 'Compte utilisateur suspendu',
        USER_ACCOUNT_DELETED: 'Compte utilisateur supprimé',

        // Errores de Contenido
        CONTENT_NOT_FOUND: 'Contenu non trouvé',
        CONTENT_UPLOAD_FAILED: 'Échec du téléchargement du contenu',
        CONTENT_TOO_LARGE: 'Contenu trop volumineux',
        CONTENT_TYPE_NOT_SUPPORTED: 'Type de contenu non pris en charge',

        // Errores de Amistad/Conexión
        CONNECTION_REQUEST_FAILED: 'Échec de la demande de connexion',
        CONNECTION_ALREADY_EXISTS: 'Connexion déjà existante',
        CONNECTION_NOT_FOUND: 'Connexion non trouvée',

        // Errores de Mensajes
        MESSAGE_SEND_FAILED: "Échec de l'envoi du message",
        MESSAGE_NOT_FOUND: 'Message non trouvé',
        MESSAGE_CONTENT_INVALID: 'Contenu du message invalide',

        // Errores de Publicación
        POST_CREATE_FAILED: 'Échec de la création du post',
        POST_NOT_FOUND: 'Post non trouvé',
        POST_UPDATE_FAILED: 'Échec de la mise à jour du post',
        POST_DELETE_FAILED: 'Échec de la suppression du post',

        // Errores de Pago
        PAYMENT_FAILED: 'Échec du paiement',
        PAYMENT_METHOD_INVALID: 'Méthode de paiement invalide',
        PAYMENT_INSUFFICIENT_FUNDS: 'Fonds insuffisants',

        // Errores del Servidor
        SERVER_ERROR: 'Erreur serveur',
        SERVER_MAINTENANCE: 'Maintenance du serveur',

        // Errores Desconocidos
        UNKNOWN_ERROR: 'Erreur inconnue',
      },
      follows: {
        followers: 'Abonnés',
        following: 'Abonnements',
        in_common: 'En commun',
        errors: {
          NO_FOLLOWING: 'Ce profil ne suit personne.',
          NO_FOLLOWERS: "Ce profil n'a pas d'abonnés.",
          NO_COMMON_FOLLOWERS: 'Aucun abonné en commun.',
        },
      },
      prebooking: {
        title: 'Pré-Réservations',
        singular: 'Pré-Réservation',
        create: 'Créer une Pré-Réservation',
        create_short: 'Nouvelle Pré-Réservation',
        dashboard: 'Tableau de bord des Pré-Réservations',
        status: {
          DRAFT: 'Brouillon',
          PENDING: 'En attente',
          PARTIALLY_VIEWED: 'Partiellement Vue',
          PARTIALLY_ACCEPTED: 'Partiellement Acceptée',
          ALL_ACCEPTED: 'Entièrement Acceptée',
          REJECTED: 'Rejetée',
          CANCELLED: 'Annulée',
          CONVERTED: 'Convertie en Événement',
          EXPIRED: 'Expirée',
        },
        approval_status: {
          ALL_PENDING: 'Tous en Attente',
          PARTIAL: 'Partiel',
          ALL_APPROVED: 'Tous Approuvés',
          REJECTED: 'Rejeté',
        },
        participant_status: {
          pending: 'En attente',
          viewed: 'Vu',
          interested: 'Intéressé',
          not_interested: 'Pas intéressé',
        },
        request_type: {
          single_date: 'Date Unique',
          date_range: 'Plage de Dates',
          week: 'Semaine',
          month: 'Mois',
          quarter: 'Trimestre',
        },
        fields: {
          event_name: "Nom de l'Événement",
          description: 'Description',
          requested_date_start: 'Date de Début',
          requested_date_end: 'Date de Fin',
          request_type: 'Type de Réservation',
          flexible_dates: 'Dates Flexibles',
          alternative_dates: 'Dates Alternatives',
          expected_attendance: 'Participation Attendue',
          response_deadline: 'Date Limite de Réponse',
          requester: 'Demandeur',
          recipients: 'Destinataires',
          additional_participants: 'Participants Supplémentaires',
          notes: 'Notes',
          participants: 'Participants',
        },
        actions: {
          approve: 'Approuver',
          reject: 'Rejeter',
          cancel: 'Annuler',
          convert_to_event: 'Convertir en Événement',
          edit: 'Modifier',
          add_note: 'Ajouter une Note',
          view_details: 'Voir les Détails',
          send_request: 'Envoyer la Demande',
        },
        tabs: {
          received: 'Reçues',
          sent: 'Envoyées',
          all: 'Toutes',
          pending: 'En Attente',
          accepted: 'Acceptées',
          rejected: 'Rejetées',
        },
        messages: {
          create_success: 'Pré-réservation créée avec succès',
          approve_success: 'Pré-réservation approuvée avec succès',
          reject_success: 'Pré-réservation rejetée',
          cancel_success: 'Pré-réservation annulée',
          convert_success: 'Pré-réservation convertie en événement avec succès',
          update_success: 'Pré-réservation mise à jour',
          no_requests_found: 'Aucune pré-réservation trouvée',
          requires_action: 'Nécessite votre action',
          approval_progress: '{approved} sur {total} ont approuvé',
          deadline_warning: 'Expire dans {days} jours',
          expired: 'Cette demande a expiré',
        },
        errors: {
          create_failed: 'Échec de la création de la pré-réservation',
          load_failed: 'Échec du chargement des pré-réservations',
          approve_failed: "Échec de l'approbation",
          reject_failed: 'Échec du rejet',
          cancel_failed: "Échec de l'annulation",
          convert_failed: 'Échec de la conversion en événement',
          no_permission: "Vous n'avez pas la permission pour cette action",
          already_responded: 'Vous avez déjà répondu à cette demande',
          invalid_dates: 'Les dates sélectionnées ne sont pas valides',
          past_date: 'Vous ne pouvez pas créer une réservation pour une date passée',
        },
        tooltips: {
          flexible_dates: 'Permet de suggérer des dates alternatives',
          auto_approved: 'Approuvé automatiquement lors de la création',
          requires_all_types: 'Nécessite au moins une approbation de chaque type de profil',
          can_cancel: 'Seul le demandeur peut annuler',
          can_convert: 'Peut être converti lorsque tous approuvent',
        },
      },
      location: {
        borough: 'Arrondissement',
        canton: 'Canton',
        city: 'Ville',
        county: 'Comté',
        continent: 'Continent',
        country: 'Pays',
        department: 'Département',
        district: 'District',
        hamlet: 'Hameau',
        location: 'Lieu',
        municipality: 'Municipalité',
        province: 'Province',
        region: 'Région',
        state: 'État',
        town: 'Ville',
        village: 'Village',
      },
      location_info: {
        search_country_or_code: 'Rechercher un pays ou un code...',
      },
      social_networks_analytics: {
        metrics: {
          followers: 'Abonnés',
          subscribers: 'Abonnés',
          monthly_listeners: 'Auditeurs mensuels',
          total_streams: 'Streams totaux',
          save_rate: "Taux d'enregistrement",
          radio_streams: 'Streams radio',
          playlist_reach: 'Portée de la playlist',
          posts: 'Publications',
          avg_likes: 'Likes moyens',
          engagement_rate: "Taux d'engagement",
          avg_reach: 'Portée moyenne',
          total_likes: 'Total des likes',
          videos_published: 'Vidéos publiées',
          video_views: 'Vues de vidéo',
          posts_content: 'Publications de contenu',
          shares: 'Partages',
          total_views: 'Vues totales',
          monthly_video_views: 'Vues vidéo mensuelles',
          watch_time: 'Temps de visionnage',
          new_subscribers: 'Nouveaux abonnés',
          page_likes: 'Likes de page',
          weekly_reach: 'Portée hebdomadaire',
          engagement: 'Engagement',
          tweets: 'Tweets',
          monthly_impressions: 'Impressions mensuelles',
          mentions: 'Mentions',
          total_plays: 'Lectures totales',
          stations_featuring_artist: "Stations incluant l'artiste",
          thumbs_up: 'Pouces levés',
          shazams: 'Shazams',
        },
      },
      stats: {
        rating: {
          overall: 'Note globale',
          stage: 'Scène',
          sound: 'Son',
          backline: 'Matériel',
          lights: 'Lumières',
          dressing_room: 'Loge',
          hospitality_food: "Nourriture de l'hospitalité",
          hospitality_drinks: "Boissons de l'hospitalité",
          timeliness: 'Ponctualité',
          communication: 'Communication',
          transportation: 'Transport',
          logistic: 'Logistique',
          location: 'Lieu',
          seating_capacity: "Capacité d'assise",
          total_rates: 'Total des notes',
          talent: 'Talent',
          performance: 'Performance',
          proffesionalism: 'Professionnalisme',
          stage_presence: 'Présence sur scène',
          charisma: 'Charisme',
          respectfulness: 'Respect',
        },
      },
    },
    pages: {
      app: {
        settings: {
          title: 'Paramètres',
          language_selection: {
            title: 'Sélection de la langue',
          },
          user_profile: {
            title: "Profil de l'utilisateur",
            user: 'Utilisateur',
            logout: 'Se déconnecter',
            logged_user: 'Utilisateur connecté',
            empty_user: "Il n'y a pas d'utilisateur",
            user_info: "Informations sur l'utilisateur",
            roles: 'Rôles',
            artist: 'Artiste',
            place: 'Lieu',
          },
        },
      },
      app_base: {
        LoginPage: {
          paragraph1:
            "Vous consultez une version de test de notre plateforme. Actuellement, l'inscription des utilisateurs est limitée.",
          paragraph2:
            "Si vous souhaitez rejoindre la ruche d'artistes, nous vous invitons à vous inscrire en cliquant sur le bouton ci-dessous.",
          paragraph3:
            "Rappelez-vous que vous pouvez vous inscrire en tant que membre de l'écosystème musical ou en tant que fan. Inscrivez-vous et tenez compte de l'agenda culturel. Vous recevrez des notifications et des alertes pour les événements qui vous intéressent.",
          button: "M'inscrire dans la version de test",
        },
        UsersPages: {
          UsersDetailsPage: {
            fillProfileBanner: {
              content:
                "Avant de continuer à profiter de tous les avantages d'Artist Hive, il est nécessaire de compléter votre profil personnel.",
            },
            subpages: {
              general: {
                name: 'Général',
                sections: {
                  general: {
                    name: 'Info Générale',
                    attributes: {
                      given_names: 'Prénoms',
                      surnames: 'Nom de famille',
                      stage_name: 'Nom de scène',
                      fullname: 'Nom et prénom',
                      gender: 'Genre',
                      birthdate: 'Date de naissance',
                      birthplace: 'Lieu de naissance',
                      home_city: 'Ville de résidence',
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
                    name: "Contact en cas d'urgence",
                  },
                  artists_info: {
                    name: "Informations sur l'artiste",
                    attributes: {
                      user_language: "Langue de l'utilisateur",
                      spoken_languages: 'Langues parlées',
                      blood_group: 'Groupe sanguin',
                      dietary_restrictions: 'Restrictions alimentaires',
                      allergies: 'Allergies',
                    },
                  },
                },
              },
              arts: {
                name: 'Arts',
                sections: {
                  music: {
                    name: 'Musique',
                    attributes: {
                      played_instruments: 'Instruments joués',
                    },
                  },
                  dance: {
                    name: 'Danse',
                  },
                  photography: {
                    name: 'Photographie',
                  },
                  video: {
                    name: 'Video',
                  },
                  painting: {
                    name: 'Peinture',
                  },
                  poetry: {
                    name: 'Poésie',
                  },
                  standup_comedy: {
                    name: 'Comédie stand-up',
                  },
                  awards: {
                    name: 'Prix',
                  },
                },
              },
              memberships: {
                name: 'Membres',
                sections: {
                  artists: {
                    name: 'Artistes',
                  },
                  places: {
                    name: 'Lieux',
                  },
                },
              },
              my_shows: {
                name: 'Mes Événements',
                sections: {
                  next_shows: {
                    name: 'Spectacles à venir',
                  },
                  past_shows: {
                    name: 'Spectacles passés',
                  },
                },
              },
              my_liked_shows: {
                name: 'Mes abonements',
                sections: {
                  next_shows: {
                    name: 'Spectacles à venir',
                  },
                  past_shows: {
                    name: 'Spectacles passés',
                  },
                },
              },
            },
          },
          activate_industry_banner: {
            banner: {
              title: "Êtes-vous membre de l'industrie?",
              content: 'Accédez à tous les outils pour les artistes, agents, salles et autres professionnels.',
            },
            button: 'Activer maintenant',
          },
        },
      },
      domain: {
        CulturalAgenda: {
          title: 'Agenda culturel',
        },
        AcademiesPages: {
          AcademiesDetailsPage: {
            subpages: {
              general: {
                name: 'Général',
                sections: {
                  gallery: {
                    name: 'Galerie',
                  },
                  general: {
                    name: 'Infos générales',
                    attributes: {
                      description: 'Description',
                      address: 'Adresse',
                      city: 'Ville',
                      cityWithCountry: 'Ville',
                      categories: 'Catégories',
                      since: 'Depuis',
                      spoken_languages: 'Langues parlées',
                      stage_languages: 'Langues de scène',
                      arts_languages: 'Langues artistiques',
                    },
                  },
                  contact: {
                    name: 'Contact',
                    attributes: {
                      website: 'Website',
                      email: 'e-mail',
                      phone: 'Téléphone',
                      mobile_phone: 'Portable',
                      whatsapp: 'WhatsApp',
                    },
                  },
                  social_networks: {
                    name: 'Réseaux Sociaux',
                  },
                },
              },

              social: {
                name: 'Social',
                sections: {
                  social_network_presence: {
                    name: 'Présence sur les réseaux sociaux',
                  },
                  stats: {
                    name: 'Statistiques',
                    attributes: {
                      general_rate: 'Note générale',
                      followers: 'Abonnés',
                      event_followers: 'Abonnés aux événements',
                    },
                  },
                },
              },
              shows: {
                name: 'Shows',
                sections: {
                  next_shows: {
                    name: 'Spectacles à venir',
                  },
                  past_shows: {
                    name: 'Spectacles passés',
                  },
                },
              },
              backline: {
                name: 'Backline',
                sections: {
                  sound_backline: {
                    name: 'Backline sonore',
                  },
                  light_backline: {
                    name: 'Backline éclairage',
                  },
                },
              },
              menu: {
                name: 'Menu',
                sections: {
                  main_course: { name: 'Plat principal' },
                  second_course: { name: 'Second plat' },
                },
              },
            },
          },
        },
        RidersPages: {
          RidersDetailsPage: {
            subpages: {
              general: {
                name: 'Général',
                sections: {
                  general: {
                    name: 'Général',
                    attributes: {
                      since: 'Depuis',
                      home_city: "Ville d'origine",
                      categories: 'Catégories',
                      spoken_languages: 'Langues parlées',
                      stage_languages: 'Langues de scène',
                      arts_languages: 'Langues artistiques',
                    },
                  },
                  contact: {
                    name: 'Contact',
                    attributes: {
                      production_manager_phone: 'Téléphone du directeur de production',
                      tour_manager_phone: 'Téléphone du tour manager',
                    },
                  },
                  general_technical_features: {
                    name: 'Caractéristiques techniques générales',
                    attributes: {
                      frecuency_response: 'Réponse en fréquence',
                      sound_pressure: 'Pression sonore',
                      foh_distance: 'Distance FOH',
                    },
                  },
                },
              },
              people: {
                name: 'Personnes',
                sections: {
                  staff: {
                    name: 'Personnel',
                  },
                  allergies: {
                    name: 'Allergies',
                  },
                  rooming_list: {
                    name: "Liste d'hébergement",
                  },
                  external_transportation: {
                    name: 'Transport externe',
                    attributes: {
                      albums: 'Vols',
                    },
                  },
                  internal_transportation: {
                    name: 'Transport interne',
                    attributes: {
                      albums: 'Transport terrestre',
                    },
                  },
                },
              },
              technical_requirements: {
                name: 'Exigences techniques',
                sections: {
                  staging: {
                    name: 'Scénographie',
                  },
                  audio_requirements: {
                    name: 'Exigences audio',
                    attributes: {
                      channelNumber: 'Numéro de canal',
                      instrumentName: "Nom de l'instrument",
                      microphone: 'Microphone',
                      inserts: 'Inserts',
                      mixNumber: 'Numéro de mixage',
                      description: 'Description',
                      monitor: 'Moniteur',
                    },
                  },
                  video_requirements: {
                    name: 'Exigences vidéo',
                  },
                  lights_requirements: {
                    name: "Exigences d'éclairage",
                  },
                  stage_design: {
                    name: 'Design de scène',
                  },
                  special_effects: {
                    name: 'Effets spéciaux',
                  },
                },
              },
              backline: {
                name: 'Backline',
                sections: {
                  external_required_backline: {
                    name: 'Backline externe requise',
                  },
                  owned_backline: {
                    name: 'Backline possédée',
                  },
                },
              },
              sound_test: {
                name: 'Test sonore',
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
          create_account_banner: 'Rejoins la ruche',
        },
        TourPlansPages: {
          TourPlanDetailsPage: {
            tourPlanNotFound: 'Tour non trouvé',
            subpages: {
              general: {
                name: 'Général',
                sections: {
                  dates: {
                    name: 'Dates',
                    attributes: {
                      initial_date: 'Date initiale',
                      final_date: 'Date finale',
                      total_days: 'Jours au total',
                      events_state_summary: 'Événements',
                    },
                  },
                  shows: {
                    name: 'Spectacles',
                  },
                },
              },
              dates: {
                name: 'Dates',
              },
              budget: {
                name: 'Budget',
                sections: {
                  internal_transportation: {
                    name: 'Transport interne',
                  },
                  intercity_transportation: {
                    name: 'Transport interurbain',
                  },
                  accommodation: {
                    name: 'Hébergement',
                  },
                  food: {
                    name: 'Alimentation',
                  },
                },
              },
              wishes: {
                name: 'Vœux',
                sections: {
                  guest_artists: {
                    name: 'Artistes invités',
                  },
                  possible_shows: {
                    name: 'Spectacles possibles',
                  },
                },
              },
              settings: {
                name: 'Paramètres',
              },
            },
          },
        },
      },
      ArtistsPages: {
        ArtistsDetailsPage: {
          subpages: {
            general: {
              name: 'Général',
              sections: {
                artist_gallery: {
                  name: "Galerie de l'artiste",
                  attributes: {
                    members: 'Membres',
                    live: 'En direct',
                  },
                },
                live_gallery: {
                  name: 'Galerie live',
                },
                general: {
                  name: 'Info Générale',
                  attributes: {
                    description: 'Description',
                    since: 'Depuis',
                    home_city: "Ville de l'établissement",
                    categories: 'Catégories',
                    genres: 'Genres',
                    spoken_languages: 'Langues parlées',
                    stage_languages: 'Langues en scène',
                    arts_languages: 'Langues du arts',
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
                    phone: 'Téléphone',
                    mobile_phone: 'Portable',
                    whatsapp: 'WhatsApp',
                  },
                },
                social_networks: {
                  name: 'Réseaux Sociaux',
                },
                record_label: {
                  name: 'Maison de disques',
                },
                members: {
                  name: 'Membres',
                },
              },
            },
            members: {
              name: 'Membres',
              sections: {
                music_performance: {
                  name: 'Instruments',
                  attributes: {
                    member_names: 'Prénoms',
                    member_surenames: 'Noms de famille',
                    member_role: 'Rôle',
                    member_instrument: 'Instrument',
                  },
                },
                audio_engineering: {
                  name: 'Ingénierie audio',
                },
                visual_arts: {
                  name: 'Visuels',
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
                  name: 'Discographie',
                  attributes: {
                    albums: 'Albums',
                    top_tracks: 'Meilleures chansons',
                    dvd_video: 'DVD / Vidéo',
                  },
                },
                media_channels: {
                  name: 'Canaux médias',
                },
                gallery: {
                  name: 'Galerie',
                  attributes: {
                    photos: 'Photos',
                    video: 'Vidéo',
                  },
                },
                awards: {
                  name: 'Prix',
                },
              },
            },
            social: {
              name: 'Sociale',
              sections: {
                social_network_presence: {
                  name: 'Présence en réseaux sociaux',
                },
                stats: {
                  name: 'Statistiques',
                  attributes: {
                    general_rate: 'Note générale',
                    followers: 'Abonnés',
                    event_followers: 'Abonnés aux événements',
                  },
                },
                rating: {
                  name: 'Notation',
                },
              },
            },
            shows: {
              name: 'Shows',
              sections: {
                summary: {
                  name: 'Résumé',
                  attributes: {
                    priceRange: 'Prix',
                  },
                },
                next_shows: {
                  name: 'Spectacles à venir',
                },
                past_shows: {
                  name: 'Spectacles passés',
                },
              },
            },
            followers: {
              name: 'Abonnés',
            },
            documents: {
              name: 'Documents',
              sections: {
                technical_docs: {
                  name: 'Documents Techniques',
                  docs: {
                    technical_epk: 'EPK',
                    technical_rider: 'Fiche Technique',
                    stage_plot: 'Plan de Scène',
                  },
                },
              },
            },
          },
        },
      },
      HomePage: {
        welcome: 'Bienvenue',
        news: 'Nouveautés',
        artists: 'Artistes',
        events: 'Événements',
        places: 'Endroits',
        industry_offer: {
          title: "Fais-tu partie de l'industrie musicale ?",
          call_to_action: 'Découvre notre proposition',
        },
      },
      EventsPages: {
        EventDetailsPage: {
          subpages: {
            general: {
              name: 'Info',
              sections: {
                general: {
                  name: 'Informations générales',
                  attributes: {
                    national_code: 'Code PULEP',
                    timetable__initial_date: 'Quand?',
                    initial_time: 'Heure',
                    minimumAge: 'Âge minimum',
                    timetable__openning_doors: 'Ouverture de porte',
                    promoter: 'Promoteur',
                    tickets_website: 'Site de billetterie',
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
              name: 'Artistes',
              sections: {
                main_artists: { name: 'Artistes principaux' },
                other_artists: { name: 'Autres artistes' },
              },
            },
            place: {
              name: 'Lieu',
              sections: {
                location: {
                  name: 'Place',
                },
              },
            },
            tickets: {
              name: 'Billets',
              sections: {
                general: {
                  name: 'Informations Générales',
                  attributes: {
                    tickets_website: 'Site Web des Billets',
                    price: 'Prix',
                  },
                },
              },
            },
            contact: {
              name: 'Contact & Media',
              sections: {
                contact: {
                  name: 'Informations du contact',
                },
                social_networks: {
                  name: 'Réseaux sociaux',
                },
              },
            },
            extra_info: {
              name: 'Extras',
              sections: {
                additional_info: { name: 'Informations supplémentaires' },
                dress_code: { name: 'Code vestimentaire' },
                discounts: { name: 'Reductions' },
                promoter: { name: 'Promoteur' },
              },
            },
          },
        },
      },
      PlacesPages: {
        PlacesDetailsPage: {
          subpages: {
            general: {
              name: 'Général',
              sections: {
                gallery: {
                  name: 'Galerie',
                },
                general: {
                  name: 'Infos Générales',
                  attributes: {
                    description: 'Description',
                    place_type: 'Type de lieu',
                    address: 'Adresse',
                    city: 'Ville',
                    cityWithCountry: 'Localisation',
                    categories: 'Catégories',
                    since: 'Depuis',
                    spoken_languages: 'Langues parlées',
                    stage_languages: 'Langues de scène',
                    arts_languages: 'Langues artistiques',
                    activity: 'Est-ce actif ?',
                    has_open_mic: 'A-t-il un micro ouvert ?',
                    total_audience_capacity: 'Capacité max.',
                    bookingRatesPolicy: 'Politiques de réservation',
                    regulatory_closing_time: 'Heure de fermeture réglementaire',
                  },
                },
                genres: {
                  name: 'Genres',
                },
                contact: {
                  name: 'Contact',
                  attributes: {
                    website: 'Site Web',
                    email: 'E-mail',
                    phone: 'Téléphone',
                    mobile_phone: 'Téléphone portable',
                    whatsapp: 'WhatsApp',
                  },
                },
                social_networks: {
                  name: 'Réseaux sociaux',
                },
              },
            },
            stats: {
              name: 'Statistiques',
              sections: {
                social_network_presence: {
                  name: 'Présence sur les réseaux sociaux',
                },
                rating: {
                  name: 'Évaluation',
                },
              },
            },
            shows: {
              name: 'Spectacles',
              sections: {
                next_shows: {
                  name: 'Prochains spectacles',
                },
                past_shows: {
                  name: 'Spectacles passés',
                },
              },
            },
            backline: {
              name: 'Backline',
              sections: {
                sound_backline: {
                  name: 'Backline sonore',
                },
                light_backline: {
                  name: 'Backline lumière',
                },
              },
            },
            menu: {
              name: 'Menu',
              sections: {
                main_course: {
                  name: 'Plat principal',
                },
                second_course: {
                  name: 'Second plat',
                },
              },
            },
            followers: {
              name: 'Abonnés',
            },
          },
        },
      },
    },
    appbase: {
      betabar: {
        contact_us: 'Contactez-nous',
        disclaimer:
          "Vous regardez une version de test de notre plateforme. Nous espérons qu'elle vous plaît. Vous pouvez nous contacter en utilisant le bouton ci-dessous.",
        our_email_is: 'Notre adresse e-mail est:',
      },
      claimProfileBanner: {
        PROFILE_AUTO_GENERATED_CAPTION:
          "Ce profil a été créé à partir d'informations publiques disponibles sur Internet. Est-ce le vôtre ? Prenez le contrôle de votre page gratuite pour la gérer et la mettre à jour.",
        PROFILE_CONFIRMATION_MESSAGE:
          'Merci de votre intérêt pour la gestion de ce profil. En cliquant sur « Prenez le contrôle », vous nous autorisez à lancer le processus de validation de propriété en votre nom. Une fois la propriété vérifiée, vous aurez accès au profil avec des rôles d’administrateur pour interagir avec vos fans et l’industrie musicale via tous les outils d’Artist Hive. <br />Veuillez noter que le processus de validation peut prendre entre 5 et 10 jours ouvrables. Vous serez informé par email ou via les réseaux sociaux du profil.',
        CLAIM_REQUEST_CONFIRMATION:
          "Votre demande a été enregistrée avec succès. Nous vous contacterons par email ou via les réseaux sociaux dès qu'elle sera traitée.",
        CLAIM_BUTTON: 'Prenez le contrôle',
      },
      reportProfileForm: {
        title: 'Signaler le profil',
        reason_label: 'Motif du signalement',
        reasons: {
          DUPLICATE: 'Profil en double',
          FAKE: 'Faux profil',
          WRONG_INFO: 'Informations erronées',
          BELONGS_TO_ME: "Ce profil m'appartient mais est attribué à quelqu'un d'autre",
          INAPPROPRIATE_CONTENT: 'Contenu inapproprié',
          OTHER: 'Autre',
        },
        description_label: 'Description',
        description_placeholder: 'Donnez-nous plus de détails sur ce signalement',
        submit_button: 'Envoyer le signalement',
        success_message: 'Votre signalement a été envoyé. Merci de nous aider à garder la plateforme sûre.',
        error_message: "Une erreur s'est produite lors de l'envoi de votre signalement. Veuillez réessayer.",
        duplicate_pending_error: 'Vous avez déjà un signalement en attente pour ce profil.',
      },
      footer: {
        columns: {
          what_we_do: {
            name: "Qu'est-ce qu'on fait ?",
            options: {
              cultural_agenda: 'Agenda culturel',
              for_academies: 'Pour les academies',
              for_artists: 'Pour les artistes',
              for_places: 'Pour les lieux',
              for_promoters: 'Pour les promoteurs',
              for_festivals: 'Pour les festivals',
            },
          },
          about_us: {
            name: 'À propos de nous',
            options: {
              history: 'Notre histoire',
              press: 'Presse',
              career: 'Carrière',
              download: "Télécharger l'application",
            },
          },
          help: {
            name: 'Aide',
            options: {
              data_policy: 'Politique de confidentialité',
              help_center: "Centre d'aide",
              contact_us: 'Contactez-nous',
              report: 'Signaler',
              terms: 'Conditions de service',
            },
          },
        },
        copyright: {
          allRightsReserved: 'Tous les droits sont réservés',
        },
      },
      search: {
        empty_results: {
          title: 'Aucun résultat ne correspond à votre recherche',
          suggestions: {
            statement: "Essayez l'une des suggestions suivantes",
            spelling: 'Vérifie ton orthographe',
            less_words: 'Utilisez des mots plus génériques ou moins de mots',
            related_things: 'Parcourir les catégories pour trouver des éléments similaires',
          },
        },
        filters: {
          title: 'Filtres',
          subpages: {
            general: {
              name: 'Général',
              sections: {
                general: {
                  name: 'Général',
                  attributes: {
                    genres: 'Genres',
                    cityWithCountry: 'Où?',
                  },
                },
                dates: {
                  name: 'Dates',
                  attributes: {
                    date: 'Quand?',
                  },
                },
                languages: {
                  name: 'Langues',
                  attributes: {
                    spoken_languages: 'Langues parlées',
                    stage_languages: 'Langues de scène',
                    arts_languages: 'Langues artistiques',
                  },
                },
              },
            },
            artists: {
              name: 'Artistes',
              sections: {
                general: {
                  name: 'Général',
                  attributes: {
                    is_available_at: 'Disponible à?',
                    has_albums: 'A des albums?',
                    music_awards: 'Récompenses musicales',
                  },
                },
                rating: {
                  name: 'Évaluation',
                  attributes: {
                    overall: 'Global',
                    talent: 'Talent',
                    performance: 'Performance',
                  },
                },
              },
            },
            places: {
              name: 'Lieux',
              sections: {
                stage: {
                  name: 'Scène',
                  attributes: {
                    stage_width: 'Largeur',
                    stage_length: 'Longueur',
                    stage_height: 'Hauteur',
                  },
                },
                backline: {
                  name: 'Backline',
                  attributes: {
                    mics: 'Micros',
                  },
                },
              },
            },
            social_networks: {
              name: 'Réseaux sociaux',
              sections: {
                presence: {
                  name: 'Présence',
                  attributes: {
                    has_social_networks: 'Possède ces réseaux?',
                  },
                },
              },
            },
          },
        },
        not_found_results: 'Aucun résultat trouvé',
        recommendations: 'Recommandations',
        result_view_types: {
          list: 'Liste',
          map: 'Carte',
        },
        results: 'Résultats',
        search: 'Chercher',
        search_placeholder: 'Artistes, événements, lieux...',
        see_more: 'Voir plus',
        what_are_you_looking_for: 'Que cherchez-vous ?',
        types: {
          ARTISTS: 'Artistes',
          PLACES: 'Lieux',
          EVENTS: 'Événements',
        },
        type_your_search: 'Ecrivez votre recherche',
      },
      sidenav: {
        name: 'Menu principal',
        sections: {
          general: {
            name: 'Général',
            options: {
              home: 'Accueil',
              cultural_agenda: 'Agenda culturel',
              opportunities: 'Opportunités',
              search: 'Rechercher',
            },
          },
          industry: {
            name: 'Industrie Musicale',
            options: {
              industry_member: "Faites-vous partie de l'industrie musicale ?",
            },
          },
          myInfo: {
            name: 'Mes info',
            options: {
              inbox: 'Boîte de réception',
              'inbox.nested': {
                incoming: 'Entrants',
                sent: 'Envoyés',
              },
              crew: 'Mon Crew',
              my_profile: 'Mon profil',
              my_bands: 'Mes bands',
              'my_bands.nested': { create: 'Créer une Band' },
              my_events: 'Mes événements',
              'my_events.nested': { create: 'Créer un événement' },
              my_riders: 'Mes riders',
              my_places: 'Mes lieux',
              'my_places.nested': { create: 'Créer un lieu' },
              favourites: 'Favoris',
              'favourites.nested': {
                saved: 'Enregistrés',
                tour_planning: 'Planification de tours',
              },
              my_prebooking_requests: 'Mes Demandes',
              my_calendar: 'Mon Calendrier',
            },
          },
          settings: {
            name: 'Paramètres',
            options: {
              settings: 'Paramètres',
              help_center: "Centre d'aide",
              report: 'Signaler',
              send_comments: 'Envoyer des commentaires',
              logout: 'Déconnexion',
            },
          },
        },
      },
    },
  },
};
