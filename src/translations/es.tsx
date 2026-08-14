export const EsMessages = {
  app: {
    name: 'App ES',
    loading: 'Cargando...',
    general: {
      not_found_page: {
        title: 'Ups! No encontramos lo que buscas',
      },
    },
    domain_global_dictionary: { errors: {} },
    global_dictionary: {
      artists_hive: {
        slogan: 'Crea, Conecta, Vuela...',
      },
      dietary_restrictions: {
        none: 'Ninguna',
        vegetarian: 'Vegetariano',
        vegan: 'Vegano',
        celiac: 'Celíaco',
      },
      genders: {
        male: 'Hombre',
        female: 'Mujer',
        non_binary: 'No binario',
        non_specified: 'No especificado',
      },
      art_types: {
        dance: 'Danza',
        music: 'Música',
        painting: 'Pintura',
        poetry: 'Poesía',
        photography: 'Fotografía',
        standup_comedy: 'Stand-up Comedy',
        theatre: 'Teatro',
        video: 'Video',
      },
      actions: {
        add: 'Añadir',
        accounts: {
          create_account: 'Crear cuenta',
          forgot_password: 'Olvidé mi contraseña',
          login: 'Iniciar sesión',
          password: 'Contraseña',
          phone_number: 'Número de teléfono',
          phone_number_placeholder: '1234567890',
          remember_me: 'Recuérdame',
          signup: 'Registrarse',
          username_or_email: 'Nombre de usuario o correo electrónico',
        },
        create: 'Crear',
        edit: 'Editar',
        follow_us: 'Síguenos',
        save: 'Guardar',
        cancel: 'Cancelar',
        link_copied_to_clipboard: 'Enlace copiado al portapapeles',
        navigation: {
          back: 'Atrás',
          first: 'Primero',
          home: 'Inicio',
          last: 'Último',
          next: 'Siguiente',
          previous: 'Anterior',
          refresh: 'Actualizar',
          submit: 'Enviar',
          cancel: 'Cancelar',
          close: 'Cerrar',
          open: 'Abrir',
          save: 'Guardar',
        },
        report: 'Denunciar',
        selection: {
          select_all: 'Seleccionar todos',
          clear_selection: 'Quitar selección',
        },
        share: 'Compartir',
        show_more: 'Mostrar más',
        show_less: 'Mostrar menos',
        submit: 'Enviar',
        subscription: {
          subscribe: 'Suscribirse',
          unsubscribe: 'Cancelar',
        },
        upload: 'Cargar',
        files_limit_exceded: 'Número máximo de archivos permitidos superado',
      },
      entities: {
        academies: { plural: 'Academias', singular: 'Academia' },
        artists: { plural: 'Artistas', singular: 'Artista' },
        events: { plural: 'Eventos', singular: 'Evento' },
        places: { plural: 'Lugares', singular: 'Lugar' },
        promoters: { plural: 'Promotores', singular: 'Promotor' },
        prebooking_requests: { plural: 'Pre-Reservas', singular: 'Pre-Reserva' },
        users: {
          plural: 'Usuarios',
          singular: 'Usuario',
          attributes: {
            agrees_to_a_blood_transfusion: {
              label: '¿Acepta transfusiones sanguíneas?',
              values: {
                true: 'Acepta transfusiones sanguíneas',
                false: 'No acepta transfusiones sanguíneas',
              },
            },
            birthdate: 'Fecha de nacimiento',
            birthplace: 'Lugar de nacimiento',
            fullname: 'Nombre completo',
            gender: 'Género',
            given_names: 'Nombres',
            home_city: 'Ciudad de residencia',
            stage_name: 'Nombre artístico',
            surnames: 'Apellidos',
          },
        },
      },
      errors: {
        // Data error
        NOT_AVAILABLE: 'No disponible',
        NO_RESULTS: 'Sin resultados',

        // Errores de Autenticación y Autorización
        AUTH_INVALID_CREDENTIALS: 'Credenciales inválidas',
        AUTH_USER_NOT_FOUND: 'Usuario no encontrado',
        AUTH_NO_USER_PROVIDED: 'No se proporcionó usuario',
        AUTH_NO_PASSWORD_PROVIDED: 'No se proporcionó contraseña',
        AUTH_NO_TOKEN_PROVIDED: 'No se proporcionó token',
        AUTH_WRONG_PASSWORD: 'Contraseña incorrecta',
        AUTH_TOKEN_EXPIRED: 'Token expirado',
        AUTH_TOKEN_INVALID: 'Token inválido',
        AUTH_PERMISSION_DENIED: 'Permiso denegado',
        AUTH_LOGIN_REQUIRED: 'Para ver este contenido debes iniciar sesión.',

        // Errores de Red
        NETWORK_ERROR: 'Error de red',
        NETWORK_TIMEOUT: 'Tiempo de espera de red agotado',
        NETWORK_NOT_CONNECTED: 'No conectado a la red',

        // Errores de Validación
        VALIDATION_EMAIL_INVALID: 'Correo electrónico inválido',
        VALIDATION_PASSWORD_WEAK: 'Contraseña débil',
        VALIDATION_FIELD_REQUIRED: 'Campo requerido',
        VALIDATION_USERNAME_TAKEN: 'Nombre de usuario ya tomado',
        VALIDATION_USERNAME_FORMAT:
          'El nombre de usuario solo puede contener minúsculas, números, guion bajo y punto (3-24 caracteres, sin espacios).',

        // Errores de Usuario
        USER_PROFILE_NOT_FOUND: 'Perfil de usuario no encontrado',
        USER_PROFILE_UPDATE_FAILED: 'Actualización del perfil de usuario fallida',
        USER_ACCOUNT_SUSPENDED: 'Cuenta de usuario suspendida',
        USER_ACCOUNT_DELETED: 'Cuenta de usuario eliminada',

        // Errores de Contenido
        CONTENT_NOT_FOUND: 'Contenido no encontrado',
        CONTENT_UPLOAD_FAILED: 'Carga de contenido fallida',
        CONTENT_TOO_LARGE: 'Contenido demasiado grande',
        CONTENT_TYPE_NOT_SUPPORTED: 'Tipo de contenido no soportado',

        // Errores de Amistad/Conexión
        CONNECTION_REQUEST_FAILED: 'Solicitud de conexión fallida',
        CONNECTION_ALREADY_EXISTS: 'Conexión ya existente',
        CONNECTION_NOT_FOUND: 'Conexión no encontrada',

        // Errores de Mensajes
        MESSAGE_SEND_FAILED: 'Envío de mensaje fallido',
        MESSAGE_NOT_FOUND: 'Mensaje no encontrado',
        MESSAGE_CONTENT_INVALID: 'Contenido del mensaje inválido',

        // Errores de Publicación
        POST_CREATE_FAILED: 'Creación de la publicación fallida',
        POST_NOT_FOUND: 'Publicación no encontrada',
        POST_UPDATE_FAILED: 'Actualización de la publicación fallida',
        POST_DELETE_FAILED: 'Eliminación de la publicación fallida',

        // Errores de Pago
        PAYMENT_FAILED: 'Pago fallido',
        PAYMENT_METHOD_INVALID: 'Método de pago inválido',
        PAYMENT_INSUFFICIENT_FUNDS: 'Fondos insuficientes',

        // Errores del Servidor
        SERVER_ERROR: 'Error del servidor',
        SERVER_MAINTENANCE: 'Mantenimiento del servidor',

        // Errores Desconocidos
        UNKNOWN_ERROR: 'Error desconocido',
      },
      follows: {
        followers: 'Seguidores',
        following: 'Siguiendo',
        in_common: 'En común',
        errors: {
          NO_FOLLOWING: 'Este perfil no está siguiendo a nadie.',
          NO_FOLLOWERS: 'Este perfil no tiene seguidores.',
          NO_COMMON_FOLLOWERS: 'No hay seguidores en común.',
        },
      },
      prebooking: {
        title: 'Pre-Reservas',
        singular: 'Pre-Reserva',
        create: 'Crear Pre-Reserva',
        create_short: 'Nueva Pre-Reserva',
        dashboard: 'Panel de Pre-Reservas',
        status: {
          DRAFT: 'Borrador',
          PENDING: 'Pendiente',
          PARTIALLY_VIEWED: 'Parcialmente Vista',
          PARTIALLY_ACCEPTED: 'Parcialmente Aceptada',
          ALL_ACCEPTED: 'Totalmente Aceptada',
          REJECTED: 'Rechazada',
          CANCELLED: 'Cancelada',
          CONVERTED: 'Convertida a Evento',
          EXPIRED: 'Expirada',
        },
        approval_status: {
          ALL_PENDING: 'Todos Pendientes',
          PARTIAL: 'Parcial',
          ALL_APPROVED: 'Todos Aprobados',
          REJECTED: 'Rechazado',
        },
        participant_status: {
          pending: 'Pendiente',
          viewed: 'Visto',
          interested: 'Interesado',
          not_interested: 'No interesado',
        },
        request_type: {
          single_date: 'Fecha Única',
          date_range: 'Rango de Fechas',
          week: 'Semana',
          month: 'Mes',
          quarter: 'Trimestre',
        },
        fields: {
          event_name: 'Nombre del Evento',
          description: 'Descripción',
          requested_date_start: 'Fecha de Inicio',
          requested_date_end: 'Fecha de Fin',
          request_type: 'Tipo de Reserva',
          flexible_dates: 'Fechas Flexibles',
          alternative_dates: 'Fechas Alternativas',
          expected_attendance: 'Asistencia Esperada',
          response_deadline: 'Plazo de Respuesta',
          requester: 'Solicitante',
          recipients: 'Destinatarios',
          additional_participants: 'Participantes Adicionales',
          notes: 'Notas',
          participants: 'Participantes',
        },
        actions: {
          approve: 'Aprobar',
          reject: 'Rechazar',
          cancel: 'Cancelar',
          convert_to_event: 'Convertir a Evento',
          edit: 'Editar',
          add_note: 'Agregar Nota',
          view_details: 'Ver Detalles',
          send_request: 'Enviar Solicitud',
        },
        tabs: {
          received: 'Recibidas',
          sent: 'Enviadas',
          all: 'Todas',
          pending: 'Pendientes',
          accepted: 'Aceptadas',
          rejected: 'Rechazadas',
        },
        messages: {
          create_success: 'Pre-reserva creada exitosamente',
          approve_success: 'Pre-reserva aprobada exitosamente',
          reject_success: 'Pre-reserva rechazada',
          cancel_success: 'Pre-reserva cancelada',
          convert_success: 'Pre-reserva convertida a evento exitosamente',
          update_success: 'Pre-reserva actualizada',
          no_requests_found: 'No se encontraron pre-reservas',
          requires_action: 'Requiere tu acción',
          approval_progress: '{approved} de {total} aprobaron',
          deadline_warning: 'Expira en {days} días',
          expired: 'Esta solicitud ha expirado',
        },
        errors: {
          create_failed: 'Error al crear la pre-reserva',
          load_failed: 'Error al cargar pre-reservas',
          approve_failed: 'Error al aprobar',
          reject_failed: 'Error al rechazar',
          cancel_failed: 'Error al cancelar',
          convert_failed: 'Error al convertir a evento',
          no_permission: 'No tienes permiso para esta acción',
          already_responded: 'Ya has respondido a esta solicitud',
          invalid_dates: 'Las fechas seleccionadas no son válidas',
          past_date: 'No puedes crear una reserva para una fecha pasada',
        },
        tooltips: {
          flexible_dates: 'Permite sugerir fechas alternativas',
          auto_approved: 'Aprobado automáticamente al crear',
          requires_all_types: 'Requiere al menos una aprobación de cada tipo de perfil',
          can_cancel: 'Solo el solicitante puede cancelar',
          can_convert: 'Se puede convertir cuando todos aprueban',
        },
      },
      location: {
        borough: 'Barrio',
        canton: 'Cantón',
        city: 'Ciudad',
        county: 'Condado',
        continent: 'Continente',
        country: 'País',
        department: 'Departamento',
        district: 'Distrito',
        hamlet: 'Aldea',
        location: 'Ubicación',
        municipality: 'Municipio',
        province: 'Provincia',
        region: 'Región',
        state: 'Estado',
        town: 'Pueblo',
        village: 'Pueblo',
      },
      location_info: {
        search_country_or_code: 'Buscar país o código...',
      },
      social_networks_analytics: {
        metrics: {
          followers: 'Seguidores',
          subscribers: 'Suscriptores',
          monthly_listeners: 'Oyentes mensuales',
          total_streams: 'Reproducciones totales',
          save_rate: 'Tasa de guardado',
          radio_streams: 'Streams de radio',
          playlist_reach: 'Alcance de la lista de reproducción',
          posts: 'Publicaciones',
          avg_likes: 'Promedio de likes',
          engagement_rate: 'Engagement rate',
          avg_reach: 'Alcance promedio',
          total_likes: 'Total me gusta',
          videos_published: 'Videos publicados',
          video_views: 'Vistas de video',
          posts_content: 'Contenido publicaciones',
          shares: 'Compartidos',
          total_views: 'Vistas totales',
          monthly_video_views: 'Videos vistos mensuales',
          watch_time: 'Tiempo de visualización',
          new_subscribers: 'Nuevos suscriptores',
          page_likes: 'Me gusta de página',
          weekly_reach: 'Alcance semanal',
          engagement: 'Engagement',
          tweets: 'Tweets',
          monthly_impressions: 'Impresiones mensuales',
          mentions: 'Menciones',
          total_plays: 'Reproducciones totales',
          stations_featuring_artist: 'Estaciones que incluyen artista',
          thumbs_up: 'Thumbs up',
          shazams: 'Shazams',
        },
      },
      stats: {
        rating: {
          overall: 'Calificación general',
          stage: 'Escenario',
          sound: 'Sonido',
          backline: 'Equipo técnico',
          lights: 'Luces',
          dressing_room: 'Camarín',
          hospitality_food: 'Alimentos de hospitalidad',
          hospitality_drinks: 'Bebidas de hospitalidad',
          timeliness: 'Puntualidad',
          communication: 'Comunicación',
          transportation: 'Transporte',
          logistic: 'Logística',
          location: 'Ubicación',
          seating_capacity: 'Capacidad de asientos',
          total_rates: 'Calificaciones totales',
          talent: 'Talento',
          performance: 'Desempeño',
          proffesionalism: 'Profesionalismo',
          stage_presence: 'Presencia en el escenario',
          charisma: 'Carisma',
          respectfulness: 'Respeto',
        },
      },
    },
    pages: {
      app: {
        settings: {
          title: 'Configuración',
          language_selection: {
            title: 'Selección de idioma',
          },
          user_profile: {
            title: 'Perfil del usuario',
            user: 'Usuario',
            logout: 'Cerrar sesión',
            logged_user: 'Usuario actual',
            empty_user: 'No hay usuario',
            user_info: 'Información del usuario',
            roles: 'Roles',
            artist: 'Artista',
            place: 'Lugar',
          },
        },
      },

      app_base: {
        LoginPage: {
          paragraph1:
            'Estás viendo una versión de prueba de nuestra plataforma. Actualmente estamos con el registro de usuarios limitado.',
          paragraph2:
            'Si quieres unirte a la colmena de artistas, te invitamos a registrarte haciendo clic en el siguiente botón.',
          paragraph3:
            'Recuerda que te puedes registrar siendo parte del ecosistema musical o también como un fan. Regístrate y ten presente la agenda cultural, recibirás notificaciones y alertas para eventos de tu interés.',
          button: 'Registrarme en la versión de prueba',
        },
        UsersPages: {
          UsersDetailsPage: {
            fillProfileBanner: {
              content:
                'Antes de continuar usando todos los beneficios de Artist Hive es necesario que completes tu perfil personal.',
            },
            subpages: {
              general: {
                name: 'General',
                sections: {
                  general: {
                    name: 'Info General',
                    attributes: {
                      given_names: 'Nombres',
                      surnames: 'Apellidos',
                      stage_name: 'Nombre artístico',
                      fullname: 'Nombre completo',
                      gender: 'Género',
                      birthdate: 'Fecha de nacimiento',
                      birthplace: 'Lugar de nacimiento',
                      home_city: 'Ciudad de residencia',
                    },
                  },
                  contact: {
                    name: 'Contacto',
                  },
                },
              },
              artist_info: {
                name: 'Info Pro',
                sections: {
                  emergency_contact: {
                    name: 'Contacto de emergencia',
                  },
                  artists_info: {
                    name: 'Información del artista',
                    attributes: {
                      user_language: 'Idioma del usuario',
                      spoken_languages: 'Idiomas hablados',
                      blood_group: 'Grupo sanguíneo',
                      dietary_restrictions: 'Restricciones dietéticas',
                      allergies: 'Alergias',
                    },
                  },
                },
              },
              arts: {
                name: 'Artes',
                sections: {
                  music: {
                    name: 'Música',
                    attributes: {
                      played_instruments: 'Instrumentos interpretados',
                    },
                  },
                  dance: {
                    name: 'Danza',
                  },
                  photography: {
                    name: 'Fotografía',
                  },
                  video: {
                    name: 'Video',
                  },
                  painting: {
                    name: 'Pintura',
                  },
                  poetry: {
                    name: 'Poesía',
                  },
                  standup_comedy: {
                    name: 'Stand-up Comedy',
                  },
                  awards: {
                    name: 'Premios',
                  },
                },
              },
              memberships: {
                name: 'Membresías',
                sections: {
                  artists: {
                    name: 'Artistas',
                  },
                  places: {
                    name: 'Lugares',
                  },
                },
              },
              my_shows: {
                name: 'Mis eventos',
                sections: {
                  next_shows: {
                    name: 'Próximos eventos',
                  },
                  past_shows: {
                    name: 'Eventos pasados',
                  },
                },
              },
              my_liked_shows: {
                name: 'Mis eventos favoritos',
                sections: {
                  next_shows: {
                    name: 'Próximos eventos',
                  },
                  past_shows: {
                    name: 'Eventos pasados',
                  },
                },
              },
            },
          },
          activate_industry_banner: {
            banner: {
              title: '¿Eres miembro de la industria?',
              content: 'Accede a todas las herramientas para artistas, agentes, venues y otros profesionales.',
            },
            button: 'Activar ahora',
          },
        },
      },
      domain: {
        CulturalAgenda: {
          title: 'Agenda cultural',
        },
        AcademiesPages: {
          AcademiesDetailsPage: {
            subpages: {
              general: {
                name: 'General',
                sections: {
                  gallery: {
                    name: 'Galería',
                  },
                  general: {
                    name: 'Info general',
                    attributes: {
                      description: 'Descripción',
                      address: 'Dirección',
                      city: 'Ciudad',
                      categories: 'Categorías',
                      since: 'Desde',
                      spoken_languages: 'Idiomas hablados',
                    },
                  },
                  contact: {
                    name: 'Contacto',
                    attributes: {
                      website: 'Website',
                      email: 'e-mail',
                      phone: 'Teléfono',
                      mobile_phone: 'Móvil',
                      whatsapp: 'WhatsApp',
                    },
                  },
                  social_networks: {
                    name: 'Redes sociales',
                  },
                },
              },

              social: {
                name: 'Social',
                sections: {
                  social_network_presence: {
                    name: 'Presencia en redes sociales',
                  },
                  stats: {
                    name: 'Estadísticas',
                    attributes: {
                      general_rate: 'Calificación general',
                      followers: 'Seguidores',
                      event_followers: 'Seguidores en eventos',
                    },
                  },
                },
              },
              shows: {
                name: 'Shows',
                sections: {
                  next_shows: {
                    name: 'Próximos eventos',
                  },
                  past_shows: {
                    name: 'Eventos pasados',
                  },
                },
              },
              backline: {
                name: 'Backline',
                sections: {
                  sound_backline: {
                    name: 'Backline sonoro',
                  },
                  light_backline: {
                    name: 'Backline de luces',
                  },
                },
              },
              menu: {
                name: 'Menú',
                sections: {
                  main_course: { name: 'Plato principal' },
                  second_course: { name: 'Segundo plato' },
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
                      since: 'Desde',
                      home_city: 'Ciudad de origen',
                      categories: 'Categorías',
                      spoken_languages: 'Idiomas hablados',
                      stage_languages: 'Idiomas de escenario',
                      arts_languages: 'Idiomas artísticos',
                    },
                  },
                  contact: {
                    name: 'Contacto',
                    attributes: {
                      production_manager_phone: 'Teléfono del gerente de producción',
                      tour_manager_phone: 'Teléfono del tour manager',
                    },
                  },
                  general_technical_features: {
                    name: 'Características técnicas generales',
                    attributes: {
                      frecuency_response: 'Respuesta de frecuencia',
                      sound_pressure: 'Presión sonora',
                      foh_distance: 'Distancia FOH',
                    },
                  },
                },
              },
              people: {
                name: 'Personas',
                sections: {
                  staff: {
                    name: 'Equipo',
                  },
                  allergies: {
                    name: 'Alergias',
                  },
                  rooming_list: {
                    name: 'Lista de hospedaje',
                  },
                  external_transportation: {
                    name: 'Transporte externo',
                    attributes: {
                      albums: 'Vuelos',
                    },
                  },
                  internal_transportation: {
                    name: 'Transporte interno',
                    attributes: {
                      albums: 'Transporte terrestre',
                    },
                  },
                },
              },
              technical_requirements: {
                name: 'Requisitos técnicos',
                sections: {
                  staging: {
                    name: 'Escenografía',
                  },
                  audio_requirements: {
                    name: 'Requisitos de audio',
                    attributes: {
                      channelNumber: 'Número de canal',
                      instrumentName: 'Nombre del instrumento',
                      microphone: 'Micrófono',
                      inserts: 'Insertos',
                      mixNumber: 'Número de mezcla',
                      description: 'Descripción',
                      monitor: 'Monitor',
                    },
                  },
                  video_requirements: {
                    name: 'Requisitos de video',
                  },
                  lights_requirements: {
                    name: 'Requisitos de iluminación',
                  },
                  stage_design: {
                    name: 'Diseño de escenario',
                  },
                  special_effects: {
                    name: 'Efectos especiales',
                  },
                },
              },
              backline: {
                name: 'Backline',
                sections: {
                  external_required_backline: {
                    name: 'Backline externo requerido',
                  },
                  owned_backline: {
                    name: 'Backline propio',
                  },
                },
              },
              sound_test: {
                name: 'Prueba de sonido',
                sections: {
                  timing: {
                    name: 'Tiempo',
                  },
                },
              },
            },
          },
        },
        IndustryOfferPage: {
          create_account_banner: 'Únete a la colmena',
        },
        TourPlansPages: {
          TourPlanDetailsPage: {
            tourPlanNotFound: 'Tour no encontrado',
            subpages: {
              general: {
                name: 'General',
                sections: {
                  dates: {
                    name: 'Fechas',
                    attributes: {
                      initial_date: 'Fecha Inicial',
                      final_date: 'Fecha Final',
                      total_days: 'Días Totales',
                      events_state_summary: 'Eventos',
                    },
                  },
                  shows: {
                    name: 'Espectáculos',
                  },
                },
              },
              dates: {
                name: 'Fechas',
              },
              budget: {
                name: 'Presupuesto',
                sections: {
                  internal_transportation: {
                    name: 'Transporte Interno',
                  },
                  intercity_transportation: {
                    name: 'Transporte entre Ciudades',
                  },
                  accommodation: {
                    name: 'Alojamiento',
                  },
                  food: {
                    name: 'Comida',
                  },
                },
              },
              wishes: {
                name: 'Deseos',
                sections: {
                  guest_artists: {
                    name: 'Artistas Invitados',
                  },
                  possible_shows: {
                    name: 'Espectáculos Posibles',
                  },
                },
              },
              settings: {
                name: 'Configuración',
              },
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
                  name: 'Galería del artista',
                  attributes: {
                    members: 'Miembros',
                    live: 'En vivo',
                  },
                },
                live_gallery: {
                  name: 'Galería en vivo',
                },
                artist_members: {
                  name: 'Galería de miembros',
                },
                general: {
                  name: 'Info General',
                  attributes: {
                    description: 'Descripción',
                    since: 'Desde',
                    home_city: 'Ciudad de residencia',
                    categories: 'Categorías',
                    genres: 'Géneros',
                    spoken_languages: 'Idiomas hablados',
                    stage_languages: 'Idiomas en vivo',
                    arts_languages: 'Idiomas en artes',
                  },
                },
                genres: {
                  name: 'Géneros',
                },
                contact: {
                  name: 'Contacto',
                  attributes: {
                    website: 'Sitio web',
                    email: 'Correo electrónico',
                    phone: 'Teléfono',
                    mobile_phone: 'Teléfono móvil',
                    whatsapp: 'WhatsApp',
                  },
                },
                social_networks: {
                  name: 'Redes sociales',
                },
                record_label: {
                  name: 'Sello discográfico',
                },
                members: {
                  name: 'Miembros',
                },
              },
            },
            members: {
              name: 'Miembros',
              sections: {
                music_performance: {
                  name: 'Instrumentos',
                  attributes: {
                    member_names: 'Nombres',
                    member_surenames: 'Apellidos',
                    member_role: 'Rol',
                    member_instrument: 'Instrumento',
                  },
                },
                audio_engineering: {
                  name: 'Ingeniería de sonido',
                },
                visual_arts: {
                  name: 'Visuales',
                },
                management: {
                  name: 'Management',
                },
                production: {
                  name: 'Producción',
                },
                support: {
                  name: 'Soporte',
                },
              },
            },
            arts: {
              name: 'Artes',
              sections: {
                discography: {
                  name: 'Discografía',
                  attributes: {
                    albums: 'Álbums',
                    top_tracks: 'Canciones más escuchadas',
                    dvd_video: 'DVD / Video',
                  },
                },
                media_channels: {
                  name: 'Canales multimedia',
                },
                gallery: {
                  name: 'Galería',
                  attributes: {
                    photos: 'Fotos',
                    video: 'Video',
                  },
                },
                awards: {
                  name: 'Premios',
                },
              },
            },
            social: {
              name: 'Social',
              sections: {
                social_network_presence: {
                  name: 'Presencia en redes',
                },
                stats: {
                  name: 'Estadísticas',
                  attributes: {
                    general_rate: 'Calificación general',
                    followers: 'Seguidores',
                    event_followers: 'Seguidores de eventos',
                  },
                },
                rating: {
                  name: 'Calificaciones',
                },
              },
            },
            shows: {
              name: 'Shows',
              sections: {
                summary: {
                  name: 'Resumen',
                  attributes: {
                    priceRange: 'Precios',
                  },
                },
                next_shows: {
                  name: 'Próximos eventos',
                },
                past_shows: {
                  name: 'Eventos pasados',
                },
              },
            },
            followers: {
              name: 'Seguidores',
            },
            documents: {
              name: 'Documentos',
              sections: {
                technical_docs: {
                  name: 'Documentos Técnicos',
                  docs: {
                    technical_epk: 'EPK',
                    technical_rider: 'Rider Técnico',
                    stage_plot: 'Plano de Escenario',
                  },
                },
              },
            },
          },
        },
      },
      HomePage: {
        welcome: 'Bienvenido',
        news: 'Novedades',
        artists: 'Artistas',
        events: 'Eventos',
        places: 'Lugares',
        industry_offer: {
          title: '¿Eres parte de la industria musical?',
          call_to_action: 'Conoce nuestra propuesta',
        },
      },
      EventsPages: {
        EventDetailsPage: {
          subpages: {
            general: {
              name: 'Info',
              sections: {
                general: {
                  name: 'Información General',
                  attributes: {
                    national_code: 'Cód. PULEP',
                    timetable__initial_date: '¿Cuándo?',
                    initial_time: 'Hora',
                    minimumAge: 'Edad mínima',
                    timetable__openning_doors: 'Apertura de puertas',
                    promoter: 'Responsable',
                    tickets_website: 'Sitio web de entradas',
                  },
                },
                description: {
                  name: 'Descripción',
                },
                genres: {
                  name: 'Géneros',
                },
              },
            },
            artists: {
              name: 'Artistas',
              sections: {
                main_artists: { name: 'Artistas principales' },
                other_artists: { name: 'Otros artistas' },
              },
            },
            place: {
              name: 'Lugar',
              sections: {
                location: {
                  name: 'Ubicación',
                },
              },
            },
            tickets: {
              name: 'Entradas',
              sections: {
                general: {
                  name: 'Información General',
                  attributes: {
                    tickets_website: 'Sitio Web de Entradas',
                    price: 'Precio',
                  },
                },
              },
            },
            contact: {
              name: 'Contacto & Redes',
              sections: {
                contact: {
                  name: 'Info de contacto',
                },
                social_networks: {
                  name: 'Redes sociales',
                },
              },
            },
            extra_info: {
              name: 'Extras',
              sections: {
                additional_info: { name: 'Información adicional' },
                dress_code: { name: 'Código de vestimenta' },
                discounts: { name: 'Descuentos' },
                promoter: { name: 'Responsable' },
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
                  name: 'Galería',
                },
                general: {
                  name: 'Información General',
                  attributes: {
                    description: 'Descripción',
                    address: 'Dirección',
                    city: 'Ciudad',
                    cityWithCountry: 'Ubicación',
                    categories: 'Categorías',
                    since: 'Desde',
                    spoken_languages: 'Idiomas hablados',
                    stage_languages: 'Idiomas en escena',
                    arts_languages: 'Idiomas en artes',
                    activity: '¿Está activo?',
                    has_open_mic: '¿Tiene micrófono abierto?',
                    total_audience_capacity: 'Aforo máx.',
                    bookingRatesPolicy: 'Políticas de reserva',
                    regulatory_closing_time: 'Hora de cierre reglamentaria',
                  },
                },
                genres: {
                  name: 'Géneros',
                },
                contact: {
                  name: 'Contacto',
                  attributes: {
                    website: 'Sitio web',
                    email: 'Correo electrónico',
                    phone: 'Teléfono',
                    mobile_phone: 'Teléfono móvil',
                    whatsapp: 'WhatsApp',
                  },
                },
                social_networks: {
                  name: 'Redes sociales',
                },
              },
            },
            stats: {
              name: 'Estadísticas',
              sections: {
                social_network_presence: {
                  name: 'Presencia en redes sociales',
                },
                rating: {
                  name: 'Calificación',
                },
              },
            },
            shows: {
              name: 'Espectáculos',
              sections: {
                next_shows: {
                  name: 'Próximos espectáculos',
                },
                past_shows: {
                  name: 'Espectáculos pasados',
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
              name: 'Menú',
              sections: {
                main_course: {
                  name: 'Plato principal',
                },
                second_course: {
                  name: 'Segundo plato',
                },
              },
            },
            followers: {
              name: 'Seguidores',
            },
          },
        },
      },
    },
    appbase: {
      betabar: {
        contact_us: 'Contáctanos',
        disclaimer:
          'Estás viendo una versión de prueba de nuestra plataforma. Esperamos que te guste, puedes comunicarte con nosotros usando el botón que está a continuación.',
        our_email_is: 'Nuestro email es:',
      },
      claimProfileBanner: {
        PROFILE_AUTO_GENERATED_CAPTION:
          'Este perfil fue creado con información pública disponible en internet. ¿Es tuyo? Reclama tu perfil gratuito para administrarlo y actualizarlo.',
        PROFILE_CONFIRMATION_MESSAGE:
          'Gracias por tu interés en reclamar este perfil. Al oprimir el botón de "Reclamar perfil" nos autorizas para iniciar el proceso de validación de titularidad del perfil a tu nombre. Una vez la titularidad sea validada, podrás acceder al perfil con los roles de administración para que puedas interactuar con tus fans y la  industria musical a través de todas las herramientas de Artist Hive.                 <br />Ten presente que el proceso de validación puede tomar entre 5 y 10 días hábiles. Te avisaremos por correo electrónico o a través de las redes sociales del perfil.',
        CLAIM_REQUEST_CONFIRMATION:
          'Tu solicitud ha sido registrada exitosamente. Te contactaremos vía email o a través de las redes sociales tan pronto sea resuelta.',
        CLAIM_BUTTON: 'Reclamar perfil',
      },
      reportProfileForm: {
        title: 'Reportar perfil',
        reason_label: 'Motivo del reporte',
        reasons: {
          DUPLICATE: 'Perfil duplicado',
          FAKE: 'Perfil falso',
          WRONG_INFO: 'Información errónea',
          BELONGS_TO_ME: 'Este perfil me pertenece pero está asignado a otra persona',
          INAPPROPRIATE_CONTENT: 'Contenido inapropiado',
          OTHER: 'Otro',
        },
        description_label: 'Descripción',
        description_placeholder: 'Cuéntanos más detalles sobre este reporte',
        submit_button: 'Enviar reporte',
        success_message: 'Tu reporte ha sido enviado. Gracias por ayudarnos a mantener la plataforma segura.',
        error_message: 'Ocurrió un error al enviar tu reporte. Inténtalo nuevamente.',
        duplicate_pending_error: 'Ya tienes un reporte pendiente para este perfil.',
      },
      footer: {
        columns: {
          what_we_do: {
            name: '¿Qué hacemos?',
            options: {
              cultural_agenda: 'Agenda Cultural',
              for_academies: 'Para academias',
              for_artists: 'Para Artistas',
              for_places: 'Para lugares',
              for_promoters: 'Para promotores',
              for_festivals: 'Para festivales',
            },
          },
          about_us: {
            name: 'Nosotros',
            options: {
              history: 'Historia',
              press: 'Prensa',
              career: 'Carrera',
              download: 'Descarga',
            },
          },
          help: {
            name: '¿Ayuda?',
            options: {
              data_policy: 'Política de datos',
              help_center: 'Centro de ayuda',
              contact_us: 'Contáctanos',
              report: 'Reporta',
              terms: 'Términos de Servicio',
            },
          },
        },
        copyright: {
          allRightsReserved: 'Todos los derechos reservados',
        },
      },
      search: {
        empty_results: {
          title: 'No hay resultados que coincidan con tu búsqueda',
          suggestions: {
            statement: 'Intenta alguna de las siguientes sugerencias',
            spelling: 'Revisa la ortografía',
            less_words: 'Utiliza palabras más genéricas o menos palabras',
            related_things: 'Navega por las categorías para encontrar elementos similares',
          },
        },
        filters: {
          title: 'Filtros',
          subpages: {
            general: {
              name: 'General',
              sections: {
                general: {
                  name: 'General',
                  attributes: {
                    genres: 'Géneros',
                    cityWithCountry: '¿Dónde?',
                  },
                },
                dates: {
                  name: 'Fechas',
                  attributes: {
                    date: '¿Cuándo?',
                  },
                },
                languages: {
                  name: 'Idiomas',
                  attributes: {
                    spoken_languages: 'Idiomas hablados',
                    stage_languages: 'Idiomas de escenario',
                    arts_languages: 'Idiomas artísticos',
                  },
                },
              },
            },
            artists: {
              name: 'Artistas',
              sections: {
                general: {
                  name: 'General',
                  attributes: {
                    is_available_at: 'Disponible en',
                    has_albums: '¿Tiene álbumes?',
                    music_awards: 'Premios musicales',
                  },
                },
                rating: {
                  name: 'Valoración',
                  attributes: {
                    overall: 'En general',
                    talent: 'Talento',
                    performance: 'Rendimiento',
                  },
                },
              },
            },
            places: {
              name: 'Lugares',
              sections: {
                stage: {
                  name: 'Escenario',
                  attributes: {
                    stage_width: 'Ancho',
                    stage_length: 'Largo',
                    stage_height: 'Alto',
                  },
                },
                backline: {
                  name: 'Backline',
                  attributes: {
                    mics: 'Micrófonos',
                  },
                },
              },
            },
            social_networks: {
              name: 'Redes Sociales',
              sections: {
                presence: {
                  name: 'Presencia',
                  attributes: {
                    has_social_networks: '¿Tiene estas redes?',
                  },
                },
              },
            },
          },
        },
        not_found_results: 'No se encontraron resultados',
        recommendations: 'Recomendaciones',
        result_view_types: {
          list: 'Lista',
          map: 'Mapa',
        },
        results: 'Resultados',
        search: 'Buscar',
        search_placeholder: 'Artistas, eventos, lugares...',
        see_more: 'Ver más',
        what_are_you_looking_for: '¿Qué buscas?',
        types: {
          ARTISTS: 'Artistas',
          PLACES: 'Lugares',
          EVENTS: 'Eventos',
        },
        type_your_search: 'Escribe tu búsqueda',
      },
      sidenav: {
        name: 'Menú principal',
        sections: {
          general: {
            name: 'General',
            options: {
              home: 'Inicio',
              cultural_agenda: 'Agenda cultural',
              opportunities: 'Oportunidades',
              search: 'Buscar',
            },
          },
          industry: {
            name: 'Industria Musical',
            options: {
              industry_member: '¿Perteneces a la industria musical?',
            },
          },
          myInfo: {
            name: 'Mi Info',
            options: {
              inbox: 'Bandeja de entrada',
              'inbox.nested': {
                incoming: 'Entrada',
                sent: 'Enviados',
              },
              crew: 'Mi Crew',
              my_profile: 'Mi perfil',
              my_bands: 'Mis bandas',
              'my_bands.nested': { create: 'Crear Banda' },
              my_prebooking_requests: 'Pre-reservas',
              my_events: 'Mis eventos',
              'my_events.nested': { create: 'Crear Evento' },
              my_riders: 'Mis riders',
              my_places: 'Mis lugares',
              'my_places.nested': { create: 'Crear lugar' },
              favourites: 'Favoritos',
              'favourites.nested': {
                saved: 'Guardados',
                tour_planning: 'Planificación de giras',
              },
              my_calendar: 'Mi Calendario',
            },
          },
          settings: {
            name: 'Configuración',
            options: {
              settings: 'Configuración',
              help_center: 'Centro de ayuda',
              report: 'Denunciar',
              send_comments: 'Enviar comentarios',
              logout: 'Cerrar sesión',
            },
          },
        },
      },
    },
  },
};
