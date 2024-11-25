export const PtMessages = {
  app: {
    name: 'App PT',
    loading: 'A carregar',
    general: {
      not_found_page: {
        title: 'Oops! Não conseguimos encontrar o que está a procurar',
      },
    },
    domain_global_dictionary: { errors: {} },
    global_dictionary: {
      artists_hive: {
        slogan: 'Crie, Conecte-se, Voe...',
      },
      genders: {
        male: 'Homem',
        female: 'Mulher',
        non_binary: 'Não binário',
        non_specified: 'Não especificado',
      },
      art_types: {
        dance: 'Dança',
        music: 'Música',
        painting: 'Pintura',
        poetry: 'Poesia',
        photography: 'Fotografia',
        standup_comedy: 'Comédia Stand-up',
        theatre: 'Teatro',
        video: 'Video',
      },
      actions: {
        accounts: {
          create_account: 'Criar conta',
          forgot_password: 'Olvidé mi contraseña',
          login: 'Entrar',
          password: 'Senha',
          remember_me: 'Lembrar-me',
          signup: 'Registrar-se',
          username_or_email: 'Nome de usuário ou e-mail',
        },
        create: 'Criar',
        follow_us: 'Siga-nos',
        save: 'Salvar',
        show_more: 'Mostrar mais',
        show_less: 'Mostrar menos',
        submit: 'Enviar',
        subscription: {
          subscribe: 'Subscrever',
          unsubscribe: 'Cancelar',
        },
        upload: 'Carregar',
      },
      entities: {
        academies: { plural: 'Academias', singular: 'Academia' },
        artists: { plural: 'Artistas', singular: 'Artista' },
        events: { plural: 'Eventos', singular: 'Evento' },
        places: { plural: 'Locais', singular: 'Local' },
        promoters: { plural: 'Promotores', singular: 'Promotor' },
      },
      errors: {
        // Errores de Autenticación y Autorización
        AUTH_INVALID_CREDENTIALS: 'Credenciais inválidas',
        AUTH_USER_NOT_FOUND: 'Usuário não encontrado',
        AUTH_NO_USER_PROVIDED: 'Nenhum usuário fornecido',
        AUTH_NO_PASSWORD_PROVIDED: 'Nenhuma senha fornecida',
        AUTH_NO_TOKEN_PROVIDED: 'Nenhum token fornecido',
        AUTH_WRONG_PASSWORD: 'Senha incorreta',
        AUTH_TOKEN_EXPIRED: 'Token expirado',
        AUTH_TOKEN_INVALID: 'Token inválido',
        AUTH_PERMISSION_DENIED: 'Permissão negada',

        // Errores de Red
        NETWORK_ERROR: 'Erro de rede',
        NETWORK_TIMEOUT: 'Tempo limite da rede esgotado',
        NETWORK_NOT_CONNECTED: 'Sem conexão de rede',

        // Errores de Validación
        VALIDATION_EMAIL_INVALID: 'E-mail inválido',
        VALIDATION_PASSWORD_WEAK: 'Senha fraca',
        VALIDATION_FIELD_REQUIRED: 'Campo obrigatório',
        VALIDATION_USERNAME_TAKEN: 'Nome de usuário já em uso',

        // Errores de Usuario
        USER_PROFILE_NOT_FOUND: 'Perfil do usuário não encontrado',
        USER_PROFILE_UPDATE_FAILED: 'Falha na atualização do perfil do usuário',
        USER_ACCOUNT_SUSPENDED: 'Conta do usuário suspensa',
        USER_ACCOUNT_DELETED: 'Conta do usuário excluída',

        // Errores de Contenido
        CONTENT_NOT_FOUND: 'Conteúdo não encontrado',
        CONTENT_UPLOAD_FAILED: 'Falha no upload do conteúdo',
        CONTENT_TOO_LARGE: 'Conteúdo muito grande',
        CONTENT_TYPE_NOT_SUPPORTED: 'Tipo de conteúdo não suportado',

        // Errores de Amistad/Conexión
        CONNECTION_REQUEST_FAILED: 'Falha na solicitação de conexão',
        CONNECTION_ALREADY_EXISTS: 'Conexão já existe',
        CONNECTION_NOT_FOUND: 'Conexão não encontrada',

        // Errores de Mensajes
        MESSAGE_SEND_FAILED: 'Falha no envio da mensagem',
        MESSAGE_NOT_FOUND: 'Mensagem não encontrada',
        MESSAGE_CONTENT_INVALID: 'Conteúdo da mensagem inválido',

        // Errores de Publicación
        POST_CREATE_FAILED: 'Falha na criação do post',
        POST_NOT_FOUND: 'Post não encontrado',
        POST_UPDATE_FAILED: 'Falha na atualização do post',
        POST_DELETE_FAILED: 'Falha na exclusão do post',

        // Errores de Pago
        PAYMENT_FAILED: 'Pagamento falhou',
        PAYMENT_METHOD_INVALID: 'Método de pagamento inválido',
        PAYMENT_INSUFFICIENT_FUNDS: 'Fundos insuficientes',

        // Errores del Servidor
        SERVER_ERROR: 'Erro no servidor',
        SERVER_MAINTENANCE: 'Manutenção do servidor',

        // Errores Desconocidos
        UNKNOWN_ERROR: 'Erro desconhecido',
      },
      location: {
        borough: 'Bairro',
        canton: 'Cantão',
        city: 'Cidade',
        county: 'Condado',
        continent: 'Continente',
        country: 'País',
        department: 'Departamento',
        district: 'Distrito',
        hamlet: 'Aldeia',
        location: 'Local',
        municipality: 'Município',
        province: 'Província',
        region: 'Região',
        state: 'Estado',
        town: 'Cidade',
        village: 'Vila',
      },
      stats: {
        rating: {
          overall: 'Avaliação geral',
          stage: 'Palco',
          sound: 'Som',
          backline: 'Equipamento',
          lights: 'Iluminação',
          dressing_room: 'Sala de vestir',
          hospitality_food: 'Alimentação',
          hospitality_drinks: 'Bebidas',
          timeliness: 'Pontualidade',
          communication: 'Comunicação',
          transportation: 'Transporte',
          logistic: 'Logística',
          location: 'Localização',
          seating_capacity: 'Capacidade de assentos',
          total_rates: 'Total de avaliações',
          talent: 'Talento',
          performance: 'Desempenho',
          proffesionalism: 'Profissionalismo',
          stage_presence: 'Presença de palco',
          charisma: 'Carisma',
          respectfulness: 'Respeito',
        },
      },
    },
    pages: {
      app: {
        settings: {
          title: 'Configurações',
          language_selection: {
            title: 'Seleção de idioma',
          },
          user_profile: {
            title: 'Perfil do Usuário',
            user: 'Usuário',
            logout: 'Sair',
            logged_user: 'Usuário Logado',
            empty_user: 'Não há um usuário',
            user_info: 'Informações do Usuário',
            roles: 'Funções',
            artist: 'Artista',
            place: 'Local',
          },
        },
      },
      app_base: {
        LoginPage: {
          paragraph1:
            'Você está visualizando uma versão de teste da nossa plataforma. Atualmente, o registro de usuários está limitado.',
          paragraph2:
            'Se você deseja se juntar à colmeia de artistas, convidamos você a se registrar clicando no botão abaixo.',
          paragraph3:
            'Lembre-se de que você pode se registrar como parte do ecossistema musical ou como um fã. Faça seu registro e fique atento à agenda cultural. Você receberá notificações e alertas para eventos do seu interesse.',
          button: 'Registrar-me na versão de testev',
        },
        UsersPages: {
          UsersDetailsPage: {
            fillProfileBanner: {
              content:
                'Antes de continuar usando todos os benefícios do Artist Hive, é necessário que você complete seu perfil pessoal.',
            },
            subpages: {
              general: {
                name: 'Geral',
                sections: {
                  general: {
                    name: 'Informações Gerais',
                    attributes: {
                      given_names: 'Nomes',
                      surnames: 'Sobrenome',
                      stage_name: 'Nome artístico',
                      fullname: 'Nome Completo',
                      gender: 'Gênero',
                      birthdate: 'Data de nascimento',
                      birthplace: 'Local de nascimento',
                      home_city: 'Cidade de residência',
                    },
                  },
                  contact: {
                    name: 'Contato',
                  },
                },
              },
              artist_info: {
                name: 'Info Pro',
                sections: {
                  emergency_contact: {
                    name: 'Contato de Emergência',
                  },
                  artists_info: {
                    name: 'Informações do artista',
                    attributes: {
                      user_language: 'Idioma do usuário',
                      blood_group: 'Grupo sanguíneo',
                      dietary_restrictions: 'Restrições alimentares',
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
                  },
                  dance: {
                    name: 'Dança',
                  },
                  photography: {
                    name: 'Fotografia',
                  },
                  video: {
                    name: 'Vídeo',
                  },
                  painting: {
                    name: 'Pintura',
                  },
                  poetry: {
                    name: 'Poesia',
                  },
                  standup_comedy: {
                    name: 'Comédia Stand-up',
                  },
                  awards: {
                    name: 'Prêmios',
                  },
                },
              },
              memberships: {
                name: 'Associações',
                sections: {
                  artists: {
                    name: 'Artistas',
                  },
                  places: {
                    name: 'Locais',
                  },
                },
              },
              my_shows: {
                name: 'Meus Shows',
                sections: {
                  next_shows: {
                    name: 'Próximos shows',
                  },
                  past_shows: {
                    name: 'Shows passados',
                  },
                },
              },
              my_liked_shows: {
                name: 'Meus shows curtidos',
                sections: {
                  next_shows: {
                    name: 'Próximos shows',
                  },
                  past_shows: {
                    name: 'Shows passados',
                  },
                },
              },
            },
          },
          activate_industry_banner: {
            banner:
              'Você é membro da indústria? Acesse todas as ferramentas para artistas, agentes, venues e outros profissionais.',
            button: 'Ativar agora',
          },
        },
      },
      domain: {
        CulturalAgenda: {
          title: 'Agenda Cultural',
        },
        AcademiesPages: {
          AcademiesDetailsPage: {
            subpages: {
              general: {
                name: 'Generale',
                sections: {
                  gallery: {
                    name: 'Galeria',
                  },
                  general: {
                    name: 'Informações gerais',
                    attributes: {
                      description: 'Descrição',
                      address: 'Endereço',
                      city: 'Cidade',
                      categories: 'Categorias',
                      since: 'Desde',
                      spoken_languages: 'Idiomas falados',
                    },
                  },
                  contact: {
                    name: 'Contato',
                    attributes: {
                      website: 'Site',
                      email: 'E-mail',
                      phone: 'Telefone',
                      mobile_phone: 'Celular',
                      whatsapp: 'WhatsApp',
                    },
                  },
                  social_networks: {
                    name: 'Redes Sociais',
                  },
                },
              },
              social: {
                name: 'Social',
                sections: {
                  social_network_presence: {
                    name: 'Presença nas redes sociais',
                  },
                  stats: {
                    name: 'Estatísticas',
                    attributes: {
                      general_rate: 'Avaliação geral',
                      followers: 'Seguidores',
                      event_followers: 'Seguidores de eventos',
                    },
                  },
                },
              },
              shows: {
                name: 'Shows',
                sections: {
                  next_shows: {
                    name: 'Próximos shows',
                  },
                  past_shows: {
                    name: 'Shows passados',
                  },
                },
              },
              backline: {
                name: 'Backline',
                sections: {
                  sound_backline: {
                    name: 'Backline de som',
                  },
                  light_backline: {
                    name: 'Backline de iluminação',
                  },
                },
              },
              menu: {
                name: 'Menu',
                sections: {
                  main_course: { name: 'Prato principal' },
                  second_course: { name: 'Segundo prato' },
                },
              },
            },
          },
        },
        RidersPages: {
          RidersDetailsPage: {
            subpages: {
              general: {
                name: 'Geral',
                sections: {
                  general: {
                    name: 'Geral',
                    attributes: {
                      since: 'Desde',
                      home_city: 'Cidade natal',
                      categories: 'Categorias',
                      spoken_languages: 'Idiomas falados',
                      stage_languages: 'Idiomas de palco',
                      arts_languages: 'Idiomas de artes',
                    },
                  },
                  contact: {
                    name: 'Contato',
                    attributes: {
                      production_manager_phone: 'Telefone do gerente de produção',
                      tour_manager_phone: 'Telefone do gerente de turnê',
                    },
                  },
                  general_technical_features: {
                    name: 'Recursos técnicos gerais',
                    attributes: {
                      frecuency_response: 'Resposta de frequência',
                      sound_pressure: 'Pressão sonora',
                      foh_distance: 'Distância FOH',
                    },
                  },
                },
              },
              people: {
                name: 'Pessoas',
                sections: {
                  staff: {
                    name: 'Equipe',
                  },
                  allergies: {
                    name: 'Alergias',
                  },
                  rooming_list: {
                    name: 'Lista de acomodação',
                  },
                  external_transportation: {
                    name: 'Transporte externo',
                    attributes: {
                      albums: 'Voos',
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
                    name: 'Montagem',
                  },
                  audio_requirements: {
                    name: 'Requisitos de áudio',
                    attributes: {
                      channelNumber: 'Número do canal',
                      instrumentName: 'Nome do instrumento',
                      microphone: 'Microfone',
                      inserts: 'Insertos',
                      mixNumber: 'Número de mixagem',
                      description: 'Descrição',
                      monitor: 'Monitor',
                    },
                  },
                  video_requirements: {
                    name: 'Requisitos de vídeo',
                  },
                  lights_requirements: {
                    name: 'Requisitos de iluminação',
                  },
                  stage_design: {
                    name: 'Design do palco',
                  },
                  special_effects: {
                    name: 'Efeitos especiais',
                  },
                },
              },
              backline: {
                name: 'Backline',
                sections: {
                  external_required_backline: {
                    name: 'Backline externo necessário',
                  },
                  owned_backline: {
                    name: 'Backline próprio',
                  },
                },
              },
              sound_test: {
                name: 'Teste de som',
                sections: {
                  timing: {
                    name: 'Tempo',
                  },
                },
              },
            },
          },
        },
        IndustryOfferPage: {
          create_account_banner: 'Junte-se à colmeia',
        },
        TourPlansPages: {
          TourPlanDetailsPage: {
            tourPlanNotFound: 'Tour não encontrado',
            subpages: {
              general: {
                name: 'Geral',
                sections: {
                  dates: {
                    name: 'Datas',
                    attributes: {
                      initial_date: 'Data Inicial',
                      final_date: 'Data Final',
                      total_days: 'Dias Totais',
                      events_state_summary: 'Eventos',
                    },
                  },
                  shows: {
                    name: 'Shows',
                  },
                },
              },
              dates: {
                name: 'Datas',
              },
              budget: {
                name: 'Orçamento',
                sections: {
                  internal_transportation: {
                    name: 'Transporte Interno',
                  },
                  intercity_transportation: {
                    name: 'Transporte entre Cidades',
                  },
                  accommodation: {
                    name: 'Alojamento',
                  },
                  food: {
                    name: 'Alimentação',
                  },
                },
              },
              wishes: {
                name: 'Desejos',
                sections: {
                  guest_artists: {
                    name: 'Artistas Convidados',
                  },
                  possible_shows: {
                    name: 'Shows Possíveis',
                  },
                },
              },
              settings: {
                name: 'Configurações',
              },
            },
          },
        },
      },
      ArtistsPages: {
        ArtistsDetailsPage: {
          subpages: {
            general: {
              name: 'Geral',
              sections: {
                general: {
                  name: 'Informações gerais',
                  attributes: {
                    description: 'Descrição',
                    since: 'Desde',
                    home_city: 'Cidade natal',
                    categories: 'Categorias',
                    genres: 'Gêneros',
                    spoken_languages: 'Línguas faladas',
                    stage_languages: 'Línguas de palco',
                    arts_languages: 'Línguas das artes',
                  },
                },
                genres: {
                  name: 'Gêneros',
                },
                contact: {
                  name: 'Contato',
                  attributes: {
                    website: 'Website',
                    email: 'e-mail',
                    phone: 'Telefone',
                    mobile_phone: 'Celular',
                    whatsapp: 'WhatsApp',
                  },
                },
                social_networks: {
                  name: 'Redes sociais',
                },
                record_label: {
                  name: 'Gravadoras',
                },
                members: {
                  name: 'Membros',
                },
              },
            },
            arts: {
              name: 'Artes',
              sections: {
                discography: {
                  name: 'Discografia',
                  attributes: {
                    albums: 'Álbuns',
                    top_tracks: 'Melhores músicas',
                    dvd_video: 'DVD / Vídeo',
                  },
                },
                media_channels: {
                  name: 'Canais de mídia',
                },
                gallery: {
                  name: 'Galeria',
                  attributes: {
                    photos: 'Fotos',
                    video: 'Vídeo',
                  },
                },
                awards: {
                  name: 'Prêmios',
                },
              },
            },
            social: {
              name: 'Social',
              sections: {
                social_network_presence: {
                  name: 'Presença em redes sociais',
                },
                stats: {
                  name: 'Estatísticas',
                  attributes: {
                    general_rate: 'Taxa geral',
                    followers: 'Seguidores',
                    event_followers: 'Seguidores de eventos',
                  },
                },
                rating: {
                  name: 'Avaliação',
                },
              },
            },
            shows: {
              name: 'Shows',
              sections: {
                summary: {
                  name: 'Resumo',
                },
                next_shows: {
                  name: 'Próximos shows',
                },
                past_shows: {
                  name: 'Shows passados',
                },
              },
            },
          },
        },
      },
      HomePage: {
        welcome: 'Bem-vindo',
        news: 'Notícias',
        artists: 'Artistas',
        events: 'Eventos',
        places: 'Lugares',
        industry_offer: {
          title: 'Você faz parte da indústria musical?',
          call_to_action: 'Conheça nossa proposta',
        },
      },
      EventsPages: {
        EventDetailsPage: {
          subpages: {
            general: {
              name: 'Informações',
              sections: {
                general: {
                  name: 'Informações gerais',
                  attributes: {
                    national_code: 'Código PULEP',
                    timetable__initial_date: 'Quando?',
                    initial_time: 'Horário de início',
                    minimumAge: 'Idade mínima',
                    timetable__openning_doors: 'Abertura das portas',
                    promoter: 'Promotor',
                    tickets_website: 'Site de bilhetes',
                  },
                },
                description: {
                  name: 'Descrição',
                },
                genres: {
                  name: 'Gêneros',
                },
              },
            },
            artists: {
              name: 'Artistas',
              sections: {
                main_artists: { name: 'Artistas principais' },
                other_artists: { name: 'Outros artistas' },
              },
            },
            place: {
              name: 'Local',
              sections: {
                location: {
                  name: 'Localização',
                },
              },
            },
            contact: {
              name: 'Contato e Mídia',
              sections: {
                contact: {
                  name: 'Informações de contato',
                },
                social_networks: {
                  name: 'Redes sociais',
                },
              },
            },
            extra_info: {
              name: 'Extras',
              sections: {
                additional_info: { name: 'Informações adicionais' },
                dress_code: { name: 'Código de vestimenta' },
                discounts: { name: 'Descontos' },
                promoter: { name: 'Promotor' },
              },
            },
          },
        },
      },
      PlacesPages: {
        PlacesDetailsPage: {
          subpages: {
            general: {
              name: 'Geral',
              sections: {
                gallery: {
                  name: 'Galeria',
                },
                general: {
                  name: 'Informações Gerais',
                  attributes: {
                    description: 'Descrição',
                    address: 'Endereço',
                    city: 'Cidade',
                    cityWithCountry: 'Localização',
                    categories: 'Categorias',
                    since: 'Desde',
                    spoken_languages: 'Idiomas falados',
                    stage_languages: 'Idiomas no palco',
                    arts_languages: 'Idiomas nas artes',
                  },
                },
                genres: {
                  name: 'Gêneros',
                },
                contact: {
                  name: 'Contato',
                  attributes: {
                    website: 'Site',
                    email: 'E-mail',
                    phone: 'Telefone',
                    mobile_phone: 'Celular',
                    whatsapp: 'WhatsApp',
                  },
                },
                social_networks: {
                  name: 'Redes Sociais',
                },
              },
            },
            stats: {
              name: 'Estatísticas',
              sections: {
                social_network_presence: {
                  name: 'Presença nas redes sociais',
                },
                rating: {
                  name: 'Classificação',
                },
              },
            },
            shows: {
              name: 'Shows',
              sections: {
                next_shows: {
                  name: 'Próximos Shows',
                },
                past_shows: {
                  name: 'Shows Passados',
                },
              },
            },
            backline: {
              name: 'Backline',
              sections: {
                sound_backline: {
                  name: 'Backline de Som',
                },
                light_backline: {
                  name: 'Backline de Luz',
                },
              },
            },
            menu: {
              name: 'Cardápio',
              sections: {
                main_course: {
                  name: 'Prato Principal',
                },
                second_course: {
                  name: 'Segundo Prato',
                },
              },
            },
          },
        },
      },
    },
    appbase: {
      betabar: {
        contact_us: 'Entre em contato',
        disclaimer:
          'Você está visualizando uma versão de teste da nossa plataforma. Esperamos que goste. Você pode entrar em contato conosco usando o botão abaixo.',
        our_email_is: 'Nosso e-mail é:',
      },
      footer: {
        columns: {
          what_we_do: {
            name: 'O que fazemos?',
            options: {
              cultural_agenda: 'Agenda Cultural',
              for_academies: 'Para academias',
              for_artists: 'Para artistas',
              for_places: 'Para lugares',
              for_promoters: 'Para promotores',
              for_festivals: 'Para festivais',
            },
          },
          about_us: {
            name: 'Sobre nós',
            options: {
              history: 'Nossa história',
              press: 'Imprensa',
              career: 'Carreira',
              download: 'Baixe o aplicativo',
            },
          },
          help: {
            name: 'Ajuda',
            options: {
              data_policy: 'Política de dados',
              terms: 'Termos de Serviço',
              help_center: 'Central de ajuda',
              contact_us: 'Contate-nos',
              report: 'Reportar',
            },
          },
        },
        copywrite: {
          allRightsReserved: 'Todos os direitos reservados',
        },
      },
      search: {
        empty_results: {
          title: 'Não há resultados que correspondam à sua pesquisa',
          suggestions: {
            statement: 'Tente qualquer uma das seguintes sugestões',
            spelling: 'Verifique a ortografia',
            less_words: 'Use palavras mais genéricas ou menos palavras',
            related_things: 'Navegue pelas categorias para encontrar elementos similares',
          },
        },
        filters: {
          title: 'Filtros',
          subpages: {
            general: {
              name: 'Geral',
              sections: {
                general: {
                  name: 'Geral',
                  attributes: {
                    genres: 'Gêneros',
                    cityWithCountry: 'Onde?',
                  },
                },
                dates: {
                  name: 'Datas',
                  attributes: {
                    date: 'Quando?',
                  },
                },
                languages: {
                  name: 'Idiomas',
                  attributes: {
                    spoken_languages: 'Idiomas falados',
                    stage_languages: 'Idiomas de palco',
                    arts_languages: 'Idiomas artísticos',
                  },
                },
              },
            },
            artists: {
              name: 'Artistas',
              sections: {
                general: {
                  name: 'Geral',
                  attributes: {
                    is_available_at: 'Disponível em?',
                    has_albums: 'Tem álbuns?',
                    music_awards: 'Prêmios musicais',
                  },
                },
                rating: {
                  name: 'Avaliação',
                  attributes: {
                    overall: 'Geral',
                    talent: 'Talento',
                    performance: 'Desempenho',
                  },
                },
              },
            },
            places: {
              name: 'Locais',
              sections: {
                stage: {
                  name: 'Palco',
                  attributes: {
                    stage_width: 'Largura',
                    stage_length: 'Comprimento',
                    stage_height: 'Altura',
                  },
                },
                backline: {
                  name: 'Backline',
                  attributes: {
                    mics: 'Microfones',
                  },
                },
              },
            },
            social_networks: {
              name: 'Redes Sociais',
              sections: {
                presence: {
                  name: 'Presença',
                  attributes: {
                    has_social_networks: 'Possui essas redes?',
                  },
                },
              },
            },
          },
        },
        not_found_results: 'Nenhum resultado encontrado',
        recommendations: 'Recomendações',
        result_view_types: {
          list: 'Lista',
          map: 'Mapa',
        },
        results: 'Resultados',
        search: 'Pesquisar',
        search_placeholder: 'Artistas, eventos, lugares...',
        see_more: 'Ver mais',
        what_are_you_looking_for: 'O que você está procurando?',
        types: {
          ARTISTS: 'Artistas',
          PLACES: 'Lugares',
          EVENTS: 'Eventos',
        },
        type_your_search: 'Digite sua pesquisa',
      },
      sidenav: {
        name: 'Menu principal',
        sections: {
          general: {
            name: 'Geral',
            options: {
              home: 'Início',
              cultural_agenda: 'Agenda cultural',
              search: 'Pesquisar',
            },
          },
          industry: {
            name: 'Indústria Musical',
            options: {
              industry_member: 'Você faz parte da indústria musical?',
            },
          },
          myInfo: {
            name: 'Minha informação',
            options: {
              inbox: 'Caixa de entrada',
              'inbox.nested': {
                incoming: 'Recebidos',
                sent: 'Enviados',
              },
              my_profile: 'Meu perfil',
              my_bands: 'Minhas bandas',
              'my_bands.nested': { create: 'Criar uma Band' },
              my_events: 'Meus eventos',
              'my_events.nested': { create: 'Criar um evento' },
              my_riders: 'Meus riders',
              my_places: 'Meus lugares',
              'my_places.nested': { create: 'Criar local' },
              favourites: 'Favoritos',
              'favourites.nested': {
                saved: 'Salvos',
                tour_planning: 'Planejamento de turnê',
              },
            },
          },
          settings: {
            name: 'Configurações',
            options: {
              settings: 'Configurações',
              help_center: 'Central de ajuda',
              report: 'Reportar',
              send_comments: 'Enviar comentários',
              logout: 'Sair',
            },
          },
        },
      },
    },
  },
};
