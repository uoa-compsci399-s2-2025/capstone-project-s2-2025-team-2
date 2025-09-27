interface ReagentBreadcrumbProps {
  reagentName: string
}
const ReagentBreadcrumb = ({ reagentName }: ReagentBreadcrumbProps) => {
  return (
    <div>
      <h5
        className="
        font-bold
        text-blue-primary
      "
      >
        Reagents / {reagentName}
      </h5>
    </div>
  )
}

export default ReagentBreadcrumb
