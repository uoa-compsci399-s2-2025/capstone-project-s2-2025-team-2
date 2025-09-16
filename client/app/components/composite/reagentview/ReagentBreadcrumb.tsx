interface ReagentBreadcrumbProps {
  reagentName: string
}
const ReagentBreadcrumb = ({ reagentName }: ReagentBreadcrumbProps) => {
  return (
    <div>
      <h5
        className="
        font-bold text-[0.8rem]
        text-blue-400
      "
      >
        Reagents / Listings / {reagentName}
      </h5>
    </div>
  )
}

export default ReagentBreadcrumb
