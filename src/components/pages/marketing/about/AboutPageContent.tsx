"use client";

import { motion } from "framer-motion";

const AboutPageContent = () => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-14 px-5 pb-10 pt-12 lg:px-10">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-bg-accent rounded-3xl border border-border-subtle p-10 lg:p-14 text-center"
      >
        <p className="text-sm font-semibold text-accent">ABOUT CLOUDBOX</p>
        <h1 className="mt-4 text-4xl font-bold lg:text-5xl">
          Built to Enforce Subscription Logic,
          <br />
          Not Just Store Files
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-md leading-8 text-muted">
          CloudBox is designed as a modern SaaS storage platform where business
          rules live in package configuration. Admins can dynamically define
          limits, and users experience a clean file and folder workspace with
          policy-safe actions. Every feature is designed to give you complete
          control over your storage governance without writing a single line of
          business logic in the frontend.
        </p>
      </motion.section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          [
            "Mission",
            "Make policy-driven storage simple for every team",
            "We believe storage management should adapt to business rules, not the other way around. Our mission is to democratize enterprise-grade file governance for teams of all sizes.",
            "border-l-4 border-l-success",
          ],
          [
            "Vision",
            "Enable secure growth from free plan to enterprise",
            "Build a platform where startups can launch instantly and scale seamlessly to enterprise deployments without migrating infrastructure or rewriting policies.",
            "border-l-4 border-l-info",
          ],
          [
            "Approach",
            "Backend-first rule enforcement with intuitive frontend UX",
            "Keep all business logic server-side while delivering a beautiful, performant user experience. Validate fast, update instantly, scale effortlessly.",
            "border-l-4 border-l-purple",
          ],
        ].map((item, idx) => (
          <motion.div
            key={item[0]}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ scale: 1.03, y: -6 }}
            className={`rounded-2xl border border-border-subtle bg-surface p-8 ${item[3]} cursor-pointer`}
          >
            <h2 className="text-2xl font-bold text-app-text">{item[0]}</h2>
            <p className="mt-4 text-base leading-7 text-muted font-semibold">
              {item[1]}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted opacity-80">
              {item[2]}
            </p>
          </motion.div>
        ))}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-bg-purple rounded-3xl border border-border-subtle p-10 lg:p-12"
      >
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-purple">OUR JOURNEY</p>
          <h3 className="mt-3 text-4xl font-bold lg:text-5xl">
            Company Timeline
            <br />& Milestones
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted">
            From initial concept to production-ready platform, CloudBox has been
            shaped by real-world feedback from developers building SaaS file
            systems.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            [
              "2024",
              "Initial storage engine and package policy modeling",
              "Built the core file storage API with dynamic rule validation engine. Prototype tested with 5 early partners.",
              "success",
            ],
            [
              "2025",
              "User workspace and subscription lifecycle completed",
              "Shipped user dashboard, folder management UI, and complete subscription tier system with real-time updates.",
              "info",
            ],
            [
              "2026",
              "Admin analytics and billing-ready orchestration launched",
              "Released admin control panel with usage analytics, billing webhooks, and multi-tenant workspace isolation.",
              "purple",
            ],
            [
              "Next",
              "Deeper collaboration and compliance reporting modules",
              "Building team collaboration features, audit logs, GDPR compliance tools, and enterprise SSO integration.",
              "orange",
            ],
          ].map((milestone) => (
            <motion.div
              key={milestone[0]}
              whileHover={{ scale: 1.03, x: 4 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl border-2 border-border-subtle bg-surface-soft p-6 cursor-pointer"
            >
              <p className={`text-base font-bold text-${milestone[2]}`}>
                {milestone[0]}
              </p>
              <p className="mt-3 text-lg font-semibold text-app-text">
                {milestone[1]}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">
                {milestone[2]}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPageContent;
