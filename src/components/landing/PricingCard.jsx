export default function PricingCard({
  name,
  bedge,
  price,
  description,
  includes,
}) {
  return (
    <div className="flex flex-col max-w-lg p-6 mx-auto text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow ">
      <span className="bg-blue-200 -mt-4 w-fit text-blue-600 text-xs font-medium  px-2.5 py-0.5 rounded-full ">
        {bedge}
      </span>
      <h3 className="mb-4 text-2xl font-semibold">{name}</h3>
      <p className="font-light text-gray-500 sm:text-lg ">{description}</p>
      <div className="flex items-baseline justify-center my-8">
        <span className="mr-2 text-5xl font-extrabold">${price}</span>
        <span className="text-gray-500 ">/month</span>
      </div>

      <ul role="list" className="mb-8 space-y-4 text-left">
        {includes.map((include) => (
          <li key={include} className="flex items-center space-x-3">
            <svg
              className="flex-shrink-0 w-5 h-5 text-green-500 "
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span>{include}</span>
          </li>
        ))}
      </ul>
      <a
        href="#"
        className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
      >
        Get started
      </a>
    </div>
  );
}
