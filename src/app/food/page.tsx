import type { Metadata } from "next";
import { FoodLanding } from "@/components/landing/FoodLanding";

export const metadata: Metadata = {
  title: "Free food on campus · Ligo",
  description: "Club dinners, donuts, picnics, tea. Every campus event serving food, in one tab on Ligo.",
};

/** The food flyer's landing page (Oct 7). */
export default function FoodPage() {
  return <FoodLanding />;
}
