export const ElMessages = {
  app: {
    name: 'App EL',
    loading: 'Φόρτωση...',
    general: {
      not_found_page: {
        title: 'Ούπς! Δεν μπορέσαμε να βρούμε αυτό που ψάχνετε',
      },
      component_error: {
        message: 'Δεν ήταν δυνατή η φόρτωση αυτού του στοιχείου.',
      },
    },
    domain_global_dictionary: { errors: {} },
    global_dictionary: {
      artists_hive: {
        slogan: 'Δημιούργησε, Συνδέσου, Πέτα...',
      },
      art_types: {
        dance: 'Χορός',
        music: 'Μουσική',
        painting: 'Ζωγραφική',
        poetry: 'Ποίηση',
        photography: 'Φωτογραφία',
        standup_comedy: 'Stand-up Comedy',
        theatre: 'Θέατρο',
        video: 'Βίντεο',
      },
      music_genres: {
        rock: 'Ροκ',
        pop: 'Ποπ',
        indie: 'Ίντι',
        alternative: 'Εναλλακτική',
        metal: 'Μέταλ',
        punk: 'Πανκ',
        blues: 'Μπλουζ',
        jazz: 'Τζαζ',
        funk: 'Φανκ',
        soul: 'Σόουλ',
        rnb: 'R&B',
        hip_hop: 'Χιπ χοπ',
        rap: 'Ραπ',
        reggae: 'Ρέγκε',
        ska: 'Σκα',
        electronic: 'Ηλεκτρονική',
        house: 'Χάουζ',
        techno: 'Τέκνο',
        folk: 'Φολκ',
        country: 'Κάντρι',
        classical: 'Κλασική',
        opera: 'Όπερα',
        gospel: 'Γκόσπελ',
        salsa: 'Σάλσα',
        merengue: 'Μερένγκε',
        bachata: 'Μπατσάτα',
        cumbia: 'Κούμπια',
        vallenato: 'Βαγιενάτο',
        reggaeton: 'Ρεγκετόν',
        tango: 'Τάνγκο',
        bolero: 'Μπολέρο',
        ranchera: 'Ραντσέρα',
        bossa_nova: 'Μπόσα νόβα',
        samba: 'Σάμπα',
        flamenco: 'Φλαμένκο',
        world_music: 'Μουσική του κόσμου',
        experimental: 'Πειραματική',
        instrumental: 'Ορχηστρική',
      },
      actions: {
        add: 'Προσθήκη',
        accounts: {
          create_account: 'Δημιουργία λογαριασμού',
          forgot_password: 'Ξέχασα τον κωδικό μου',
          login: 'Σύνδεση',
          password: 'Κωδικός',
          phone_number: 'Αριθμός τηλεφώνου',
          phone_number_placeholder: '1234567890',
          remember_me: 'Θυμήσου με',
          signup: 'Εγγραφή',
          username_or_email: 'Όνομα χρήστη ή email',
        },
        create: 'Δημιουργία',
        edit: 'εκδίδω ',
        follow_us: 'Ακολουθήστε μας',
        save: 'Αποθήκευση',
        cancel: 'Ακύρωση',
        link_copied_to_clipboard: 'Ο σύνδεσμος αντιγράφηκε στο πρόχειρο',
        navigation: {
          back: 'Πίσω',
          first: 'Πρώτο',
          home: 'Αρχική',
          last: 'Τελευταίο',
          next: 'Επόμενο',
          previous: 'Προηγούμενο',
          refresh: 'Ανανέωση',
          submit: 'Υποβολή',
          cancel: 'Ακύρωση',
          close: 'Κλείσιμο',
          open: 'Άνοιγμα',
          save: 'Αποθήκευση',
        },
        report: 'Αναφορά',
        selection: {
          select_all: 'Επιλογή όλων',
          clear_selection: 'Καθαρισμός επιλογής',
        },
        share: 'Κοινοποίηση',
        show_more: 'Περισσότερα',
        show_less: 'Λιγότερα',
        submit: 'Υποβολή',
        subscription: {
          subscribe: 'Εγγραφή',
          unsubscribe: 'Διαγραφή',
        },
        upload: 'Μεταφόρτωση',
        files_limit_exceded: 'Υπέρβαση του μέγιστου επιτρεπόμενου αριθμού αρχείων',
      },
      entities: {
        academies: { plural: 'Ακαδημίες', singular: 'Ακαδημία' },
        artists: {
          plural: 'Καλλιτέχνες',
          singular: 'Καλλιτέχνης',
          attributes: {
            project_format: {
              label: 'Μορφή Έργου',
              values: {
                solo_artist: 'Σόλο Καλλιτέχνης',
                duo: 'Ντουέτο',
                band: 'Συγκρότημα',
                dj: 'DJ',
                group: 'Ομάδα',
                collective: 'Συλλογικότητα',
                orchestra: 'Ορχήστρα',
                choir: 'Χορωδία',
                symphonic_choral: 'Συμφωνική Χορωδία',
                other: 'Άλλο',
              },
            },
          },
        },
        events: {
          plural: 'Εκδηλώσεις',
          singular: 'Εκδήλωση',
          attributes: {
            event_type: {
              label: 'Τύπος Εκδήλωσης',
              values: {
                concert: 'Συναυλία',
                conversation: 'Συζήτηση',
                festival: 'Φεστιβάλ',
                jam_session: 'Jam session',
                market: 'Αγορά',
                other: 'Άλλο',
                residency: 'Καλλιτεχνική διαμονή',
                showcase: 'Προβολή',
                workshop: 'Εργαστήριο',
              },
            },
          },
        },
        open_calls: {
          plural: 'Ανοιχτές Προσκλήσεις',
          singular: 'Ανοιχτή Πρόσκληση',
          attributes: {
            support_provision: {
              label: 'Παροχή Υποστήριξης',
              values: {
                no: 'Όχι',
                yes: 'Ναι',
                partial: 'Μερική',
                negotiable: 'Διαπραγματεύσιμη',
              },
            },
          },
        },
        places: {
          plural: 'Χώροι',
          singular: 'Χώρος',
          attributes: {
            place_types: {
              label: 'Τύποι Χώρου',
              values: {
                bar: 'Μπαρ',
                club: 'Κλαμπ',
                theater: 'Θέατρο',
                concert_hall: 'Αίθουσα Συναυλιών',
                cultural_center: 'Πολιτιστικό Κέντρο',
                restaurant: 'Εστιατόριο',
                outdoor: 'Υπαίθριος',
                other: 'Άλλο',
              },
            },
            stage_types: {
              label: 'Τύποι Σκηνής',
              values: {
                indoor: 'Εσωτερική',
                outdoor: 'Εξωτερική',
                amphitheater: 'Αμφιθέατρο',
                club: 'Κλαμπ',
                theater: 'Θέατρο',
                other: 'Άλλο',
              },
            },
          },
        },
        promoters: { plural: 'Διοργανωτές', singular: 'Διοργανωτής' },
        prebooking_requests: { plural: 'Προκρατήσεις', singular: 'Προκράτηση' },
        users: {
          plural: 'Χρήστες',
          singular: 'Χρήστης',
          attributes: {
            agrees_to_a_blood_transfusion: {
              label: 'Δέχεστε μεταγγίσεις αίματος;',
              values: {
                true: 'Δέχεται',
                false: 'Δεν δέχεται',
              },
            },
            dietary_restrictions: {
              label: 'Διατροφικοί περιορισμοί',
              values: {
                none: 'Κανένας',
                vegetarian: 'Χορτοφάγος',
                vegan: 'Βίγκαν',
                celiac: 'Κοιλιοκάκη',
              },
            },
            gender: {
              label: 'Φύλο',
              values: {
                male: 'Άντρας',
                female: 'Γυναίκα',
                non_binary: 'Μη δυαδικό',
                non_specified: 'Μη καθορισμένο',
              },
            },
          },
        },
      },
      forms: {
        errors: {
          submit_error: 'Δεν ήταν δυνατή η αποθήκευση των αλλαγών. Δοκιμάστε ξανά.',
          submit_error_duplicate_key: 'Αυτό το όνομα χρήστη χρησιμοποιείται ήδη. Επιλέξτε ένα άλλο.',
          submit_error_validation: 'Ορισμένα υποχρεωτικά πεδία λείπουν ή δεν είναι έγκυρα. Ελέγξτε τη φόρμα.',
          validation_error: 'Ορισμένα υποχρεωτικά πεδία λείπουν ή δεν είναι έγκυρα. Ελέγξτε τα πεδία με κόκκινο.',
        },
      },
      errors: {
        // Σφάλματα Δεδομένων
        NOT_AVAILABLE: 'Μη διαθέσιμο',
        NO_RESULTS: 'Δεν βρέθηκαν αποτελέσματα',

        // Σφάλματα Αυθεντικοποίησης και Εξουσιοδότησης
        AUTH_INVALID_CREDENTIALS: 'Μη έγκυρα διαπιστευτήρια',
        AUTH_USER_NOT_FOUND: 'Ο χρήστης δεν βρέθηκε',
        AUTH_NO_USER_PROVIDED: 'Δεν παρασχέθηκε χρήστης',
        AUTH_NO_PASSWORD_PROVIDED: 'Δεν παρασχέθηκε κωδικός',
        AUTH_NO_TOKEN_PROVIDED: 'Δεν παρασχέθηκε token',
        AUTH_WRONG_PASSWORD: 'Λάθος κωδικός',
        AUTH_TOKEN_EXPIRED: 'Το token έληξε',
        AUTH_TOKEN_INVALID: 'Μη έγκυρο token',
        AUTH_PERMISSION_DENIED: 'Άρνηση πρόσβασης',
        AUTH_LOGIN_REQUIRED: 'Πρέπει να συνδεθείτε για να δείτε αυτό το περιεχόμενο.',

        // Σφάλματα Δικτύου
        NETWORK_ERROR: 'Σφάλμα δικτύου',
        NETWORK_TIMEOUT: 'Τέλος χρόνου δικτύου',
        NETWORK_NOT_CONNECTED: 'Δεν είστε συνδεδεμένοι στο δίκτυο',

        // Σφάλματα Επαλήθευσης
        VALIDATION_EMAIL_INVALID: 'Μη έγκυρο email',
        VALIDATION_PASSWORD_WEAK: 'Αδύναμος κωδικός',
        VALIDATION_FIELD_REQUIRED: 'Απαιτούμενο πεδίο',
        VALIDATION_USERNAME_TAKEN: 'Το όνομα χρήστη είναι ήδη σε χρήση',
        VALIDATION_USERNAME_FORMAT:
          'Το όνομα χρήστη μπορεί να περιέχει μόνο πεζά γράμματα, αριθμούς, κάτω παύλα και τελεία (3-24 χαρακτήρες, χωρίς κενά).',

        // Σφάλματα Χρήστη
        USER_PROFILE_NOT_FOUND: 'Το προφίλ χρήστη δεν βρέθηκε',
        USER_PROFILE_UPDATE_FAILED: 'Η ενημέρωση του προφίλ χρήστη απέτυχε',
        USER_ACCOUNT_SUSPENDED: 'Ο λογαριασμός χρήστη έχει ανασταλεί',
        USER_ACCOUNT_DELETED: 'Ο λογαριασμός χρήστη έχει διαγραφεί',

        // Σφάλματα Περιεχομένου
        CONTENT_NOT_FOUND: 'Το περιεχόμενο δεν βρέθηκε',
        CONTENT_UPLOAD_FAILED: 'Η μεταφόρτωση του περιεχομένου απέτυχε',
        CONTENT_TOO_LARGE: 'Το περιεχόμενο είναι πολύ μεγάλο',
        CONTENT_TYPE_NOT_SUPPORTED: 'Ο τύπος περιεχομένου δεν υποστηρίζεται',

        // Σφάλματα Σύνδεσης
        CONNECTION_REQUEST_FAILED: 'Το αίτημα σύνδεσης απέτυχε',
        CONNECTION_ALREADY_EXISTS: 'Η σύνδεση υπάρχει ήδη',
        CONNECTION_NOT_FOUND: 'Η σύνδεση δεν βρέθηκε',

        // Σφάλματα Μηνυμάτων
        MESSAGE_SEND_FAILED: 'Η αποστολή μηνύματος απέτυχε',
        MESSAGE_NOT_FOUND: 'Το μήνυμα δεν βρέθηκε',
        MESSAGE_CONTENT_INVALID: 'Μη έγκυρο περιεχόμενο μηνύματος',

        // Σφάλματα Δημοσίευσης
        POST_CREATE_FAILED: 'Η δημιουργία της δημοσίευσης απέτυχε',
        POST_NOT_FOUND: 'Η δημοσίευση δεν βρέθηκε',
        POST_UPDATE_FAILED: 'Η ενημέρωση της δημοσίευσης απέτυχε',
        POST_DELETE_FAILED: 'Η διαγραφή της δημοσίευσης απέτυχε',

        // Σφάλματα Πληρωμής
        PAYMENT_FAILED: 'Η πληρωμή απέτυχε',
        PAYMENT_METHOD_INVALID: 'Μη έγκυρη μέθοδος πληρωμής',
        PAYMENT_INSUFFICIENT_FUNDS: 'Ανεπαρκή κεφάλαια',

        // Σφάλματα Διακομιστή
        SERVER_ERROR: 'Σφάλμα διακομιστή',
        SERVER_MAINTENANCE: 'Συντήρηση διακομιστή',

        // Άγνωστα Σφάλματα
        UNKNOWN_ERROR: 'Άγνωστο σφάλμα',
      },
      follows: {
        followers: 'Followers',
        following: 'Ακολουθεί',
        in_common: 'Κοινά',
        errors: {
          NO_FOLLOWING: 'Αυτό το προφίλ δεν ακολουθεί κανέναν.',
          NO_FOLLOWERS: 'Αυτό το προφίλ δεν έχει followers.',
          NO_COMMON_FOLLOWERS: 'Δεν υπάρχουν κοινά followers.',
        },
      },
      prebooking: {
        title: 'Προκρατήσεις',
        singular: 'Προκράτηση',
        create: 'Δημιουργία Προκράτησης',
        create_short: 'Νέα Προκράτηση',
        dashboard: 'Πίνακας Προκρατήσεων',
        status: {
          DRAFT: 'Πρόχειρο',
          PENDING: 'Εκκρεμεί',
          PARTIALLY_VIEWED: 'Μερικώς Προβληθείσα',
          PARTIALLY_ACCEPTED: 'Μερικώς Αποδεκτή',
          ALL_ACCEPTED: 'Πλήρως Αποδεκτή',
          REJECTED: 'Απορρίφθηκε',
          CANCELLED: 'Ακυρώθηκε',
          CONVERTED: 'Μετατράπηκε σε Εκδήλωση',
          EXPIRED: 'Έληξε',
        },
        approval_status: {
          ALL_PENDING: 'Όλα Εκκρεμούν',
          PARTIAL: 'Μερική',
          ALL_APPROVED: 'Όλα Εγκρίθηκαν',
          REJECTED: 'Απορρίφθηκε',
        },
        participant_status: {
          pending: 'Σε εκκρεμότητα',
          viewed: 'Προβλήθηκε',
          interested: 'Ενδιαφέρεται',
          not_interested: 'Δεν ενδιαφέρεται',
        },
        request_type: {
          single_date: 'Μονή Ημερομηνία',
          date_range: 'Εύρος Ημερομηνιών',
          week: 'Εβδομάδα',
          month: 'Μήνας',
          quarter: 'Τρίμηνο',
        },
        fields: {
          event_name: 'Όνομα Εκδήλωσης',
          description: 'Περιγραφή',
          requested_date_start: 'Ημερομηνία Έναρξης',
          requested_date_end: 'Ημερομηνία Λήξης',
          request_type: 'Τύπος Κράτησης',
          flexible_dates: 'Ευέλικτες Ημερομηνίες',
          alternative_dates: 'Εναλλακτικές Ημερομηνίες',
          expected_attendance: 'Αναμενόμενη Συμμετοχή',
          response_deadline: 'Προθεσμία Απάντησης',
          requester: 'Αιτών',
          recipients: 'Παραλήπτες',
          additional_participants: 'Πρόσθετοι Συμμετέχοντες',
          notes: 'Σημειώσεις',
          participants: 'Συμμετέχοντες',
        },
        actions: {
          approve: 'Έγκριση',
          reject: 'Απόρριψη',
          cancel: 'Ακύρωση',
          convert_to_event: 'Μετατροπή σε Εκδήλωση',
          edit: 'Επεξεργασία',
          add_note: 'Προσθήκη Σημείωσης',
          view_details: 'Προβολή Λεπτομερειών',
          send_request: 'Αποστολή Αιτήματος',
        },
        tabs: {
          received: 'Ληφθέντα',
          sent: 'Απεσταλμένα',
          all: 'Όλα',
          pending: 'Εκκρεμή',
          accepted: 'Αποδεκτά',
          rejected: 'Απορριφθέντα',
        },
        messages: {
          create_success: 'Η προκράτηση δημιουργήθηκε επιτυχώς',
          approve_success: 'Η προκράτηση εγκρίθηκε επιτυχώς',
          reject_success: 'Η προκράτηση απορρίφθηκε',
          cancel_success: 'Η προκράτηση ακυρώθηκε',
          convert_success: 'Η προκράτηση μετατράπηκε σε εκδήλωση επιτυχώς',
          update_success: 'Η προκράτηση ενημερώθηκε',
          no_requests_found: 'Δεν βρέθηκαν προκρατήσεις',
          requires_action: 'Απαιτεί τη δράση σας',
          approval_progress: '{approved} από {total} ενέκριναν',
          deadline_warning: 'Λήγει σε {days} ημέρες',
          expired: 'Αυτό το αίτημα έχει λήξει',
        },
        errors: {
          create_failed: 'Αποτυχία δημιουργίας προκράτησης',
          load_failed: 'Αποτυχία φόρτωσης προκρατήσεων',
          approve_failed: 'Αποτυχία έγκρισης',
          reject_failed: 'Αποτυχία απόρριψης',
          cancel_failed: 'Αποτυχία ακύρωσης',
          convert_failed: 'Αποτυχία μετατροπής σε εκδήλωση',
          no_permission: 'Δεν έχετε άδεια για αυτή την ενέργεια',
          already_responded: 'Έχετε ήδη απαντήσει σε αυτό το αίτημα',
          invalid_dates: 'Οι επιλεγμένες ημερομηνίες δεν είναι έγκυρες',
          past_date: 'Δεν μπορείτε να δημιουργήσετε κράτηση για παρελθούσα ημερομηνία',
        },
        tooltips: {
          flexible_dates: 'Επιτρέπει την πρόταση εναλλακτικών ημερομηνιών',
          auto_approved: 'Εγκρίνεται αυτόματα κατά τη δημιουργία',
          requires_all_types: 'Απαιτεί τουλάχιστον μία έγκριση από κάθε τύπο προφίλ',
          can_cancel: 'Μόνο ο αιτών μπορεί να ακυρώσει',
          can_convert: 'Μπορεί να μετατραπεί όταν όλοι εγκρίνουν',
        },
      },
      location: {
        borough: 'Δήμος',
        canton: 'Καντόνι',
        city: 'Πόλη',
        county: 'Κομητεία',
        continent: 'Ήπειρος',
        country: 'Χώρα',
        department: 'Νομός',
        district: 'Περιοχή',
        hamlet: 'Χωριουδάκι',
        location: 'Τοποθεσία',
        municipality: 'Δήμος',
        province: 'Επαρχία',
        region: 'Περιφέρεια',
        state: 'Πολιτεία',
        town: 'Κωμόπολη',
        village: 'Χωριό',
      },
      location_info: {
        search_country_or_code: 'Αναζήτηση χώρας ή κωδικού...',
      },
      social_networks_analytics: {
        metrics: {
          followers: 'Ακόλουθοι',
          subscribers: 'Συνδρομητές',
          monthly_listeners: 'Μηνιαίοι ακροατές',
          total_streams: 'Συνολικά streams',
          save_rate: 'Ποσοστό αποθήκευσης',
          radio_streams: 'Streams ραδιοφώνου',
          playlist_reach: 'Εμβέλεια playlist',
          posts: 'Δημοσιεύσεις',
          avg_likes: 'Μέσος όρος likes',
          engagement_rate: 'Ποσοστό engagement',
          avg_reach: 'Μέση εμβέλεια',
          total_likes: 'Συνολικά likes',
          videos_published: 'Δημοσιευμένα βίντεο',
          video_views: 'Προβολές βίντεο',
          posts_content: 'Περιεχόμενο δημοσιεύσεων',
          shares: 'Κοινοποιήσεις',
          total_views: 'Συνολικές προβολές',
          monthly_video_views: 'Μηνιαίες προβολές βίντεο',
          watch_time: 'Χρόνος παρακολούθησης',
          new_subscribers: 'Νέοι συνδρομητές',
          page_likes: 'Likes σελίδας',
          weekly_reach: 'Εβδομαδιαία εμβέλεια',
          engagement: 'Engagement',
          tweets: 'Tweets',
          monthly_impressions: 'Μηνιαίες εμφανίσεις',
          mentions: 'Αναφορές',
          total_plays: 'Συνολικές αναπαραγωγές',
          stations_featuring_artist: 'Σταθμοί που περιλαμβάνουν τον καλλιτέχνη',
          thumbs_up: 'Μου αρέσει',
          shazams: 'Shazams',
        },
      },
      stats: {
        rating: {
          overall: 'Συνολική αξιολόγηση',
          stage: 'Σκηνή',
          sound: 'Ήχος',
          backline: 'Backline',
          lights: 'Φωτισμός',
          dressing_room: 'Καμαρίνι',
          hospitality_food: 'Φαγητό φιλοξενίας',
          hospitality_drinks: 'Ποτά φιλοξενίας',
          timeliness: 'Συνέπεια',
          communication: 'Επικοινωνία',
          transportation: 'Μεταφορά',
          logistic: 'Logistics',
          location: 'Τοποθεσία',
          seating_capacity: 'Χωρητικότητα θέσεων',
          total_rates: 'Συνολικές αξιολογήσεις',
          talent: 'Ταλέντο',
          performance: 'Απόδοση',
          professionalism: 'Επαγγελματισμός',
          stage_presence: 'Παρουσία στη σκηνή',
          charisma: 'Χάρισμα',
          respectfulness: 'Σεβασμός',
        },
      },
    },
    pages: {
      app: {
        settings: {
          title: 'Ρυθμίσεις',
          language_selection: {
            title: 'Επιλογή γλώσσας',
          },
          user_profile: {
            title: 'Προφίλ χρήστη',
            user: 'Χρήστης',
            logout: 'Αποσύνδεση',
            logged_user: 'Συνδεδεμένος χρήστης',
            empty_user: 'Δεν υπάρχει χρήστης',
            user_info: 'Πληροφορίες χρήστη',
            roles: 'Ρόλοι',
            artist: 'Καλλιτέχνης',
            place: 'Χώρος',
          },
        },
      },

      app_base: {
        LoginPage: {
          paragraph1:
            'Βλέπετε μια δοκιμαστική έκδοση της πλατφόρμας μας. Προς το παρόν η εγγραφή χρηστών είναι περιορισμένη.',
          paragraph2:
            'Αν θέλετε να ενταχθείτε στην κοινότητα των καλλιτεχνών, σας προσκαλούμε να εγγραφείτε κάνοντας κλικ στο παρακάτω κουμπί.',
          paragraph3:
            'Θυμηθείτε ότι μπορείτε να εγγραφείτε ως μέρος του μουσικού οικοσυστήματος ή ως φαν. Εγγραφείτε και παρακολουθήστε το πολιτιστικό ημερολόγιο, θα λαμβάνετε ειδοποιήσεις και ειδοποιήσεις για εκδηλώσεις που σας ενδιαφέρουν.',
          button: 'Εγγραφή στη δοκιμαστική έκδοση',
        },
        UsersPages: {
          UsersDetailsPage: {
            fillProfileBanner: {
              content:
                'Πριν συνεχίσετε να χρησιμοποιείτε όλα τα οφέλη του Artist Hive, πρέπει να συμπληρώσετε το προσωπικό σας προφίλ.',
            },
            subpages: {
              general: {
                name: 'Γενικά',
                sections: {
                  general: {
                    name: 'Γενικές Πληροφορίες',
                    attributes: {
                      given_names: 'Όνομα',
                      surnames: 'Επώνυμο',
                      stage_name: 'Καλλιτεχνικό όνομα',
                      fullname: 'Πλήρες όνομα',
                      gender: 'Φύλο',
                      birthdate: 'Ημερομηνία γέννησης',
                      birthplace: 'Τόπος γέννησης',
                      home_city: 'Πόλη κατοικίας',
                    },
                  },
                  contact: {
                    name: 'Επικοινωνία',
                  },
                },
              },
              artist_info: {
                name: 'Επαγγελματικές Πληροφορίες',
                sections: {
                  emergency_contact: {
                    name: 'Επικοινωνία έκτακτης ανάγκης',
                  },
                  artists_info: {
                    name: 'Πληροφορίες καλλιτέχνη',
                    attributes: {
                      user_language: 'Γλώσσα χρήστη',
                      spoken_languages: 'Γλώσσες που μιλάει',
                      blood_group: 'Ομάδα αίματος',
                      dietary_restrictions: 'Διατροφικοί περιορισμοί',
                      allergies: 'Αλλεργίες',
                    },
                  },
                },
              },
              arts: {
                name: 'Τέχνες',
                sections: {
                  music: {
                    name: 'Μουσική',
                    attributes: {
                      played_instruments: 'Όργανα που παίζει',
                    },
                  },
                  dance: {
                    name: 'Χορός',
                  },
                  photography: {
                    name: 'Φωτογραφία',
                  },
                  video: {
                    name: 'Βίντεο',
                  },
                  painting: {
                    name: 'Ζωγραφική',
                  },
                  poetry: {
                    name: 'Ποίηση',
                  },
                  standup_comedy: {
                    name: 'Stand-up Comedy',
                  },
                  awards: {
                    name: 'Βραβεία',
                  },
                },
              },
              memberships: {
                name: 'Συμμετοχές',
                sections: {
                  artists: {
                    name: 'Καλλιτέχνες',
                  },
                  places: {
                    name: 'Χώροι',
                  },
                },
              },
              my_shows: {
                name: 'Οι εκδηλώσεις μου',
                sections: {
                  next_shows: {
                    name: 'Επόμενες εκδηλώσεις',
                  },
                  past_shows: {
                    name: 'Παλιές εκδηλώσεις',
                  },
                },
              },
              my_liked_shows: {
                name: 'Αγαπημένες εκδηλώσεις',
                sections: {
                  next_shows: {
                    name: 'Επόμενες εκδηλώσεις',
                  },
                  past_shows: {
                    name: 'Παλιές εκδηλώσεις',
                  },
                },
              },
            },
          },
          activate_industry_banner: {
            banner: {
              title: 'Είστε μέλος της βιομηχανίας;',
              content:
                'Αποκτήστε πρόσβαση σε όλα τα εργαλεία για καλλιτέχνες, πράκτορες, venues και άλλους επαγγελματίες.',
            },
            button: 'Ενεργοποίηση τώρα',
          },
        },
      },
      domain: {
        CalendarPage: {
          title: 'My calendar',
          empty_state: 'There are no events in this date range',
          error: 'Something went wrong while loading your calendar. Please try again.',
          deadline_label: 'Deadline',
          all_day: 'All day',
          filters: {
            title: 'Show in calendar',
          },
          types: {
            activity: 'Activities',
            opencall: 'Open call deadlines',
            event: 'Events',
            holiday: 'Holidays',
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
            agenda: 'Agenda',
            filters: 'Filters',
            create_activity: 'Create activity',
            delete: 'Delete',
            cancel: 'Cancel',
          },
          activity_form: {
            create_title: 'New activity',
            edit_title: 'Edit activity',
            save_error: 'The activity could not be saved. Please try again.',
            image_upload_error: 'The image could not be uploaded. Please try again.',
            fields: {
              title: 'Title',
              subtype: 'Type',
              all_day: 'All day',
              start_date: 'Start date',
              start_time: 'Start time',
              end_date: 'End date',
              end_time: 'End time',
              notes: 'Notes',
              image: 'Event image',
            },
            subtypes: {
              rehearsal: 'Rehearsal',
              soundcheck: 'Soundcheck',
              presentation: 'Presentation',
              concert: 'Concert',
              tour: 'Tour',
              other: 'Other',
            },
            validation: {
              title_required: 'Title is required',
              start_date_required: 'Start date is required',
              start_time_required: 'Start time is required',
              end_date_required: 'End date is required',
            },
            delete_confirmation: {
              title: 'Delete activity',
              message: 'Are you sure you want to delete this activity? This action cannot be undone.',
            },
          },
        },
        CulturalAgenda: {
          title: 'Πολιτιστικό ημερολόγιο',
        },
        AcademiesPages: {
          AcademiesDetailsPage: {
            subpages: {
              general: {
                name: 'Γενικά',
                sections: {
                  gallery: {
                    name: 'Γκαλερί',
                  },
                  general: {
                    name: 'Γενικές πληροφορίες',
                    attributes: {
                      description: 'Περιγραφή',
                      address: 'Διεύθυνση',
                      city: 'Πόλη',
                      categories: 'Κατηγορίες',
                      since: 'Από',
                      spoken_languages: 'Γλώσσες που μιλιούνται',
                    },
                  },
                  contact: {
                    name: 'Επικοινωνία',
                    attributes: {
                      website: 'Ιστοσελίδα',
                      email: 'Email',
                      phone: 'Τηλέφωνο',
                      mobile_phone: 'Κινητό',
                      whatsapp: 'WhatsApp',
                    },
                  },
                  social_networks: {
                    name: 'Κοινωνικά δίκτυα',
                  },
                },
              },

              social: {
                name: 'Κοινωνικά',
                sections: {
                  social_network_presence: {
                    name: 'Παρουσία στα κοινωνικά δίκτυα',
                  },
                  stats: {
                    name: 'Στατιστικά',
                    attributes: {
                      general_rate: 'Γενική αξιολόγηση',
                      followers: 'Followers',
                      event_followers: 'Followers εκδηλώσεων',
                    },
                  },
                },
              },
              shows: {
                name: 'Shows',
                sections: {
                  next_shows: {
                    name: 'Επόμενα shows',
                  },
                  past_shows: {
                    name: 'Παλιά shows',
                  },
                },
              },
              backline: {
                name: 'Backline',
                sections: {
                  sound_backline: {
                    name: 'Backline ήχου',
                  },
                  light_backline: {
                    name: 'Backline φωτισμού',
                  },
                },
              },
              menu: {
                name: 'Μενού',
                sections: {
                  main_course: { name: 'Κύριο πιάτο' },
                  second_course: { name: 'Δεύτερο πιάτο' },
                },
              },
            },
          },
        },
        RidersPages: {
          RidersDetailsPage: {
            subpages: {
              general: {
                name: 'Γενικά',
                sections: {
                  general: {
                    name: 'Γενικά',
                    attributes: {
                      since: 'Από',
                      home_city: 'Πόλη προέλευσης',
                      categories: 'Κατηγορίες',
                      spoken_languages: 'Γλώσσες που μιλιούνται',
                      stage_languages: 'Γλώσσες σκηνής',
                      arts_languages: 'Καλλιτεχνικές γλώσσες',
                    },
                  },
                  contact: {
                    name: 'Επικοινωνία',
                    attributes: {
                      production_manager_phone: 'Τηλέφωνο διευθυντή παραγωγής',
                      tour_manager_phone: 'Τηλέφωνο διευθυντή περιοδείας',
                    },
                  },
                  general_technical_features: {
                    name: 'Γενικά τεχνικά χαρακτηριστικά',
                    attributes: {
                      frequency_response: 'Απόκριση συχνότητας',
                      sound_pressure: 'Ηχητική πίεση',
                      foh_distance: 'Απόσταση FOH',
                    },
                  },
                },
              },
              people: {
                name: 'Άτομα',
                sections: {
                  staff: {
                    name: 'Προσωπικό',
                  },
                  allergies: {
                    name: 'Αλλεργίες',
                  },
                  rooming_list: {
                    name: 'Λίστα διαμονής',
                  },
                  external_transportation: {
                    name: 'Εξωτερική μεταφορά',
                    attributes: {
                      flights: 'Πτήσεις',
                    },
                  },
                  internal_transportation: {
                    name: 'Εσωτερική μεταφορά',
                    attributes: {
                      ground_transport: 'Οδική μεταφορά',
                    },
                  },
                },
              },
              technical_requirements: {
                name: 'Τεχνικές απαιτήσεις',
                sections: {
                  staging: {
                    name: 'Σκηνοθεσία',
                  },
                  audio_requirements: {
                    name: 'Ηχητικές απαιτήσεις',
                    attributes: {
                      channelNumber: 'Αριθμός καναλιού',
                      instrumentName: 'Όνομα οργάνου',
                      microphone: 'Μικρόφωνο',
                      inserts: 'Inserts',
                      mixNumber: 'Αριθμός μίξης',
                      description: 'Περιγραφή',
                      monitor: 'Monitor',
                    },
                  },
                  video_requirements: {
                    name: 'Απαιτήσεις βίντεο',
                  },
                  lights_requirements: {
                    name: 'Απαιτήσεις φωτισμού',
                  },
                  stage_design: {
                    name: 'Σχεδιασμός σκηνής',
                  },
                  special_effects: {
                    name: 'Ειδικά εφέ',
                  },
                },
              },
              backline: {
                name: 'Backline',
                sections: {
                  external_required_backline: {
                    name: 'Απαιτούμενο εξωτερικό backline',
                  },
                  owned_backline: {
                    name: 'Ιδιόκτητο backline',
                  },
                },
              },
              sound_test: {
                name: 'Δοκιμή ήχου',
                sections: {
                  timing: {
                    name: 'Χρονοδιάγραμμα',
                  },
                },
              },
            },
          },
        },
        IndustryOfferPage: {
          create_account_banner: 'Ενταχθείτε στη κοινότητα',
        },
        IndustryPages: {
          CreateIndustryEntityPage: {
            title: 'Μέλος της βιομηχανίας',
            intro:
              'Ευχαριστούμε για το ενδιαφέρον σου να εγγραφείς ως μέλος της βιομηχανίας, είτε ως καλλιτέχνης, ατζέντης, ιδιοκτήτης χώρου, αίθουσας πρόβας ή άλλης οντότητας.',
            intro_secondary:
              'Αναζήτησε το προφίλ σου αν υπάρχει ήδη στο σύστημα, ή δημιούργησε ένα νέο για να ξεκινήσεις.',
            search_section: {
              title: 'Αναζήτησε το προφίλ σου',
              input_placeholder: 'Όνομα καλλιτέχνη ή χώρου...',
              search_button: 'Αναζήτηση',
              artists_found: 'Αυτοί είναι οι σχετικοί καλλιτέχνες',
              places_found: 'Αυτοί είναι οι σχετικοί χώροι',
            },
            create_section: {
              title: 'Ή δημιούργησε νέο προφίλ',
            },
            reset_section: {
              remove_artists_button: 'Αφαίρεση των προφίλ Καλλιτέχνη μου',
              remove_places_button: 'Αφαίρεση των προφίλ Χώρου μου',
              confirm_title: 'Επιβεβαίωση ενέργειας',
              confirm_content:
                'Αυτή η ενέργεια θα αφαιρέσει τη σύνδεση όλων των προφίλ αυτού του τύπου με τον λογαριασμό σου. Τα προφίλ δεν θα διαγραφούν, αλλά θα σταματήσουν να εμφανίζονται στις συμμετοχές σου. Θέλεις να συνεχίσεις;',
              confirm_action: 'Ναι, αφαίρεση',
              cancel_action: 'Ακύρωση',
            },
          },
        },
        PrebookingPages: {},
        TourPlansPages: {
          TourPlanDetailsPage: {
            tourPlanNotFound: 'Η περιοδεία δεν βρέθηκε',
            subpages: {
              general: {
                name: 'Γενικά',
                sections: {
                  dates: {
                    name: 'Ημερομηνίες',
                    attributes: {
                      initial_date: 'Αρχική ημερομηνία',
                      final_date: 'Τελική ημερομηνία',
                      total_days: 'Συνολικές ημέρες',
                      events_state_summary: 'Εκδηλώσεις',
                    },
                  },
                  shows: {
                    name: 'Shows',
                  },
                },
              },
              dates: {
                name: 'Ημερομηνίες',
              },
              budget: {
                name: 'Προϋπολογισμός',
                sections: {
                  internal_transportation: {
                    name: 'Εσωτερική μεταφορά',
                  },
                  intercity_transportation: {
                    name: 'Διαπολιτειακή μεταφορά',
                  },
                  accommodation: {
                    name: 'Διαμονή',
                  },
                  food: {
                    name: 'Φαγητό',
                  },
                },
              },
              wishes: {
                name: 'Επιθυμίες',
                sections: {
                  guest_artists: {
                    name: 'Καλεσμένοι καλλιτέχνες',
                  },
                  possible_shows: {
                    name: 'Πιθανά shows',
                  },
                },
              },
              settings: {
                name: 'Ρυθμίσεις',
              },
            },
          },
        },
      },
      ArtistsPages: {
        ArtistsDetailsPage: {
          subpages: {
            general: {
              name: 'Γενικά',
              sections: {
                artist_gallery: {
                  name: 'Γκαλερί του καλλιτέχνη',
                  attributes: {
                    members: 'Μέλη',
                    live: 'Ζωντανά',
                  },
                },
                live_gallery: {
                  name: 'Ζωντανή γκαλερί',
                },
                general: {
                  name: 'Γενικές πληροφορίες',
                  attributes: {
                    description: 'Περιγραφή',
                    since: 'Από',
                    origin_city: 'Πόλη προέλευσης',
                    home_city: 'Πόλη κατοικίας',
                    categories: 'Κατηγορίες',
                    genres: 'Είδη',
                    spoken_languages: 'Γλώσσες που μιλιούνται',
                    stage_languages: 'Γλώσσες σκηνής',
                    arts_languages: 'Καλλιτεχνικές γλώσσες',
                  },
                },
                genres: {
                  name: 'Είδη',
                },
                contact: {
                  name: 'Επικοινωνία',
                  attributes: {
                    website: 'Ιστοσελίδα',
                    email: 'Email',
                    phone: 'Τηλέφωνο',
                    mobile_phone: 'Κινητό',
                    whatsapp: 'WhatsApp',
                  },
                },
                social_networks: {
                  name: 'Κοινωνικά δίκτυα',
                },
                record_label: {
                  name: 'Δισκογραφική',
                },
                members: {
                  name: 'Μέλη',
                },
              },
            },
            members: {
              name: 'Μέλη',
              sections: {
                music_performance: {
                  name: 'Όργανα',
                  attributes: {
                    member_names: 'Ονόματα',
                    member_surenames: 'Επώνυμα',
                    member_role: 'Ρόλος',
                    member_instrument: 'Όργανο',
                    gender: 'Φύλο',
                    email: 'Email',
                    stage_name: 'Καλλιτεχνικό όνομα',
                  },
                },
                audio_engineering: {
                  name: 'Ηχητική Μηχανική',
                },
                visual_arts: {
                  name: 'Οπτικά',
                },
                management: {
                  name: 'Διαχείριση',
                },
                production: {
                  name: 'Παραγωγή',
                },
                support: {
                  name: 'Υποστήριξη',
                },
              },
            },
            arts: {
              name: 'Τέχνες',
              sections: {
                discography: {
                  name: 'Δισκογραφία',
                  attributes: {
                    albums: 'Άλμπουμ',
                    top_tracks: 'Κορυφαία τραγούδια',
                    dvd_video: 'DVD / Βίντεο',
                  },
                },
                media_channels: {
                  name: 'Κανάλια πολυμέσων',
                },
                gallery: {
                  name: 'Γκαλερί',
                  attributes: {
                    photos: 'Φωτογραφίες',
                    video: 'Βίντεο',
                  },
                },
                awards: {
                  name: 'Βραβεία',
                },
              },
            },
            social: {
              name: 'Κοινωνικά',
              sections: {
                social_network_presence: {
                  name: 'Παρουσία στα κοινωνικά δίκτυα',
                },
                stats: {
                  name: 'Στατιστικά',
                  attributes: {
                    general_rate: 'Γενική αξιολόγηση',
                    followers: 'Followers',
                    event_followers: 'Followers εκδηλώσεων',
                  },
                },
                rating: {
                  name: 'Αξιολόγηση',
                },
              },
            },
            shows: {
              name: 'Shows',
              sections: {
                summary: {
                  name: 'Σύνοψη',
                  attributes: {
                    priceRange: 'Τιμές',
                  },
                },
                next_shows: {
                  name: 'Επόμενα shows',
                },
                past_shows: {
                  name: 'Παλιά shows',
                },
              },
            },
            followers: {
              name: 'Followers',
            },
            documents: {
              name: 'Έγγραφα',
              sections: {
                technical_docs: {
                  name: 'Τεχνικά Έγγραφα',
                  docs: {
                    technical_epk: 'EPK',
                    technical_rider: 'Τεχνικό Rider',
                    stage_plot: 'Σχέδιο Σκηνής',
                  },
                },
              },
            },
          },
        },
      },
      HomePage: {
        welcome: 'Καλώς ήρθατε',
        news: 'Νέα',
        artists: 'Καλλιτέχνες',
        events: 'Εκδηλώσεις',
        places: 'Χώροι',
        industry_offer: {
          title: 'Είστε μέρος της μουσικής βιομηχανίας;',
          call_to_action: 'Γνωρίστε την πρόταση μας',
        },
      },
      EventsPages: {
        EventDetailsPage: {
          subpages: {
            general: {
              name: 'Πληροφορίες',
              sections: {
                general: {
                  name: 'Γενικές πληροφορίες',
                  attributes: {
                    national_code: 'Κωδικός PULEP',
                    timetable__initial_date: 'Πότε;',
                    initial_time: 'Ώρα',
                    minimumAge: 'Ελάχιστη ηλικία',
                    timetable__openning_doors: 'Άνοιγμα θυρών',
                    promoter: 'Υπεύθυνος',
                    tickets_website: 'Ιστοσελίδα εισιτηρίων',
                  },
                },
                description: {
                  name: 'Περιγραφή',
                },
                genres: {
                  name: 'Είδη',
                },
              },
            },
            artists: {
              name: 'Καλλιτέχνες',
              sections: {
                main_artists: { name: 'Κύριοι καλλιτέχνες' },
                other_artists: { name: 'Άλλοι καλλιτέχνες' },
              },
            },
            place: {
              name: 'Χώρος',
              sections: {
                location: {
                  name: 'Τοποθεσία',
                },
              },
            },
            tickets: {
              name: 'Εισιτήρια',
              sections: {
                general: {
                  name: 'Γενικές πληροφορίες',
                  attributes: {
                    tickets_website: 'Ιστοσελίδα εισιτηρίων',
                    price: 'Τιμή',
                  },
                },
              },
            },
            contact: {
              name: 'Επικοινωνία & Δίκτυα',
              sections: {
                contact: {
                  name: 'Στοιχεία επικοινωνίας',
                },
                social_networks: {
                  name: 'Κοινωνικά δίκτυα',
                },
              },
            },
            extra_info: {
              name: 'Επιπλέον',
              sections: {
                additional_info: { name: 'Επιπλέον πληροφορίες' },
                dress_code: { name: 'Κώδικας ντυσίματος' },
                discounts: { name: 'Εκπτώσεις' },
                promoter: { name: 'Διοργανωτής' },
              },
            },
          },
        },
      },
      PlacesPages: {
        PlacesDetailsPage: {
          subpages: {
            general: {
              name: 'Γενικά',
              sections: {
                gallery: {
                  name: 'Γκαλερί',
                },
                general: {
                  name: 'Γενικές πληροφορίες',
                  attributes: {
                    description: 'Περιγραφή',
                    place_type: 'Τύπος χώρου',
                    address: 'Διεύθυνση',
                    city: 'Πόλη',
                    cityWithCountry: 'Τοποθεσία',
                    home_city: 'Τοποθεσία',
                    categories: 'Κατηγορίες',
                    since: 'Από',
                    spoken_languages: 'Γλώσσες που μιλιούνται',
                    stage_languages: 'Γλώσσες σκηνής',
                    arts_languages: 'Καλλιτεχνικές γλώσσες',
                    activity: 'Είναι ενεργό;',
                    has_open_mic: 'Έχει ανοιχτό μικρόφωνο;',
                    total_audience_capacity: 'Μέγ. χωρητικότητα',
                    bookingRatesPolicy: 'Πολιτικές κράτησης',
                    regulatory_closing_time: 'Κανονιστική ώρα κλεισίματος',
                  },
                },
                genres: {
                  name: 'Είδη',
                },
                contact: {
                  name: 'Επικοινωνία',
                  attributes: {
                    website: 'Ιστοσελίδα',
                    email: 'Email',
                    phone: 'Τηλέφωνο',
                    mobile_phone: 'Κινητό',
                    whatsapp: 'WhatsApp',
                  },
                },
                social_networks: {
                  name: 'Κοινωνικά δίκτυα',
                },
              },
            },
            stats: {
              name: 'Στατιστικά',
              sections: {
                social_network_presence: {
                  name: 'Παρουσία στα κοινωνικά δίκτυα',
                },
                rating: {
                  name: 'Αξιολόγηση',
                },
              },
            },
            shows: {
              name: 'Εκδηλώσεις',
              sections: {
                next_shows: {
                  name: 'Επόμενες εκδηλώσεις',
                },
                past_shows: {
                  name: 'Παλιές εκδηλώσεις',
                },
              },
            },
            backline: {
              name: 'Backline',
              sections: {
                sound_backline: {
                  name: 'Backline ήχου',
                },
                light_backline: {
                  name: 'Backline φωτισμού',
                },
              },
            },
            menu: {
              name: 'Μενού',
              sections: {
                main_course: {
                  name: 'Κύριο πιάτο',
                },
                second_course: {
                  name: 'Δεύτερο πιάτο',
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
          active: { name: 'Ενεργές ανοικτές προσκλήσεις' },
          past: { name: 'Παλαιότερες ανοικτές προσκλήσεις' },
          available: { name: 'Διαθέσιμες' },
          applications: { name: 'Οι αιτήσεις μου' },
        },
        attributes: {
          event_name: 'Όνομα εκδήλωσης',
          event_date: 'Ημερομηνία εκδήλωσης',
          start_date: 'Έναρξη',
          end_date: 'Λήξη',
          status: 'Κατάσταση',
          applications_count: 'Αιτήσεις',
          city: 'Πόλη',
          genres: 'Είδη',
          application_status: 'Κατάσταση της αίτησής σου',
        },
      },
      OpenCallDetailsPage: {
        applications_received_title: 'Αιτήσεις που Ελήφθησαν',
        your_application_title: 'Η αίτησή σου',
        no_applications_yet: 'Δεν υπάρχουν ακόμη αιτήσεις για αυτήν την πρόσκληση.',
        not_applied_yet: 'Δεν έχεις υποβάλει ακόμη αίτηση για αυτήν την πρόσκληση.',
        loading_applications: 'Φόρτωση αιτήσεων...',
        loading_your_application: 'Φόρτωση της αίτησής σου...',
        unauthorized_message: 'Συνδέσου με προφίλ Artist ή Place για να δεις τις αιτήσεις αυτής της πρόσκλησης.',
        back_button: 'Πίσω στις προσκλήσεις μου',
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
          pending: 'Σε εκκρεμότητα',
          accepted: 'Αποδεκτή',
          rejected: 'Απορρίφθηκε',
        },
        actions: {
          accept: 'Αποδοχή',
          reject: 'Απόρριψη',
        },
      },
    },
    appbase: {
      betabar: {
        contact_us: 'Επικοινωνήστε μαζί μας',
        disclaimer:
          'Βλέπετε μια δοκιμαστική έκδοση της πλατφόρμας μας. Ελπίζουμε να σας αρέσει. Μπορείτε να επικοινωνήσετε μαζί μας χρησιμοποιώντας το παρακάτω κουμπί.',
        our_email_is: 'Το email μας είναι:',
      },
      claimProfileBanner: {
        PROFILE_AUTO_GENERATED_CAPTION:
          'Αυτό το προφίλ δημιουργήθηκε με δημόσιες πληροφορίες που είναι διαθέσιμες στο διαδίκτυο. Είναι δικό σας; Διεκδικήστε το δωρεάν προφίλ σας για να το διαχειρίζεστε και να το ενημερώνετε.',
        PROFILE_CONFIRMATION_MESSAGE:
          'Σας ευχαριστούμε για το ενδιαφέρον σας να διεκδικήσετε αυτό το προφίλ. Πατώντας το κουμπί "Διεκδίκηση προφίλ", μας εξουσιοδοτείτε να ξεκινήσουμε τη διαδικασία επαλήθευσης της ιδιοκτησίας στο όνομά σας. Μόλις επιβεβαιωθεί η ιδιοκτησία, θα έχετε πρόσβαση στο προφίλ με διαχειριστικούς ρόλους για να αλληλεπιδράσετε με τους φαν σας και τη μουσική βιομηχανία χρησιμοποιώντας όλα τα εργαλεία του Artist Hive. <br />Λάβετε υπόψη ότι η διαδικασία επαλήθευσης μπορεί να διαρκέσει από 5 έως 10 εργάσιμες ημέρες. Θα σας ενημερώσουμε μέσω email ή μέσω των social media του προφίλ.',
        CLAIM_REQUEST_CONFIRMATION:
          'Το αίτημά σας καταχωρήθηκε επιτυχώς. Θα επικοινωνήσουμε μαζί σας μέσω email ή μέσω social media μόλις επιλυθεί.',
        CLAIM_BUTTON: 'Διεκδίκηση προφίλ',
      },
      reportProfileForm: {
        title: 'Αναφορά προφίλ',
        reason_label: 'Λόγος αναφοράς',
        reasons: {
          DUPLICATE: 'Διπλότυπο προφίλ',
          FAKE: 'Ψεύτικο προφίλ',
          WRONG_INFO: 'Εσφαλμένες πληροφορίες',
          BELONGS_TO_ME: 'Αυτό το προφίλ μου ανήκει αλλά έχει εκχωρηθεί σε άλλο άτομο',
          INAPPROPRIATE_CONTENT: 'Ακατάλληλο περιεχόμενο',
          OTHER: 'Άλλο',
        },
        description_label: 'Περιγραφή',
        description_placeholder: 'Πείτε μας περισσότερες λεπτομέρειες σχετικά με αυτήν την αναφορά',
        submit_button: 'Αποστολή αναφοράς',
        success_message:
          'Η αναφορά σας έχει σταλεί. Σας ευχαριστούμε που μας βοηθάτε να διατηρούμε την πλατφόρμα ασφαλή.',
        error_message: 'Παρουσιάστηκε σφάλμα κατά την αποστολή της αναφοράς σας. Δοκιμάστε ξανά.',
        duplicate_pending_error: 'Έχετε ήδη μια εκκρεμή αναφορά για αυτό το προφίλ.',
      },
      footer: {
        columns: {
          what_we_do: {
            name: 'Τι κάνουμε;',
            options: {
              cultural_agenda: 'Πολιτιστικό ημερολόγιο',
              for_academies: 'Για ακαδημίες',
              for_artists: 'Για καλλιτέχνες',
              for_places: 'Για χώρους',
              for_promoters: 'Για διοργανωτές',
              for_festivals: 'Για φεστιβάλ',
            },
          },
          about_us: {
            name: 'Σχετικά με εμάς',
            options: {
              history: 'Ιστορία μας',
              press: 'Τύπος',
              career: 'Καριέρα',
              download: 'Κατέβασμα εφαρμογής',
            },
          },
          help: {
            name: 'Βοήθεια',
            options: {
              data_policy: 'Πολιτική δεδομένων',
              help_center: 'Κέντρο βοήθειας',
              contact_us: 'Επικοινωνήστε μαζί μας',
              report: 'Αναφορά',
              terms: 'Όροι χρήσης',
            },
          },
        },
        copyright: {
          allRightsReserved: 'Όλα τα δικαιώματα διατηρούνται',
        },
      },
      search: {
        empty_results: {
          title: 'Δεν υπάρχουν αποτελέσματα που να ταιριάζουν με την αναζήτησή σας',
          suggestions: {
            statement: 'Δοκιμάστε μία από τις παρακάτω προτάσεις',
            spelling: 'Ελέγξτε την ορθογραφία',
            less_words: 'Χρησιμοποιήστε πιο γενικές λέξεις ή λιγότερες λέξεις',
            related_things: 'Περιηγηθείτε στις κατηγορίες για να βρείτε παρόμοια στοιχεία',
          },
        },
        filters: {
          title: 'Φίλτρα',
          subpages: {
            general: {
              name: 'Γενικά',
              sections: {
                general: {
                  name: 'Γενικά',
                  attributes: {
                    genres: 'Είδη',
                    cityWithCountry: 'Πού;',
                  },
                },
                dates: {
                  name: 'Ημερομηνίες',
                  attributes: {
                    date: 'Πότε;',
                  },
                },
                languages: {
                  name: 'Γλώσσες',
                  attributes: {
                    spoken_languages: 'Γλώσσες που μιλιούνται',
                    stage_languages: 'Γλώσσες σκηνής',
                    arts_languages: 'Καλλιτεχνικές γλώσσες',
                  },
                },
              },
            },
            artists: {
              name: 'Καλλιτέχνες',
              sections: {
                general: {
                  name: 'Γενικά',
                  attributes: {
                    is_available_at: 'Είναι διαθέσιμος σε',
                    has_albums: 'Έχει άλμπουμ;',
                    music_awards: 'Μουσικά βραβεία',
                  },
                },
                rating: {
                  name: 'Αξιολόγηση',
                  attributes: {
                    overall: 'Συνολικά',
                    talent: 'Ταλέντο',
                    performance: 'Απόδοση',
                  },
                },
              },
            },
            places: {
              name: 'Χώροι',
              sections: {
                stage: {
                  name: 'Σκηνή',
                  attributes: {
                    stage_width: 'Πλάτος',
                    stage_length: 'Μήκος',
                    stage_height: 'Ύψος',
                  },
                },
                backline: {
                  name: 'Backline',
                  attributes: {
                    mics: 'Μικρόφωνα',
                  },
                },
              },
            },
            social_networks: {
              name: 'Κοινωνικά δίκτυα',
              sections: {
                presence: {
                  name: 'Παρουσία',
                  attributes: {
                    has_social_networks: 'Έχει αυτά τα δίκτυα;',
                  },
                },
              },
            },
          },
        },
        not_found_results: 'Δεν βρέθηκαν αποτελέσματα',
        recommendations: 'Προτάσεις',
        result_view_types: {
          list: 'Λίστα',
          map: 'Χάρτης',
        },
        results: 'Αποτελέσματα',
        search: 'Αναζήτηση',
        search_placeholder: 'Καλλιτέχνες, εκδηλώσεις, χώροι...',
        see_more: 'Δείτε περισσότερα',
        what_are_you_looking_for: 'Τι ψάχνετε;',
        types: {
          ARTISTS: 'Καλλιτέχνες',
          PLACES: 'Χώροι',
          EVENTS: 'Εκδηλώσεις',
        },
        type_your_search: 'Πληκτρολογήστε την αναζήτησή σας',
      },
      sidenav: {
        name: 'Κύριο μενού',
        sections: {
          general: {
            name: 'Γενικά',
            options: {
              home: 'Αρχική',
              cultural_agenda: 'Πολιτιστικό ημερολόγιο',
              opportunities: 'Ευκαιρίες',
              search: 'Αναζήτηση',
            },
          },
          industry: {
            name: 'Μουσική βιομηχανία',
            options: {
              industry_member: 'Ανήκετε στη μουσική βιομηχανία;',
            },
          },
          myInfo: {
            name: 'Οι πληροφορίες μου',
            options: {
              inbox: 'Εισερχόμενα',
              'inbox.nested': {
                incoming: 'Εισερχόμενα',
                sent: 'Απεσταλμένα',
              },
              crew: 'Η ομάδα μου',
              my_profile: 'Το προφίλ μου',
              my_bands: 'Τα συγκροτήματά μου',
              'my_bands.nested': { create: 'Δημιουργία συγκροτήματος' },
              my_events: 'Οι εκδηλώσεις μου',
              'my_events.nested': { create: 'Δημιουργία εκδήλωσης' },
              my_riders: 'Τα riders μου',
              my_open_calls: 'Οι ανοικτές προσκλήσεις μου',
              my_places: 'Οι χώροι μου',
              'my_places.nested': { create: 'Δημιουργία χώρου' },
              favourites: 'Αγαπημένα',
              'favourites.nested': {
                saved: 'Αποθηκευμένα',
                tour_planning: 'Σχεδιασμός περιοδείας',
              },
              my_prebooking_requests: 'Τα αιτήματά μου',
              my_calendar: 'Το ημερολόγιό μου',
            },
          },
          settings: {
            name: 'Ρυθμίσεις',
            options: {
              settings: 'Ρυθμίσεις',
              help_center: 'Κέντρο βοήθειας',
              report: 'Αναφορά',
              send_comments: 'Αποστολή σχολίων',
              logout: 'Αποσύνδεση',
            },
          },
        },
      },
    },
  },
};
