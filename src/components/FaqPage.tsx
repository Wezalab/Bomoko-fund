import { faqs } from '@/constants/dummydata'
import callIcon from '../assets/callIcon.png'
import helpIcon from '../assets/helpIcon.png'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
function FaqPage() {
  return (
    <div className=''>
        <div className="flex flex-col space-y-3 mx-auto w-2/4 text-center my-5">
            <span className="text-black text-[40px] font-bold">Frequently Asked Questions</span>
            <div className="w-3/4 mx-auto">
            <span className="text-lightGray">
                These answers will guide you to understand better
                how our platform works
            </span>
            </div>
        </div>
        <div className='w-3/5 my-10 mx-auto'>
            <Accordion type="single" collapsible className="w-full">
                {
                    faqs.map((faq,index)=>(
                        <AccordionItem key={faq.id} value={`item-${index}`}>
                            <AccordionTrigger>{faq.title}</AccordionTrigger>
                            <AccordionContent>
                            {faq.desc}
                            </AccordionContent>
                        </AccordionItem>
                    ))
                }
            </Accordion>
        </div>
        <div className="my-10 w-2/5 mx-auto flex flex-col text-center space-y-3">
          <span className="text-darkBlue font-bold text-[36px]">Still have questions?</span>
          <span className="text-lightGray">
           If you cannot find answer to your question in our FAQ, you can always contact us. 
           We wil answer to you shortly!
          </span>
        </div>
        <div className="w-2/4 grid grid-cols-2 gap-x-5 mx-auto my-10">
            <div className="py-7 flex flex-col justify-center bg-white border-[2px] border-gray-200 rounded-md">
            <div className="w-[40px] mx-auto h-[40px] p-2 border-dashed border-[2px] border-lightBlue">
                <img 
                src={callIcon}
                className="w-full h-full"
                alt="call-image"
                />
            </div>
            <div className="flex justify-center text-center mt-5 flex-col space-y-2">
                <a href="tel:+243821123456" className="font-bold">+243 821 123 456</a>
                <span className="text-lightGray">We are always happy to help.</span>
            </div>
            </div>
            <div className="py-7 flex flex-col justify-center bg-white border-[2px] border-gray-200 rounded-md">
            <div className="w-[40px] mx-auto h-[40px] p-2 border-dashed border-[2px] border-lightBlue">
                <img 
                src={helpIcon}
                className="w-full h-full"
                alt="call-image"
                />
            </div>
            <div className="flex justify-center text-center mt-5 flex-col space-y-2">
                <a href="mailto:support@helpcenter.com" className="font-bold">support@helpcenter.com</a>
                <span className="text-lightGray">Alternative way to get anwser faster</span>
            </div>
            </div>
        </div>
    </div>
  )
}

export default FaqPage