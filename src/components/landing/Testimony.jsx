import { testimonials } from "@/_constants/landing/testimonials";
import { Carousel } from "flowbite-react";
import Image from "next/image";

export function Testimony() {
  return (
    <div id="landingTestimony" className="h-96">
      <h2 className="my-2 text-3xl font-extrabold leading-tight tracking-tight text-center text-gray-900 lg:mb-10 md:text-4xl">
        Testimony
      </h2>
      <Carousel>
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial?.company}
            className="max-w-screen-md mx-auto text-center"
          >
            <svg
              className="w-10 h-10 mx-auto mb-3 text-gray-400 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 14"
            >
              <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
            </svg>
            <blockquote>
              <p className="text-lg italic font-medium text-gray-900 md:text-2xl dark:text-white">
                {testimonial?.quote}
              </p>
            </blockquote>
            <figcaption className="flex items-center justify-center mt-6 space-x-3 rtl:space-x-reverse">
              <Image
                className="w-6 h-6 rounded-full"
                src={testimonial?.img}
                alt="profile picture"
                height={24}
                width={24}
              />
              <div className="flex items-center divide-x-2 divide-gray-500 rtl:divide-x-reverse dark:divide-gray-700">
                <cite className="font-medium text-gray-900 pe-3 dark:text-white">
                  {testimonial?.author}
                </cite>
                <cite className="text-sm text-gray-500 ps-3 dark:text-gray-400">
                  {testimonial?.company}
                </cite>
              </div>
            </figcaption>
          </figure>
        ))}
      </Carousel>
    </div>
  );
}
