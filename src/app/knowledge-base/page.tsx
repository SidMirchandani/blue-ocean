
import KnowledgeBaseComponent from "./knowledge-base-component";
import { Suspense } from "react";

export default function KnowledgeBasePage() {
    return(
        <Suspense>
            <KnowledgeBaseComponent />
        </Suspense>
    )
}
