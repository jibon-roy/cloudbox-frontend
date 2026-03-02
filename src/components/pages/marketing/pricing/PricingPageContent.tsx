"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MarketingButton from "../MarketingButton";

const plans = [
  {
    name: "Free",
    desc: "Best for trying the platform",
    price: "$0/mo",
    features: [
      "20 folders",
      "10MB file size",
      "2 levels nesting",
      "Image + PDF",
    ],
  },
  {
    name: "Silver",
    desc: "Great for individual professionals",
    price: "$9/mo",
    features: [
      "200 folders",
      "50MB file size",
      "5 levels nesting",
      "Image/Video/PDF/Audio",
    ],
  },
  {
    name: "Gold",
    desc: "For teams with heavy workflows",
    price: "$19/mo",
    featured: true,
    features: [
      "1000 folders",
      "250MB file size",
      "10 levels nesting",
      "Higher account limits",
    ],
  },
  {
    name: "Diamond",
    desc: "Enterprise scale and governance",
    price: "$49/mo",
    features: [
      "Advanced quota control",
      "1GB file size",
      "20 levels nesting",
      "Priority support",
    ],
  },
];

const PricingPageContent = () => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-14 px-5 pb-10 pt-12 lg:px-10">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-bg-primary rounded-3xl border border-border-subtle p-10 lg:p-14 text-center"
      >
        <p className="text-sm font-semibold text-primary">FLEXIBLE PRICING</p>
        <h1 className="mt-4 text-4xl font-bold lg:text-5xl">
          Choose the Package that Fits
          <br />
          Your Storage Policy
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-md leading-8 text-muted">
          Admin can create and edit all package restrictions dynamically. These
          samples represent common tiers to help users understand available
          limits. Every plan is fully customizable from your admin dashboard
          with instant updates.
        </p>
      </motion.section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, index) => {
          const planColors = [
            { border: "border-accent", text: "text-accent" },
            { border: "border-info", text: "text-info" },
            { border: "border-primary", text: "text-primary" },
            { border: "border-purple", text: "text-purple" },
          ];
          const colorSet = planColors[index];

          return (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className={`rounded-2xl border-2 p-8 cursor-pointer ${
                plan.featured
                  ? `${colorSet.border} bg-surface-soft`
                  : `${colorSet.border} bg-surface`
              }`}
            >
              <h2 className="text-2xl font-bold text-app-text">{plan.name}</h2>
              <p className="mt-3 text-base text-muted">{plan.desc}</p>
              <p className={`mt-5 text-3xl font-bold ${colorSet.text}`}>
                {plan.price}
              </p>
              <ul className="mt-6 space-y-3 text-base text-app-text">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <div className="mt-7">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MarketingButton className="w-full">
                    Select {plan.name}
                  </MarketingButton>
                </motion.div>
              </div>
            </motion.article>
          );
        })}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-bg-info rounded-3xl border border-border-subtle p-10 lg:p-12"
      >
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-info">COMPARISON TABLE</p>
            <h3 className="mt-3 text-4xl font-bold lg:text-5xl">
              Detailed Policy
              <br />
              Comparison Matrix
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              Compare all the key limits and features across subscription tiers
              to find the perfect fit for your organization&apos;s needs.
            </p>
          </div>
          <Link href="/contact">
            <motion.div whileHover={{ scale: 1.05 }}>
              <MarketingButton variant="outline">
                Need custom plan?
              </MarketingButton>
            </motion.div>
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto rounded-2xl border border-border-subtle"
        >
          <table className="w-full min-w-175 border-collapse text-left text-base">
            <thead className="bg-surface-strong text-app-text">
              <tr>
                <th className="px-6 py-4 font-bold">Limit</th>
                <th className="px-6 py-4 font-bold">Free</th>
                <th className="px-6 py-4 font-bold">Silver</th>
                <th className="px-6 py-4 font-bold">Gold</th>
                <th className="px-6 py-4 font-bold">Diamond</th>
              </tr>
            </thead>
            <tbody className="bg-surface text-app-text">
              {[
                ["Max folders", "20", "200", "1000", "Unlimited*"],
                ["Nesting level", "2", "5", "10", "20"],
                ["Max file size", "10MB", "50MB", "250MB", "1GB"],
                ["Files per folder", "100", "300", "1000", "5000"],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-border-subtle">
                  {row.map((cell) => (
                    <td key={cell} className="px-6 py-4">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default PricingPageContent;
