import {SeedResultsContainer} from "../../../modules/ImmolateWrapper/CardEngines/Cards.ts";
import {CardEngineWrapper} from "../../../modules/ImmolateWrapper";

export default function Index({ seedResults } : { seedResults: SeedResultsContainer }) {
    const text = CardEngineWrapper.printAnalysis(seedResults);
    return (
        <pre>
            {text}
        </pre>
    );
}