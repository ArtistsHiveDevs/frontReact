export interface ProfileDetailsSubpage {
  name: string;
  sections?: ProfileDetailsSubpageSection[];
}
export interface ProfileDetailsSubpageSection {
  name: string;
  attributes?: ProfileDetailAttributeConfiguration[];
}
export interface ProfileDetailAttributeConfiguration {
  name: string;
  icon?: string;
  emptyTitle?: boolean;
  literal?: boolean;
}
