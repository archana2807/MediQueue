"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import HospitalChat from "./hospital-chat";

export default function ChatWidget() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
  size="icon"
  className="
    fixed
    bottom-6
    right-6
    z-50
    h-14
    w-14
    rounded-full
    shadow-lg
  "
>
  <MessageCircle className="h-6 w-6" />
</Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="
          w-full
          sm:w-[450px]
          p-0
        "
      >
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle>
            MediQueue AI Assistant
          </SheetTitle>
        </SheetHeader>

        <div className="h-[calc(100vh-70px)]">
          <HospitalChat />
        </div>
      </SheetContent>
    </Sheet>
  );
}