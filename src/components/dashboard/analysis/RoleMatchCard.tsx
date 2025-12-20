interface RoleMatchCardProps {
  roles: Array<{ name: string; percentage: number; color: string }>;
}

export function RoleMatchCard({ roles }: RoleMatchCardProps) {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      green: "text-green-500 bg-green-500",
      purple: "text-purple-500 bg-purple-500",
      orange: "text-orange-500 bg-orange-500",
      yellow: "text-primary bg-primary",
      red: "text-red-500 bg-red-500"
    };
    return colorMap[color] || "text-stone-500 bg-stone-500";
  };

  return (
    <div className="lg:col-span-4 glass-card rounded-lg p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-stone-900 dark:text-white">Role Match</h3>
      </div>
      <div className="flex flex-col gap-5 mt-2">
        {roles.map((role, idx) => {
          const colorClasses = getColorClasses(role.color);
          const [textColor, bgColor] = colorClasses.split(' ');
          
          return (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex justify-between text-sm font-medium text-stone-900 dark:text-stone-300">
                <span>{role.name}</span>
                <span className={textColor}>{role.percentage}%</span>
              </div>
              <div className="w-full h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${bgColor} rounded-r-full`} 
                  style={{ width: `${role.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}