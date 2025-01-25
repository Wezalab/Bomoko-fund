interface TestimonialCardProps{
    img?:string 
    name:string 
    description:string 
    className?:string
}

function TestimonialCard({
    img,
    name,
    description,
    className
}:TestimonialCardProps) {
  return (
    <div className={"relative flex gap-8 w-[555px] bg-white rounded-xl border-[1px] border-lightBlue"+className}>
        <img src={img} className="w-[120px] h-[120px] absolute top-5 -left-8 rounded-[15px] z-10" />
        <div className="flex absolute left-28 flex-col top-2 space-y-2">
            <span className="font-semibold text-[24px] text-black">{name}</span>
            <span className="text-[16px] text-lightGray text-sm">{description}</span>
        </div>
    </div>
  )
}

export default TestimonialCard