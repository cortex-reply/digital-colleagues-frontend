"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Colleague } from "@/payload-types";

interface SquadMembersListProps {
  members?: Colleague[] | null;
  onRemoveMember: (userId: string) => void;
}

export function SquadMembersList({
  members,
  onRemoveMember,
}: SquadMembersListProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {members?.map((member) => {
        const isAI = member.colleagueType === "digital";
        console.log("memeber", member);
        return (
          <Card
            key={member.id}
            className={`overflow-hidden transition-all duration-200 hover:shadow-md ${isAI ? "ai-border" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {/* {!isAI && typeof member.human !== 'number' && (
                      <Avatar
                        className={`h-10 w-10 cursor-pointer ${isAI ? "ai-border" : ""}`}
                      >
                        <AvatarImage src={member.human} alt={member.name} />
                        <AvatarFallback>
                          {member.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )} */}
                    <p>
                      {!isAI &&
                        typeof member.human !== "number" &&
                        member.human?.name}
                    </p>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onSelect={() => onRemoveMember(member.id.toString())}
                    >
                      Remove from squad
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex-1">
                  {/* <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {member.role}
                  </div> */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {isAI && (
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 border-blue-300"
                      >
                        AI Assistant
                      </Badge>
                    )}
                    {/* {member.skills &&
                      member.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))} */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
