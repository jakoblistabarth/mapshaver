import { PropsWithChildren } from "react";

export default function Math({ children }: PropsWithChildren) {
  return (
    <span className="font-mono text-blue-600 [&_sub]:font-medium [&_sup]:font-medium">
      {children}
    </span>
  );
}
