import React from "react";
import {CardEngineWrapper} from "../../../modules/ImmolateWrapper";
import {useSeedResultsContainer} from "../../../modules/state/analysisResultProvider.tsx";

export default function Index() {
    const seedResults = useSeedResultsContainer();
    if(!seedResults) {
        return <div>No Results</div>;
    }
    const text = CardEngineWrapper.printAnalysis(seedResults);
    return (
        <pre>
            {text}
        </pre>
    );
}
