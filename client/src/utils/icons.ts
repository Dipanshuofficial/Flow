// icons.js
import {
  Cpu,
  Type,
  LogIn,
  LogOut,
  Split,
  Clock,
  GitMerge,
  RefreshCw,
  DatabaseIcon,
  type LucideIcon,
} from "lucide-react";

export const IconMap: Record<string, LucideIcon> = {
  llm: Cpu,
  text: Type,
  customInput: LogIn,
  customOutput: LogOut,
  condition: Split,
  delay: Clock,
  merge: GitMerge,
  loop: RefreshCw,
  dataLog: DatabaseIcon,
};
