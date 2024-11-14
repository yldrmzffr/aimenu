export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ChatHeaderProps {
  title: string;
  subtitle: string;
  onClose: () => void;
}

export interface ChatMessageProps {
  message: Message;
  index: number;
}

export interface ChatInputProps {
  isLoading: boolean;
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
}
