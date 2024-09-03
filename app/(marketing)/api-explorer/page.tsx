import ApiClient from "@/components/api-client"

export const metadata = {
  title: "Explore the API's",
}

export default function ApiExplorerPage() {
  return (
    <section className="w-full py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Explore the Api's
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400">
              Here you can test the api yourself and see the api response in real time.
            </p>
          </div>
          <ApiClient />
        </div>
      </div>
    </section>
  )
}
