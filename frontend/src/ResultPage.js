import ATSResults from "./ATSResults";

export default function ResultPage({ result, onBack, onCareerQA }) {
  return (
    <ATSResults
      data={result}
      onBack={onBack}
      onCareerQA={onCareerQA}   // ✅ pass it down
    />
  );
}
