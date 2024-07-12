import { pricingPlans } from "@/_constants/landing/pricingPlans";
import PricingCard from "./PricingCard";

PricingCard;

export function Pricing() {
  return (
    <section id="landingPricing" className="bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
        <div className="max-w-screen-md mx-auto mb-8 text-center lg:mb-12">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Designed for business teams like yours
          </h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Here at Uplift, we focus on markets where technology, innovation,
            and capital unlock long-term value and drive economic growth, with
            accessible pricing options to fit your budget.
          </p>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan?.price} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
