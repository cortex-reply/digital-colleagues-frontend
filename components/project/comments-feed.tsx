import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import type { Comment } from "@/lib/types"

export function CommentsFeed({ comments }: { comments: Comment[] }) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="flex items-start space-x-4 p-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
              <AvatarFallback>{comment.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{comment.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                </p>
              </div>
              <p className="text-sm">{comment.content}</p>
              <p className="text-xs text-muted-foreground">Task: {comment.taskTitle}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

