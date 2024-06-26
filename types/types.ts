export type HomeCardType = {
  title: string;
  subtitle: string;
  src: string;
  className: string;
  state?: string;
  index: number;
  handleClick: () => void;
};
