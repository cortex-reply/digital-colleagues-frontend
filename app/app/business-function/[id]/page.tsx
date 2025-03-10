import { BusinessFunctionView } from "@/components/business-function/business-function-view"
import { Shell } from "@/components/shell"
import { getBusinessFunctionById } from "@/lib/data"

export default function BusinessFunctionPage({ params }: { params: { id: string } }) {
  const businessFunction = getBusinessFunctionById(params.id)

  if (!businessFunction) {
    return <div>Business Function not found</div>
  }

  return (
    <Shell>
      <BusinessFunctionView businessFunction={businessFunction} />
    </Shell>
  )
}

