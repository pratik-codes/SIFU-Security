import { InView } from "@/components/in-view"

// props type
interface InViewBasicProps {
  position: string
  title: string
  description: string
  imageUrl: string
}

export function InViewBasic({ position, title, description, imageUrl }: InViewBasicProps) {
  const isLeft = position === "left"
  return (
    <div className=" mx-auto overflow-auto scrollbar-none overflow-y-none">
      <div className="flex h-[500px] items-end justify-center px-4 pb-24">
        <InView
          variants={{
            hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          viewOptions={{ margin: "0px 0px -200px 0px" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="h-[450px] md:w-6/12 mx-auto flex flex-col md:flex-row items-center">
            {isLeft && (
              <div className="text-left md:w-1/2 p-4">
                <h2 className="text-lg text-center md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                  {title}
                </h2>
                <p className="mt-2 font-normal text-base text-neutral-300 max-w-xl text-center mx-auto">
                  {description}
                </p>
              </div>
            )}

            <div className="md:w-1/2 flex justify-center p-4">
              <img
                src={imageUrl}
                alt="Example Image"
                className="w-full h-auto object-cover rounded-md"
              />
            </div>

            {!isLeft && (
              <div className="text-right md:w-1/2 p-4">
                <h2 className="text-lg md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                  {title}
                </h2>
                <p className="mt-2 font-normal text-base text-neutral-300 max-w-xl text-center mx-auto">
                  {description}
                </p>
              </div>
            )}
          </div>
        </InView>
      </div>
      <br />
    </div>
  )
}
