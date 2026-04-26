"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { useState } from "react";

export default function ImageTabs() {
    const [activeTab, setActiveTab] = useState("capture");
    return (
        <section className="border-t border-gray-200 py-16">
          <div className="container max-w-[80%] mx-auto px-4 rounded-lg shadow-lg">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-row gap-4 justify-center mb-8">
                <Button 
                    onClick={() => setActiveTab("capture")}
                    className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors 
                        ${activeTab === "capture" ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}`}
                >
                    Capture tasks
                </Button>
                <Button 
                    onClick={() => setActiveTab("organize")}
                    className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors 
                        ${activeTab === "organize" ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}`}
                >
                    Organize work
                </Button>
                <Button 
                    onClick={() => setActiveTab("manage")}
                    className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors 
                        ${activeTab === "manage" ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}`}
                >
                    Manage boards
                </Button>
              </div>
              <div className="mx-auto max-w-5xl overflow-hidden rounded-lg">
                {activeTab === "capture" && (
                  <Image src="/favicon.ico" alt="Capture your tasks" width={1200} height={800}/>
                )}
                {activeTab === "organize" && (
                  <Image src="/favicon.ico" alt="Organize your tasks" width={1200} height={800}/>
                )}
                {activeTab === "manage" && (
                  <Image src="/favicon.ico" alt="Manage your tasks" width={1200} height={800}/>
                )}
              </div>
            </div>
          </div>
        </section>
    )
}