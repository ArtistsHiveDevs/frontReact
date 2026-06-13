export const TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE = '';

export interface OpenCallApplicationEntry {
  id: string;
  artist_name: string;
  artist_profile_pic: string;
  artist_city: string;
  applied_at: string;
  status: 'pending' | 'accepted' | 'rejected';
  survey_responses: Record<string, any>;
}

export interface OpenCallDetailsDataTemplate {
  open_call: {
    id: string;
    event_name: string;
    event_date: string;
    start_date: string;
    end_date: string;
    status: string;
    description: string;
    city: string;
    genres: string[];
  };
  applications: OpenCallApplicationEntry[];
}
