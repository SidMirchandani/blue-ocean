
import EmergencyFinderComponent from "./emergency-finder-component";
import { Suspense } from "react";

export default function EmergencyFinderPage() {
    return(
        <Suspense>
            <EmergencyFinderComponent />
        </Suspense>
    )
}
