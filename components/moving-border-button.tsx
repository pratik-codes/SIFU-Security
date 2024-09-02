"use client";

import React from "react";
import { Button } from "./moving-border";

export function MovingBorderButton(props: any) {
  return (
    <div>
      <Button
        {...props}
        borderRadius="1.75rem"
        className="bg-glass-black text-black dark:text-white border-neutral-200 dark:border-slate-800"
      >
      {props.children}
      </Button>
    </div>
  );
}

