
import HomeComponent from "./home-component";
import { Suspense } from "react";

export default function DashboardPage() {
    return(
        <Suspense>
            <HomeComponent />
        </Suspense>
    )
}
