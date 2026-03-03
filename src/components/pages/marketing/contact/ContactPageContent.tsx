"use client";

import { motion } from "framer-motion";
import { MapPin, Globe, Navigation, Compass } from "lucide-react";
import MarketingButton from "../MarketingButton";
import MarketingInput from "../MarketingInput";

const ContactPageContent = () => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-12 px-5 pb-10 pt-12 lg:px-10">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-bg-orange rounded-3xl border border-border-subtle p-10 lg:p-14 text-center"
      >
        <p className="text-sm font-semibold text-orange">CONTACT US</p>
        <h1 className="mt-4 text-4xl font-bold lg:text-5xl">
          Let&apos;s Discuss Your
          <br />
          Storage Governance Needs
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted">
          Tell us your team size, expected storage usage, and policy
          requirements. We&apos;ll propose the right package strategy and help
          you design a governance model that scales with your business without
          vendor lock-in.
        </p>
      </motion.section>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.form
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.01 }}
          className="space-y-5 section-bg-info rounded-3xl border border-border-subtle p-8 lg:p-10"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-app-text">
              Send us a message
            </h2>
            <p className="mt-2 text-sm text-muted">
              Fill out the form below and we&apos;ll get back to you within 24
              hours.
            </p>
          </div>
          <MarketingInput label="Full Name" placeholder="Enter your name" />
          <MarketingInput
            label="Work Email"
            type="email"
            placeholder="you@company.com"
          />
          <MarketingInput label="Company" placeholder="Company name" />
          <MarketingInput label="Phone" placeholder="+8801XXXXXXXXX" />
          <div className="space-y-3">
            <label
              htmlFor="message"
              className="block text-base font-semibold text-app-text"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-base text-app-text outline-none transition-all duration-300 placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-ring-brand"
              placeholder="Share your use case"
            />
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <MarketingButton className="w-full">Send Message</MarketingButton>
          </motion.div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <motion.div
            whileHover={{ scale: 1.02, x: 4 }}
            className="rounded-2xl border-2 border-border-subtle bg-surface p-7 border-l-4 border-l-success cursor-pointer"
          >
            <p className="text-lg font-bold text-success">📍 Office Location</p>
            <p className="mt-3 text-base text-app-text font-semibold">
              Dhaka, Bangladesh
            </p>
            <p className="mt-2 text-sm text-muted">
              Remote-first team with global presence
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, x: 4 }}
            className="rounded-2xl border-2 border-border-subtle bg-surface p-7 border-l-4 border-l-info cursor-pointer"
          >
            <p className="text-lg font-bold text-info">🕐 Support Hours</p>
            <p className="mt-3 text-base text-app-text font-semibold">
              Sun - Thu, 9:00 AM - 6:00 PM (GMT+6)
            </p>
            <p className="mt-2 text-sm text-muted">
              24/7 emergency support for enterprise plans
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, x: 4 }}
            className="rounded-2xl border-2 border-border-subtle bg-surface p-7 border-l-4 border-l-purple cursor-pointer"
          >
            <p className="text-lg font-bold text-purple">🌍 Global Presence</p>
            <div className="mt-4 h-52 rounded-xl border border-border-subtle brand-grid bg-surface-soft flex items-center justify-center overflow-hidden relative p-4">
              {/* Animated background */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-10"
              >
                <div
                  className="absolute inset-0 rounded-full border border-primary"
                  style={{ width: "80%", height: "80%", margin: "auto" }}
                />
                <div
                  className="absolute inset-0 rounded-full border border-accent"
                  style={{ width: "60%", height: "60%", margin: "auto" }}
                />
                <div
                  className="absolute inset-0 rounded-full border border-success"
                  style={{ width: "40%", height: "40%", margin: "auto" }}
                />
              </motion.div>

              {/* Interactive location markers */}
              <div className="relative w-full h-full flex items-center justify-center">
                {[
                  {
                    Icon: MapPin,
                    color: "text-primary",
                    pos: "top-4 left-4",
                    delay: 0,
                  },
                  {
                    Icon: Globe,
                    color: "text-accent",
                    pos: "top-4 right-4",
                    delay: 0.2,
                  },
                  {
                    Icon: Navigation,
                    color: "text-success",
                    pos: "bottom-4 left-4",
                    delay: 0.4,
                  },
                  {
                    Icon: Compass,
                    color: "text-orange",
                    pos: "bottom-4 right-4",
                    delay: 0.6,
                  },
                ].map(({ Icon, color, pos, delay }) => (
                  <motion.div
                    key={color}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay, duration: 0.4 }}
                    whileHover={{ scale: 1.4, y: -4 }}
                    className={`absolute ${pos} cursor-pointer z-10`}
                  >
                    <Icon
                      size={32}
                      className={`${color} opacity-70 hover:opacity-100 transition-opacity`}
                    />
                  </motion.div>
                ))}

                {/* Center pulse */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative z-10"
                >
                  <Globe size={40} className="text-info opacity-60" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPageContent;
