import { getFollowups } from "@/actions/communication";
import { FollowupsTable } from "../index";

export async function CommunicationFollowupsSection() {
  try {
    const followups = await getFollowups();
    return <FollowupsTable followups={followups} />;
  } catch {
    return <FollowupsTable followups={[]} />;
  }
}
