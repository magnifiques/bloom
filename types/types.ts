export type HomeCardType = {
  title: string;
  subtitle: string;
  src: string;
  bgColor: string;
  state?:
    | "isScheduledMeeting"
    | "isJoiningMeeting"
    | "isInstantMeeting"
    | undefined;

  handleClick: () => void;
};
