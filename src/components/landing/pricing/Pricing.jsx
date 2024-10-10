import React from "react";
import { pricingPlans } from "@/_constants/landing/pricingPlans";

export function Pricing() {
  return (
    <section id="landingPricing" className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            Subscription models designed for your business
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Here at Uplift, we focus on markets where technology, innovation,
            and capital unlock long-term value and drive economic growth, with
            accessible pricing options to fit your budget.
          </p>
        </div>

        <div className="mt-20 flex flex-wrap justify-center gap-8">
        {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              badge={plan.badge}
              color={plan.color}
              price={plan.price}
              unit={plan.unit}  // Ensure unit is passed correctly
              description={plan.description}
              features={plan.includes}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ name, badge, price, color, description, features, unit }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)] max-w-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
          <span className={`px-3 py-1 text-xs font-semibold text-black-800 rounded-full ${color}`}>
            {badge}
          </span>
        </div>
        <p className="mb-4">
          <span className="text-3xl font-extrabold text-gray-900">₹{price}</span>
          <span className="text-base font-medium text-gray-500">&nbsp;/{unit}</span>
        </p>
        <p className="text-sm text-gray-500 mb-6">{description}</p>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="ml-3 text-sm text-gray-500">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}