import React from 'react';
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

const Dashboard = () => {
  const [recentRoasts] = React.useState([
    { id: 1, target: "John Doe", date: "2024-03-20", status: "Completed" },
    { id: 2, target: "Jane Smith", date: "2024-03-19", status: "Failed" },
    { id: 3, target: "Bob Johnson", date: "2024-03-18", status: "Completed" },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold gradient-text mb-6">Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-amber-500" />
            <div>
              <div className="text-2xl font-bold text-amber-500">
                {recentRoasts.length}
              </div>
              <div className="text-sm text-gray-400">Total Roasts</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-amber-500" />
            <div>
              <div className="text-2xl font-bold text-amber-500">
                {recentRoasts.filter(r => r.status === "Completed").length}
              </div>
              <div className="text-sm text-gray-400">Successful</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Roasts */}
      <div className="bg-gray-800 rounded-xl p-4">
        <h3 className="text-lg font-semibold gradient-text mb-4">Recent Roasts</h3>
        <div className="space-y-3">
          {recentRoasts.map((roast) => (
            <div 
              key={roast.id} 
              className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
            >
              <div>
                <div className="font-medium text-gray-200">{roast.target}</div>
                <div className="text-sm text-gray-400">{roast.date}</div>
              </div>
              <div className="flex items-center space-x-2">
                {roast.status === "Completed" ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;