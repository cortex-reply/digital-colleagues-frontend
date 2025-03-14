import { SquadMembersList } from "@/components/squad/squad-members-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

const BusinessFunctionSquad = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Squad Members</CardTitle>
          <CardDescription>
            Members of this business function squad
          </CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add to Squad
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Colleague to Squad</DialogTitle>
              <DialogDescription>
                Select a colleague to add to this business function squad.
              </DialogDescription>
            </DialogHeader>
            {/* <Select onValueChange={(value) => handleAddColleague(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a colleague" />
              </SelectTrigger>
              <SelectContent>
                {availableColleagues.map((colleague) => (
                  <SelectItem key={colleague.id} value={colleague.id}>
                    {colleague.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {/* <SquadMembersList
          members={businessFunction.members}
          onRemoveMember={handleRemoveColleague}
        /> */}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          To remove a squad member, click on their avatar and select "Remove
          from squad".
        </p>
      </CardFooter>
    </Card>
  );
};

export default BusinessFunctionSquad;
