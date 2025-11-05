import React, { useState, useEffect, useMemo } from 'react';
import { TimeLog } from '../types';
import { DownloadIcon } from './Icons';

// Helper to format duration
const formatDuration = (ms: number) => {
    if (ms < 0) ms = 0;
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
};

// Helper to calculate duration in hours
const getDurationInHours = (ms: number) => {
    if (ms < 0) return 0;
    return ms / 3600000;
};

const TimeLogReport: React.FC = () => {
    const [logs, setLogs] = useState<TimeLog[]>([]);
    const [hourlyRate, setHourlyRate] = useState<number>(100);

    useEffect(() => {
        const storedLogs = localStorage.getItem('staffTimeLogs');
        if (storedLogs) {
            setLogs(JSON.parse(storedLogs));
        }
    }, []);

    const processedData = useMemo(() => {
        const sessions: { staffName: string; timeIn: string; timeOut: string | null; duration: number }[] = [];
        const staffTotals: { [key: string]: { totalHours: number } } = {};

        const logsByUser: { [key: string]: TimeLog[] } = logs.reduce((acc, log) => {
            if (!acc[log.staffName]) {
                acc[log.staffName] = [];
            }
            acc[log.staffName].push(log);
            return acc;
        }, {} as { [key: string]: TimeLog[] });

        for (const staffName in logsByUser) {
            let timeInStamp: string | null = null;
            if (!staffTotals[staffName]) {
                staffTotals[staffName] = { totalHours: 0 };
            }

            logsByUser[staffName].forEach(log => {
                if (log.type === 'in' && !timeInStamp) {
                    timeInStamp = log.timestamp;
                } else if (log.type === 'out' && timeInStamp) {
                    const duration = new Date(log.timestamp).getTime() - new Date(timeInStamp).getTime();
                    sessions.push({ staffName, timeIn: timeInStamp, timeOut: log.timestamp, duration });
                    staffTotals[staffName].totalHours += getDurationInHours(duration);
                    timeInStamp = null;
                }
            });

            if (timeInStamp) {
                const ongoingDuration = new Date().getTime() - new Date(timeInStamp).getTime();
                sessions.push({ staffName, timeIn: timeInStamp, timeOut: null, duration: ongoingDuration });
            }
        }
        return { sessions: sessions.reverse(), staffTotals };
    }, [logs]);
    
    const exportToCSV = () => {
        const headers = ['Staff Name', 'Date', 'Time In', 'Time Out', 'Duration (Hours)'];
        
        const rows = processedData.sessions.map(session => [
            `"${session.staffName}"`,
            `"${new Date(session.timeIn).toLocaleDateString()}"`,
            `"${new Date(session.timeIn).toLocaleTimeString()}"`,
            session.timeOut ? `"${new Date(session.timeOut).toLocaleTimeString()}"` : '"Still Clocked In"',
            `"${getDurationInHours(session.duration).toFixed(2)}"`
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `happy-hearts-timelog-report-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className="bg-white p-6 rounded-lg shadow-md mt-8 non-printable border border-slate-200">
            <div className="flex flex-wrap justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-700">Staff Time Log & Salary Report</h2>
                <button onClick={exportToCSV} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mt-2 sm:mt-0">
                    <DownloadIcon className="w-5 h-5" />
                    Export Logs
                </button>
            </div>
            
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Salary Computation Summary</h3>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg mb-4">
                    <label htmlFor="hourlyRate" className="font-semibold text-slate-600">Hourly Rate (PHP):</label>
                    <input
                        id="hourlyRate"
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        className="p-2 border rounded-lg w-32 focus:ring-2 focus:ring-slate-500 focus:outline-none"
                    />
                </div>
                <div className="max-h-60 overflow-y-auto border rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours Worked</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Salary</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {Object.keys(processedData.staffTotals).length > 0 ? (
                               // FIX: Explicitly type `data` to resolve TS error where it was inferred as `unknown`.
                               Object.entries(processedData.staffTotals).map(([staffName, data]: [string, { totalHours: number }]) => (
                                <tr key={staffName}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{staffName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.totalHours.toFixed(2)} hours</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">₱{(data.totalHours * hourlyRate).toFixed(2)}</td>
                                </tr>
                               ))
                           ) : (
                             <tr>
                               <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No completed time sessions found.</td>
                             </tr>
                           )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Detailed Time Logs</h3>
                <div className="max-h-96 overflow-y-auto border rounded-lg">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Out</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {processedData.sessions.length > 0 ? (
                                processedData.sessions.map((session, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.staffName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(session.timeIn).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(session.timeIn).toLocaleTimeString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {session.timeOut ? new Date(session.timeOut).toLocaleTimeString() : <span className="text-blue-600 font-semibold">Clocked In</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatDuration(session.duration)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No time logs found.</td>
                                </tr>
                            )}
                         </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default TimeLogReport;
