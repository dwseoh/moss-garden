import Image from "next/image"

interface ConceptSectionProps {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  reverse?: boolean
}

export default function ConceptSection({
  title,
  description,
  imageSrc,
  imageAlt,
  reverse = false,
}: ConceptSectionProps) {
  return (
    <div className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}>
      <div className="w-full md:w-1/2">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={imageAlt}
          width={800}
          height={500}
          className="rounded-xl shadow-md"
        />
      </div>
      <div className="w-full md:w-1/2 space-y-4">
        <h3 className="text-2xl font-light text-stone-800">{title}</h3>
        <p className="text-stone-600 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
