import { getColleagues } from "@/actions/colleagues";
import {
  addSquadMember,
  getSquadById,
  removeSquadMember,
} from "@/actions/squads";
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
import { getId } from "@/lib/utils";
import { Colleague, Function } from "@/payload-types";
import { useBusinessFunctionContext } from "@/providers/bussiness-function";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface BusinessFunctionSquadProps {
  businessFunction: Function;
}

const BusinessFunctionSquad: React.FC<BusinessFunctionSquadProps> = ({
  businessFunction,
}) => {
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const { updateBusinessFunction } = useBusinessFunctionContext();

  const fetchColleagues = useCallback(async () => {
    const res = await getColleagues();
    setColleagues(res.colleagues);
  }, []);

  useEffect(() => {
    fetchColleagues();
  }, []);

  const members =
    typeof businessFunction?.squad !== "number"
      ? businessFunction.squad?.colleagues
      : [];

  const removeMember = useCallback(
    async (colleagueId: string) => {
      if (!businessFunction.squad) return;
      const res = await removeSquadMember(
        getId(businessFunction.squad).toString(),
        colleagueId
      );
      updateBusinessFunction(businessFunction.id);
    },
    [businessFunction]
  );

  const handleAddColleague = useCallback(
    async (colleagueId: string) => {
      if (!businessFunction.squad) return;
      const res = await addSquadMember(
        getId(businessFunction.squad).toString(),
        colleagueId
      );

      const currSquad =
        typeof businessFunction.squad !== "number"
          ? businessFunction.squad
          : (await getSquadById(businessFunction.squad)).squad;
      updateBusinessFunction(businessFunction.id);
    },
    [businessFunction]
  );

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
            <Select onValueChange={(value) => handleAddColleague(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a colleague" />
              </SelectTrigger>
              <SelectContent>
                {colleagues
                  .filter((el) => {
                    return !members?.map((el) => el.id).includes(el.id);
                  })
                  .map((colleague) => (
                    <SelectItem
                      key={colleague.id}
                      value={colleague.id.toString()}
                    >
                      {colleague.human.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <SquadMembersList members={members} onRemoveMember={removeMember} />
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
