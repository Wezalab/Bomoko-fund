import { useForm } from "react-hook-form"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import callIcon from '../assets/callIcon.png'
import helpIcon from '../assets/helpIcon.png'
import { useState } from "react"
import sendEmail from "@/lib/sendemail"
import LoadingComponent from "./LoadingComponent"
import toast from "react-hot-toast"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "@/lib/TranslationContext"

const formSchema=z.object({
  name:z.string().min(3,"Name must contain at least 3 characters"),
  email:z.string().email("Enter a valid Email address"),
  message:z.string().min(3,"Message must have at least 3 characters!")
}).required()

type FormData=z.infer<typeof formSchema>

function ContactPage() {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit:formSubmission,
    formState:{errors}
  }=useForm<FormData>({
    resolver:zodResolver(formSchema)
  })
  const [loading,setLoading]=useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      await sendEmail(formData.name, formData.email, formData.message);
      setLoading(false)
      toast.success(t("Email sent successfully!"));
      setFormData({
        name:"",
        email:"",
        message:""
      })
    } catch {
      setLoading(false)
      toast.error(t("Failed to send email. Please try again."));
    }
  };

  return (
    <div className="">
      <div className="flex flex-col space-y-3 mx-auto w-[90%] md:w-3.5/4 lg:w-2/4 text-center my-5">
        <span className="text-black text-[28px] md:text-[40px] font-bold">{t("Contact us")}</span>
        <div className="w-full text-center md:w-3/4 mx-auto">
          <span className="text-lightGray">
            {t("If you need our help, have questions about how to use the platform or are experiencing technical difficulties, please do not hesitate to contact us.")}
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-5 lg:p-10 w-[95%] md:w-3/4 lg:w-2/4 mx-auto my-5 bg-white shadow-md rounded-md">
        <div className="w-full">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="flex flex-col space-y-1">
              <label className="font-semibold">{t("Full Names")}</label>
              <div className="relative">
                <Input 
                  value={formData.name}
                  name="name"
                  onChange={handleChange}
                  className="py-4 h-12 rounded-xl indent-2 text-black lg:text-md"
                  placeholder={t("Full Names")}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-semibold">{t("Email Address")}</label>
              <div className="relative">
                <Input 
                  type="email"
                  value={formData.email}
                  name="email"
                  onChange={handleChange}
                  className="py-4 h-12 rounded-xl indent-2 text-black lg:text-md"
                  placeholder={t("Email Address")}
                />
              </div>
            </div>
          </div>
          <div className="grid w-full gap-2 mt-10">
            <Label htmlFor="message">{t("Type something")}</Label>
            <Textarea name="message" value={formData.message} onChange={handleChange} rows={5} placeholder={t("Support 230 children to get school fees")} id="message" />
          </div>
          <div className="my-5">
            <span className="text-lightGray font-semibold">
              {t("By submitting this form you agree to our terms and conditions and our Privacy Policy which explains how we may collect, use and disclose your personal information including to third parties.")}
            </span>
          </div>
          <Button
            disabled={loading}
            type="submit"
            className="p-5 max-w-fit rounded-2xl bg-darkBlue text-white"
          >
            {loading ? <LoadingComponent /> : t("Submit")}
          </Button>
        </div>
      </form>
      <div className="my-10 w-[90%] md:w-3/4 lg:w-2/5 mx-auto flex flex-col text-center space-y-3">
        <span className="text-darkBlue font-bold text-[28px] md:text-[36px]">{t("Still have questions?")}</span>
        <span className="text-lightGray">
          {t("If you cannot find answer to your question in our FAQ, you can always contact us. We wil answer to you shortly!")}
        </span>
      </div>
      <div className="w-3/4 lg:w-2/4 grid md:grid-cols-2 gap-5 mx-auto my-10">
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
                  <span className="text-lightGray">{t("We are always happy to help.")}</span>
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
                  <span className="text-lightGray">{t("Alternative way to get anwser faster")}</span>
              </div>
          </div>
      </div>
    </div>
  )
}

export default ContactPage