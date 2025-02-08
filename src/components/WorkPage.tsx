import workImage1 from '../assets/workImage1.png'
import workImage2 from '../assets/workImage2.png'
import workImage3 from '../assets/workImage3.png'
import workImage4 from '../assets/workImage4.png'
import workImage5 from '../assets/workImage5.png'



function WorkPage() {
  return (
    <div className="">
      <div className="flex flex-col space-y-3 mx-auto w-2/4 text-center my-5">
        <span className="text-black text-[40px] font-bold">How it Works</span>
        <div className="w-2/4 mx-auto">
          <span className="text-lightGray">
            These steps will guide you through setting up your projects
            all the way to receiving your donations.
          </span>
        </div>
      </div>
      <div className="m-5 grid grid-cols-9 gap-x-5">
        <div className="col-span-4 flex flex-col space-y-5 ">
          <div className="h-[200px] flex justify-end">
            <img 
              src={workImage1}
              className='w-[205px]'
            />
          </div>
          <div className='h-[200px] flex flex-col space-y-2'>
            <div className='text-end'>
              <span className='text-[32px] font-semibold'>Submit your project</span>
            </div>
            <span className='text-lightGray text-[18px] font-semibold text-end'>
              After entering your project details, including the name, category, type, and target amount, submit it for review. 
              Our team will carefully assess the information to ensure it meets our guidelines. Once approved, 
              your project will be ready to start receiving donations.
            </span>
          </div>
          <div className="h-[200px] flex justify-end">
            <img 
              src={workImage3}
              className='w-[205px]'
            />
          </div>
          <div className='h-[200px] flex flex-col space-y-2'>
            <div className='text-end'>
              <span className='text-[32px] font-semibold'>Receive your donations</span>
            </div>
            <span className='text-lightGray text-[18px] font-semibold text-end'>
              You can receive donations through mobile money, credit/debit cards, 
              or even cryptocurrency. This offers flexibility for contributors to choose their preferred method.
            </span>
          </div>
          <div className="h-[200px] flex justify-end">
            <img 
              src={workImage5}
              className='w-[205px]'
            />
          </div>
        </div>
        <div className="col-span-1 flex flex-col space-y-5 justify-center">
          <div className='h-[200px] flex justify-center items-start'>
            <div className='h-[70px]  w-[70px] flex items-center justify-center bg-lightBlue rounded-full'>
              <span className='text-white font-bold text-[24px]'>1</span>
            </div>
          </div>
          <div className='h-[200px] flex justify-center'>
            <div className='h-[70px]  w-[70px] flex items-center justify-center bg-lightBlue rounded-full'>
              <span className='text-white font-bold text-[24px]'>2</span>
            </div>
          </div>
          <div className='h-[200px] flex justify-center'>
            <div className='h-[70px]  w-[70px] flex items-center justify-center bg-lightBlue rounded-full'>
              <span className='text-white font-bold text-[24px]'>3</span>
            </div>
          </div>
          <div className='h-[200px] flex justify-center'>
            <div className='h-[70px]  w-[70px] flex items-center justify-center bg-lightBlue rounded-full'>
              <span className='text-white font-bold text-[24px]'>4</span>
            </div>
          </div>
          <div className='h-[200px] flex justify-center items-end'>
            <div className='h-[70px]  w-[70px] flex items-center justify-center bg-lightBlue rounded-full'>
              <span className='text-white font-bold text-[24px]'>5</span>
            </div>
          </div>
          
        </div>
        <div className="col-span-4 flex flex-col space-y-5">
          <div className='h-[200px] flex flex-col space-y-2'>
            <div className='text-start'>
              <span className='text-[32px] font-semibold'>Provide your project information</span>
            </div>
            <span className='text-lightGray text-[18px] font-semibold text-start'>
              Gather key project details such as the project name, category, type, target donation amount, and other relevant information. 
              This will help define the scope and goals of your project, ensuring potential donors understand the purpose and objectives.
            </span>
          </div>
          <div className="h-[200px] flex justify-start">
            <img 
              src={workImage2}
              className='w-[205px]'
            />
          </div>
          <div className='h-[200px] flex flex-col space-y-2'>
            <div className='text-start'>
              <span className='text-[32px] font-semibold'>Project approval</span>
            </div>
            <span className='text-lightGray text-[18px] font-semibold text-start'>
              After our team approves your project, it will be made public, allowing you to start receiving donations.
            </span>
          </div>
          <div className="h-[200px] flex justify-start">
            <img 
              src={workImage4}
              className='w-[205px]'
            />
          </div>
          <div className='h-[200px] flex flex-col space-y-2'>
            <div className='text-start'>
              <span className='text-[32px] font-semibold'>Cash-out your donations</span>
            </div>
            <span className='text-lightGray text-[18px] font-semibold text-start'>
              You can easily cash out your donations whenever you need to, providing you with convenient access to your funds. 
              Our streamlined process ensures that withdrawing your donations is quick and hassle-free.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkPage