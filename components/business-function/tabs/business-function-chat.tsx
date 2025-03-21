import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BusinessFunctionChat = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Function Chat</CardTitle>
        <CardDescription>Communicate with your team members</CardDescription>
      </CardHeader>
      <CardContent>
        {/* <ChatInterface
        messages={businessFunction.messages}
        contextType="businessFunction"
        contextId={businessFunction.id}
      /> */}
      </CardContent>
    </Card>
  );
};

export default BusinessFunctionChat;
