import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import type { Event } from "@/lib/types"

export function EventFeed({ events }: { events: Event[] }) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id}>
          <CardContent className="flex items-start space-x-4 p-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={event.user.avatar} alt={event.user.name} />
              <AvatarFallback>{event.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{event.user.name}</p>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

