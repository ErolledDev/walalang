export interface User {
  id: string;
  email: string;
}

export interface WidgetSettings {
  id: string;
  user_id: string;
  business_name: string;
  representative_name: string;
  brand_color: string;
  business_description: string;
}

export interface AutoReply {
  id: string;
  user_id: string;
  keyword: string;
  response: string;
  match_type: 'exact' | 'fuzzy' | 'regex' | 'synonym';
  synonyms?: string[];
}

export interface AdvancedReply {
  id: string;
  user_id: string;
  keyword: string;
  button_text: string;
  response?: string;
  url?: string;
  match_type: 'exact' | 'fuzzy' | 'regex' | 'contains';
}

export interface AISettings {
  id: string;
  user_id: string;
  enabled: boolean;
  api_key: string;
  model: string;
  business_context: string;
  created_at?: string;
}

export interface ChatAnalytics {
  id: string;
  user_id: string;
  visitor_name: string;
  visitor_email: string;
  ip_address?: string;
  timestamp: string;
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  analytics_id: string;
  message: string;
  sender: string;
  timestamp: string;
  created_at?: string;
}