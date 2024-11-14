import { Spinner } from "@nextui-org/spinner";

export const Loading = () => {
  return (
    <div className="flex justify-start animate-in fade-in-0 slide-in-from-bottom-1">
      <div className="bg-default-100 rounded-2xl px-4 py-2">
        <Spinner color="default" size="sm" />
      </div>
    </div>
  );
};
