import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlreadyPosted,
  PostCount,
  RemainingPosts,
} from "@/modules/manager/overview/components/cards/post-count";
import Posttable from "@/modules/manager/overview/components/table/post-table";

export default async function Page() {
  return (
    <div className="flex min-h-screen w-full gap-4">
      {/* <div className="flex-1 w-full">
        <PostLayout>
          <PostContent>
            <PostCardHeader>
              <PostTitle>Build Posts</PostTitle>
              <p className="text-sm text-muted-foreground">
                Create your posts with AI to increase your product promotions.
                🌟
              </p>
            </PostCardHeader>
            <PostBody>
              <PostCard />
            </PostBody>
          </PostContent>
        </PostLayout>
      </div> */}
      <div className="flex-2 space-y-4">
        <div className="flex w-full gap-2">
          <PostCount />
          <AlreadyPosted />
          <RemainingPosts />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts Table Overview</CardTitle>
            <CardDescription>
              A list of your most recent posts and their status on social media.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Posttable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
