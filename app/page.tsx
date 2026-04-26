import ImageTabs from "@/components/image-tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">
        {/* Hero section */}
        <section className="container mx-auto px-4 py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-bold text-black text-6xl mb-6">
              Don&apos;t let your tasks pile up
            </h1>
            <p className="text-lg text-gray-700 mb-10">
              Manage, track, and organize your tasks with ease.
            </p>
            <div className="flex flex-col gap-4 items-center">
              <Link href="/sign-up">
                <Button size="lg" className="text-lg px-4 h-12 font-medium">
                  Get Started 
                  <ArrowRight />
                </Button>
              </Link>
              <p className="text-sm text-gray-500">Free forever, not charge required</p>
            </div>
          </div>
        </section>
        {/* Image Tabs Section */}
        <ImageTabs />
      </main>
    </div>
  );
}
