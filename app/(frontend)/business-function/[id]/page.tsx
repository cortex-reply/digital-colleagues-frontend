import { getBusinessFunctionById } from "@/actions/business-function";
import { BusinessFunctionView } from "@/components/business-function/business-function-view";
import { Shell } from "@/components/shell";
// import { getBusinessFunctionById } from "@/lib/data"

export default async function BusinessFunctionPage({
  params,
}: {
  params: { id: string };
}) {
  const par = await params;

  const businessFunction = await getBusinessFunctionById(par.id);

  if (!businessFunction) {
    return <div>Business Function not found</div>;
  }

  return (
    <Shell>
      {businessFunction && businessFunction.function && (
        <BusinessFunctionView
          businessFunction={{
            ...businessFunction.function,
            // memberCount: 12,
            // members: [],
            // messages: [],
          }}
        />
      )}
    </Shell>
  );
}
