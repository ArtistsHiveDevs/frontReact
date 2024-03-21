import './Badge.scss';

export interface BadgeParams {
  text: string;
  showDeleteIcon?: boolean;
  onClick?: Function;
}
export const Badge = (props: BadgeParams) => {
  return <div className="custom-badge">{props.text}</div>;
};
