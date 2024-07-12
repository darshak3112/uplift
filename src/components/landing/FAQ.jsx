import { upliftFaqs } from "@/_constants/landing/upliftFaqs";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";

export function FAQ() {
  return (
    <section id="landingFaq" className="mx-auto bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl px-4 py-8 mx-auto sm:py-16 lg:px-6">
        <h2 className="mb-8 text-3xl font-extrabold leading-tight tracking-tight text-center text-gray-900 lg:mb-16 dark:text-white md:text-4xl">
          Frequently asked questions
        </h2>
        <Accordion collapseAll className="max-w-[50rem] mx-auto" color="black">
          {upliftFaqs.map((upliftFaq) => (
            <AccordionPanel key={upliftFaq?.question} color="black">
              <AccordionTitle color="black">
                {upliftFaq.question}
              </AccordionTitle>
              <AccordionContent>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  {upliftFaq?.answer}
                </p>
              </AccordionContent>
            </AccordionPanel>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
