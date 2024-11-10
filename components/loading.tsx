import { Spinner } from "@nextui-org/spinner";

export const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/70">
      <Spinner color="default" labelColor="foreground" size="lg" />
    </div>
  );
};
