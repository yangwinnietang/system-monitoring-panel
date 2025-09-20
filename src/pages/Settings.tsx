import React from 'react'

const Settings: React.FC = () => {
  return (
    <div className="flex-1 p-lg">
      <h1 className="text-2xl font-bold mb-lg">Settings</h1>
      <div className="bg-secondary p-lg border-radius">
        <h2 className="text-lg font-semibold mb-md">System Settings</h2>
        <p className="text-muted">Configure system monitoring settings</p>
      </div>
    </div>
  )
}

export default Settings