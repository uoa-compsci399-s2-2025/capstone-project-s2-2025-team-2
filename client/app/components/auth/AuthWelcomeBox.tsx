import OutlinedButton from "../generic/button/outlined/OutlinedButton"

export default function AuthWelcomeBox() {
  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-gradient-to-b from-blue-400 to-purple-600 rounded-lg shadow-lg flex flex-col justify-center">
      {/* Welcome Content */}
      <div className="text-center">
        <h2 className="mb-2">
          Welcome to
        </h2>
        <h1 className="text-orange-400 mb-6">
          Chemical.ly
        </h1>
        <p className="mb-8">
          Join Chemical.ly today and be part of a growing community that shares, reuses, and collaborates on research reagents.
        </p>
        {/* Call to Action Button */}
        <OutlinedButton
          label="Sign Up"
          size="medium"
        />
      </div>
    </div>
  )
}
