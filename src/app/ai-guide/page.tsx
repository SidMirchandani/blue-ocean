
import AIGuideComponent from "./ai-guide-component";
import { Suspense } from "react";

export default function AIGuidePage() {
    return(
        <Suspense>
            <AIGuideComponent />
        </Suspense>
    )
}
