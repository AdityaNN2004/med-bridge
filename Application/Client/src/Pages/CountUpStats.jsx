import React, { useRef, useEffect } from "react";
import { animate, useInView } from "framer-motion";

export const CountUpStats = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <Stat num={45} suffix="%" subheading="Total Donations Increased" />
        <Stat num={15.5} decimals={1} suffix="K+" subheading="Requests Processed" />
        <Stat num={20} suffix="B+" subheading="Medicines Distributed" />
      </div>
    </div>
  );
};

const Stat = ({ num, suffix, decimals = 0, subheading }) => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (!isInView) return;
    animate(0, num, {
      duration: 2,
      onUpdate(value) {
        if (!ref.current) return;
        ref.current.textContent = value.toFixed(decimals);
      },
    });
  }, [num, decimals, isInView]);

  return (
    <div className="flex-1 flex flex-col items-center py-4 sm:py-0">
      <p className="text-4xl sm:text-5xl font-semibold text-gray-900">
        <span ref={ref}></span>{suffix}
      </p>
      <p className="text-center text-gray-600 text-sm mt-1">{subheading}</p>
    </div>
  );
};
