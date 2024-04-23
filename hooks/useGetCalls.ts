import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCalls = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const client = useStreamVideoClient();

  const { user } = useUser();

  const { toast } = useToast();

  useEffect(() => {
    const loadCalls = async () => {
      try {
        if (!client || !user?.id) return;

        setIsLoading(true);

        const { calls } = await client?.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user?.id },
              { members: { $in: [user?.id] } },
            ],
          },
        });
        setCalls(calls);
      } catch (error) {
        console.log(error);
        toast({
          title: "something went Wrong",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCalls();
  }, [client, user?.id, toast]);

  const currentTime = new Date();

  const previousCalls = calls.filter(
    ({ state: { startsAt, endedAt } }: Call) => {
      return (startsAt && new Date(startsAt) < currentTime) || !!endedAt;
    }
  );

  const upcomingCalls = calls.filter(({ state: { startsAt } }: Call) => {
    return startsAt && new Date(startsAt) > currentTime;
  });

  return {
    previousCalls,
    upcomingCalls,
    callRecordings: calls,
    isLoading,
  };
};
