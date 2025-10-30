import ITRDetailsForm from "@/components/itr/itr-details-form"

export default function ITRDetailsPage() {
  return (
    <main className="container mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-pretty">Complete your ITR details</h1>
        <p className="text-muted-foreground mt-2">
          Please provide the necessary information to proceed with AI-assisted ITR filing.
        </p>
      </div>
      <ITRDetailsForm />
    </main>
  )
}
