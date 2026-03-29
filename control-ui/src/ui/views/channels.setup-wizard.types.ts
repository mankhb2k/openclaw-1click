export type ChannelWizardStep = 1 | 2 | 3;

export type ChannelWizardState = {
  channelWizardOpen: boolean;
  channelWizardChannel: string | null;
  channelWizardStep: ChannelWizardStep;
  channelWizardFields: Record<string, string>;
  channelWizardBusy: boolean;
  channelWizardError: string | null;
  channelWizardDone: boolean;
};
