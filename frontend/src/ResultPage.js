import ATSResults from "./ATSResults";

export default function ResultPage({
  result,
  onBack,
  onCareerQA,
  onApplyJobs
}) {
  return (
    <ATSResults
      data={result}
      onBack={onBack}
      onCareerQA={onCareerQA}
      onApplyJobs={onApplyJobs}
    />
  );
}
