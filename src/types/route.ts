export type RouteName =
  | 'home'
  | 'boxers'
  | 'boxer-profile'
  | 'boxer-form'
  | 'skills'
  | 'skill-detail'
  | 'evaluate'
  | 'timer'
  | 'history'
  | 'settings';

export interface Route {
  name: RouteName;
  boxerId?: string;
  skillId?: string;
}
