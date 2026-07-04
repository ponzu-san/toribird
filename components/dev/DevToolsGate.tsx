import { isDevToolsEnabled } from "@/lib/dev/isDevToolsEnabled";
import DevAccessPanel from "@/components/dev/DevAccessPanel";

export default function DevToolsGate() {
  if (!isDevToolsEnabled()) {
    return null;
  }

  return <DevAccessPanel />;
}
