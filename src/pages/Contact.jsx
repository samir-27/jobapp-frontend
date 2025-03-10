const Contact = () => {
  return (
    <div   className="container mx-auto">
    <div   className="bg-white rounded-lg p-8 flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
     <div   className="w-full md:w-1/2">
      <img alt="A woman with a headset sitting at a desk with a laptop, taking notes"   className="rounded-lg" height="400" src="https://storage.googleapis.com/a1aa/image/aiEwr2fh247hRF3VjyDIL-EB0BTAi5BYOXxkmMKzx_I.jpg" width="600"/>
     </div>
     <div   className="w-full md:w-1/2">
      <h1   className="text-3xl font-bold mb-4">
       Contact us
      </h1>
      <p   className="text-gray-600 mb-6">
       We're here to understand your needs and provide tailored solutions. Reach out to our team to explore how we can support your goals and address any questions you may have.
      </p>
      <form   className="space-y-4">
       <div   className="flex flex-col space-y-4">
        <input   className="border border-gray-300 rounded-lg p-2 w-full" placeholder="Name" type="text"/>
        <div   className="flex space-x-4">
         <input   className="border border-gray-300 rounded-lg p-2 w-full" placeholder="Email address" type="email"/>
         <input   className="border border-gray-300 rounded-lg p-2 w-full" placeholder="Phone no" type="tel"/>
        </div>
        <textarea   className="border border-gray-300 rounded-lg p-2 w-full h-32" placeholder="Message"></textarea>
       </div>
       <button   className="bg-black text-white rounded-lg px-4 py-2" type="submit">
        Submit
       </button>
      </form>
     </div>
    </div>
   </div>
  )
}

export default Contact
