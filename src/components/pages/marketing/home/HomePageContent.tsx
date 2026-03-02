"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MarketingButton from "../MarketingButton";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: "easeOut" },
} as const;

const packages = [
  { name: "Free", folders: "20", fileSize: "10MB", depth: "2 Levels" },
  { name: "Silver", folders: "200", fileSize: "50MB", depth: "5 Levels" },
  { name: "Gold", folders: "1000", fileSize: "250MB", depth: "10 Levels" },
  {
    name: "Diamond",
    folders: "Unlimited*",
    fileSize: "1GB",
    depth: "20 Levels",
  },
];

const HomePageContent = () => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-16 px-5 pb-10 pt-10 lg:px-10">
      {/* Section 1: Hero */}
      <motion.section
        {...fadeUp}
        className="brand-gradient rounded-3xl border border-border-subtle p-10 lg:p-16"
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-border-subtle bg-surface px-4 py-2 text-sm font-semibold text-primary">
              Subscription-Driven File Intelligence
            </p>
            <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
              Manage files like Google Drive,
              <br />
              <span className="text-primary">
                enforce limits like enterprise SaaS.
              </span>
            </h1>
            <p className="max-w-xl text-md leading-8 text-muted">
              CloudBox lets admins define Free, Silver, Gold, and Diamond plans
              dynamically, then enforces folder depth, file types, upload size,
              and quota rules on every action. No hardcoded limits—everything is
              policy-driven from a centralized admin dashboard that updates in
              real-time.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/auth/register">
                <MarketingButton>Start Free</MarketingButton>
              </Link>
              <Link href="/pricing">
                <MarketingButton variant="outline">
                  Explore Pricing
                </MarketingButton>
              </Link>
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            whileHover={{ scale: 1.02 }}
            className="brand-glass rounded-2xl p-6 cursor-pointer"
          >
            <div className="brand-grid rounded-2xl border border-border-subtle bg-surface p-8">
              <div className="mb-5 h-6 w-40 rounded-full bg-surface-strong" />
              <div className="space-y-4">
                <div className="h-14 rounded-xl bg-surface-soft" />
                <div className="h-14 rounded-xl bg-surface-soft" />
                <div className="h-14 rounded-xl bg-surface-soft" />
              </div>
              <p className="mt-5 text-sm text-muted">
                Dashboard preview placeholder
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 2: Core Features */}
      <motion.section
        {...fadeUp}
        className="section-bg-success rounded-3xl border border-border-subtle p-10 lg:p-12"
      >
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-success">CORE FEATURES</p>
          <h2 className="mt-3 text-4xl font-bold lg:text-5xl">
            Four Pillars of
            <br />
            Policy-Driven Storage
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted">
            Every file operation in CloudBox runs through a powerful validation
            engine that checks your current subscription plan before allowing
            any action to proceed.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Policy checks",
              "Every upload validated against active package",
              "Real-time validation means users never hit unexpected errors after uploads complete.",
              "border-l-4 border-l-success",
            ],
            [
              "Storage actions",
              "Create / move / copy / rename flow with limits",
              "All CRUD operations respect folder depth, file type, and size constraints instantly.",
              "border-l-4 border-l-info",
            ],
            [
              "Package updates",
              "Rules update instantly for future actions",
              "Admin changes propagate immediately—no caching delays or manual refreshes required.",
              "border-l-4 border-l-purple",
            ],
            [
              "Admin control",
              "No hardcoded business limits in frontend",
              "Business logic lives in the backend, giving admins full control over all restrictions.",
              "border-l-4 border-l-orange",
            ],
          ].map((item) => (
            <motion.div
              key={item[0]}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl border border-border-subtle bg-surface p-6 ${item[3]} cursor-pointer`}
            >
              <h3 className="text-lg font-semibold text-app-text">{item[0]}</h3>
              <p className="mt-3 text-base leading-7 text-muted">{item[1]}</p>
              <p className="mt-2 text-sm leading-6 text-muted opacity-80">
                {item[2]}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Section 3: Subscription Tiers */}
      <motion.section
        {...fadeUp}
        className="section-bg-primary rounded-3xl border border-border-subtle p-10 lg:p-12"
      >
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              SUBSCRIPTION TIERS
            </p>
            <h2 className="mt-3 text-4xl font-bold lg:text-5xl">
              Tiered Package
              <br />
              Control Matrix
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              From hobby projects to enterprise deployments, every tier comes
              with precisely defined limits that scale with your team&apos;s
              needs.
            </p>
          </div>
          <Link href="/pricing">
            <MarketingButton variant="secondary">Compare plans</MarketingButton>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((item, index) => {
            const colors = [
              "border-accent bg-surface",
              "border-info bg-surface",
              "border-primary bg-surface-soft",
              "border-purple bg-surface",
            ];
            return (
              <motion.div
                key={item.name}
                whileHover={{ y: -8, scale: 1.05, rotate: 1 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl border-2 p-7 ${colors[index]} cursor-pointer`}
              >
                <p className="text-2xl font-bold text-app-text">{item.name}</p>
                <div className="mt-5 space-y-3 text-base text-muted">
                  <p>
                    <strong>Max folders:</strong> {item.folders}
                  </p>
                  <p>
                    <strong>Max file size:</strong> {item.fileSize}
                  </p>
                  <p>
                    <strong>Nesting:</strong> {item.depth}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Section 4 & 5: Folder Structure & Rule Engine */}
      <motion.section {...fadeUp} className="grid gap-8 lg:grid-cols-2">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="section-bg-purple rounded-2xl border border-border-subtle p-8 cursor-pointer"
        >
          <p className="text-sm font-semibold text-purple">FOLDER HIERARCHY</p>
          <h3 className="mt-3 text-3xl font-bold lg:text-4xl">
            Deep Folder Structure
            <br />
            Simulation
          </h3>
          <p className="mt-4 text-base leading-8 text-muted">
            Visualize how users build nested folders under package constraints.
            Max nesting level blocks new sub-folder creation once threshold is
            reached. This prevents infinite recursion and keeps storage
            organized.
          </p>
          <div className="mt-6 space-y-3 rounded-2xl border border-border-subtle bg-surface-soft p-5 text-base text-app-text">
            <p>📁 Product Assets</p>
            <p className="pl-5">┗ 📁 Q1 Campaign</p>
            <p className="pl-10">┗ 📁 Landing Visuals</p>
            <p className="pl-16 text-lg font-semibold text-warning">
              ┗ ⚠️ Max depth reached on current plan
            </p>
          </div>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="section-bg-orange rounded-2xl border border-border-subtle p-8 cursor-pointer"
        >
          <p className="text-sm font-semibold text-orange">RULE ENGINE</p>
          <h3 className="mt-3 text-3xl font-bold lg:text-4xl">
            Real-Time Package
            <br />
            Rule Engine States
          </h3>
          <p className="mt-4 text-base leading-8 text-muted">
            Each rule is evaluated on the server before any file operation
            completes. These constraints are dynamically fetched from the
            user&apos;s active subscription.
          </p>
          <div className="mt-6 space-y-4">
            {[
              ["Allowed File Types", "Image, Video, Audio, PDF"],
              ["File Size Validation", "250MB per file maximum"],
              ["Total File Limit", "10,000 files per workspace"],
              ["Files Per Folder", "1,000 file cap per folder"],
            ].map((item) => (
              <motion.div
                key={item[0]}
                whileHover={{ x: 6, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-border-subtle bg-surface-soft px-5 py-4 cursor-pointer"
              >
                <p className="text-base font-semibold text-app-text">
                  {item[0]}
                </p>
                <p className="mt-1 text-sm text-muted">{item[1]}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Section 6: Lifecycle Workflow */}
      <motion.section
        {...fadeUp}
        className="section-bg-info rounded-3xl border border-border-subtle p-10 lg:p-12"
      >
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-info">WORKFLOW</p>
          <h3 className="mt-3 text-4xl font-bold lg:text-5xl">
            Admin-to-User
            <br />
            Lifecycle Workflow
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted">
            From package creation to usage tracking, CloudBox orchestrates a
            complete subscription lifecycle that keeps admins in control and
            users informed.
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          {[
            [
              "Admin creates package rules",
              "Administrators define all business rules in a central dashboard",
              "success",
            ],
            [
              "User selects / upgrades plan",
              "Users choose their tier and get instant access to new limits",
              "info",
            ],
            [
              "Actions are validated per request",
              "Every file operation checks permissions before executing",
              "purple",
            ],
            [
              "Usage and billing are tracked",
              "Real-time metrics feed into your billing and analytics pipeline",
              "orange",
            ],
          ].map((item, index) => (
            <motion.div
              key={item[0]}
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl border-2 border-border-subtle bg-surface-soft p-6 border-t-4 border-t-${item[2]} cursor-pointer`}
            >
              <p className={`text-sm font-semibold text-${item[2]}`}>
                Step {index + 1}
              </p>
              <p className="mt-3 text-lg font-bold leading-7 text-app-text">
                {item[0]}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted">{item[1]}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Section 7: CTA */}
      <motion.section
        {...fadeUp}
        className="section-bg-accent rounded-3xl border border-border-subtle p-12 lg:p-16 text-center"
      >
        <p className="text-sm font-semibold text-accent">GET STARTED</p>
        <h3 className="mt-4 text-5xl font-bold lg:text-6xl">
          Start Building Your
          <br />
          Governed Storage Workspace
        </h3>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted">
          Move beyond simple upload UIs and deliver true SaaS behavior. Build an
          admin-controlled, package-driven file platform where every user action
          respects business policies without hardcoding. Join thousands of
          developers who trust CloudBox for enterprise-grade file management.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/auth/register">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <MarketingButton>Launch CloudBox</MarketingButton>
            </motion.div>
          </Link>
          <Link href="/contact">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <MarketingButton variant="outline">Talk to Sales</MarketingButton>
            </motion.div>
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePageContent;
