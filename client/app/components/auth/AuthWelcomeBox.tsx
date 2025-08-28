import OutlinedButton from "../generic/button/outlined/OutlinedButton"

export default function AuthWelcomeBox() {
  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-gradient-to-b from-blue-primary to-blue-primary/20 rounded-lg shadow-lg flex flex-col justify-center transition-all">
      {/* Welcome Content */}
      <div className="text-center">
        <h2 className="mb-2 text-white/40">Welcome to</h2>
        <h1 className="text-white mb-6">Chemical.ly</h1>
        <p className="mb-8 text-white/70">
          Join Chemical.ly today and be part of a growing community that shares,
          reuses, and collaborates on research reagents.
        </p>
        {/* Call to Action Button */}
        <OutlinedButton
          label="SIGN UP"
          size="small"
          backgroundColor="white"
          className="border-white text-white hover:bg-white/30 duration-300"
        />
      </div>
    </div>
  )
}
