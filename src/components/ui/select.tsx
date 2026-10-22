import * as React from "react";
import { cn } from "@/lib/utils";
const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...props }, ref) => <select ref={ref} className={cn("field-input field-select", className)} {...props} />);
Select.displayName = "Select";
export { Select };
