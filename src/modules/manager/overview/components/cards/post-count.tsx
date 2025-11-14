import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

function PostCount() {
  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-between">
            <h4 className="text-muted-foreground">All your Posts</h4>
            <Badge variant={"outline"} className="rounded-full">
              <TrendingUp />
              +4.5%
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold">2,400</h1>
          <div>
            <CardDescription>
              Total posts you have created and scheduled to be posted.
            </CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AlreadyPosted() {
  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-between">
            <h4 className="text-muted-foreground">Posts Published</h4>
            <Badge variant={"outline"} className="rounded-full">
              <TrendingUp />
              +2.1%
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold">98</h1>
          <div>
            <CardDescription>
              Posts you have already shared on social media.
            </CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RemainingPosts() {
  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex w-full justify-between">
            <h4 className="text-muted-foreground">Remaining Posts</h4>
            <Badge variant={"outline"} className="rounded-full">
              <TrendingUp />
              -1.2%
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold">2,302</h1>
          <div>
            <CardDescription>
              Posts left to be created and scheduled for publishing.
            </CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { AlreadyPosted, PostCount, RemainingPosts };

