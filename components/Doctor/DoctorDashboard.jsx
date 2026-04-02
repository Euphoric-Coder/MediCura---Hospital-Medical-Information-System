import React, { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  Clock,
  Users,
  FileText,
  Pill,
  TestTube,
  Bed,
  TrendingUp,
  Bell,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  Stethoscope,
  Activity,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const DoctorDashboard = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate week schedule
  const generateWeekSchedule = (weekOffset) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + weekOffset * 7);

    const schedule = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);

      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Mock appointments for demonstration
      const appointments = [];
      if (i < 5) {
        // Weekdays only
        const appointmentCount = Math.floor(Math.random() * 5) + 1;
        for (let j = 0; j < appointmentCount; j++) {
          const hour = 9 + Math.floor(Math.random() * 8);
          const minute = Math.random() > 0.5 ? 0 : 30;
          appointments.push({
            id: `${i}-${j}`,
            patientName: [
              "Emma Thompson",
              "James Wilson",
              "Sarah Chen",
              "Michael Foster",
              "Olivia Davis",
            ][Math.floor(Math.random() * 5)],
            patientId: `P${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
            time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
            duration: 30,
            type: ["Consultation", "Follow-up", "Check-up", "Emergency"][
              Math.floor(Math.random() * 4)
            ],
            status: ["scheduled", "completed", "in-progress"][
              Math.floor(Math.random() * 3)
            ],
            patientPhone: "+1 (555) 123-4567",
            patientAge: Math.floor(Math.random() * 60) + 20,
            reason: [
              "Annual check-up",
              "Follow-up visit",
              "Chest pain review",
              "Routine examination",
            ][Math.floor(Math.random() * 4)],
            isUrgent: Math.random() > 0.85,
          });
        }
      }

      schedule.push({
        date: dateStr,
        dayName,
        appointments: appointments.sort((a, b) => a.time.localeCompare(b.time)),
      });
    }

    return schedule;
  };

  const [weekSchedule, setWeekSchedule] = useState(generateWeekSchedule(0));

  const handleWeekChange = (direction) => {
    const newWeek = direction === "next" ? currentWeek + 1 : currentWeek - 1;
    setCurrentWeek(newWeek);
    setWeekSchedule(generateWeekSchedule(newWeek));
  };

  const getStatusBadge = (status, isUrgent) => {
    const baseClasses =
      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-11-medium sm:text-12-medium backdrop-blur-md border shadow-sm transition-all";

    if (isUrgent) {
      return (
        <div
          className={`${baseClasses} bg-red-50 text-red-700 border-red-300 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20`}
        >
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
          <span>Urgent</span>
        </div>
      );
    }

    switch (status) {
      case "scheduled":
        return (
          <div
            className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20`}
          >
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>Scheduled</span>
          </div>
        );
      case "in-progress":
        return (
          <div
            className={`${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20`}
          >
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
            <span>In Progress</span>
          </div>
        );
      case "completed":
        return (
          <div
            className={`${baseClasses} bg-slate-50 text-slate-700 border-slate-300 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20`}
          >
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
            <span>Completed</span>
          </div>
        );
      default:
        return null;
    }
  };

  const todayAppointments =
    weekSchedule.find((day) => {
      const today = new Date();
      const dayDate = new Date();
      dayDate.setDate(
        today.getDate() - today.getDay() + weekSchedule.indexOf(day),
      );
      return dayDate.toDateString() === today.toDateString();
    })?.appointments || [];

  const totalAppointments = weekSchedule.reduce(
    (sum, day) => sum + day.appointments.length,
    0,
  );
  const completedAppointments = weekSchedule.reduce(
    (sum, day) =>
      sum + day.appointments.filter((apt) => apt.status === "completed").length,
    0,
  );
  const urgentAppointments = weekSchedule.reduce(
    (sum, day) => sum + day.appointments.filter((apt) => apt.isUrgent).length,
    0,
  );

  return (
    <div className={`min-h-screen bg-slate-50/50 dark:bg-[#0a0f1c] text-slate-900 dark:text-slate-50 font-sans transition-all duration-700 ease-in-out pb-20 overflow-x-hidden ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-emerald-400/20 dark:bg-emerald-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-purple-400/20 dark:bg-purple-600/10 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] dark:opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        
        {/* Welcome Section */}
        <div className="mb-10 lg:mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative w-14 h-14 lg:w-16 lg:h-16 bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-xl flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10"></div>
                  <Stethoscope className="w-7 h-7 lg:w-8 lg:h-8 text-blue-600 dark:text-blue-400 drop-shadow-sm" />
                </div>
              </div>
              <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span className="text-12-medium text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">MediCura Premium</span>
                </div>
                <h1 className="text-28-bold lg:text-40-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white">
                  Good morning, Dr. Safari
                </h1>
                <p className="text-15-regular lg:text-16-regular text-slate-500 dark:text-slate-400 mt-1">
                  Ready to provide exceptional care today.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-4 animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
              <button className="relative p-3 lg:p-3.5 rounded-2xl bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:shadow-lg transition-all duration-300 group shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none z-10">
                <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white dark:border-[#0a0f1c] rounded-full animate-pulse translate-x-1/3 -translate-y-1/3"></div>
              </button>
              <div className="bg-white dark:bg-slate-900/40 backdrop-blur-xl px-5 py-3 lg:px-6 lg:py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none z-10">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-13-medium lg:text-14-medium text-slate-700 dark:text-slate-200">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          {[
            { label: "Today", value: todayAppointments.length, icon: Calendar, color: "blue" },
            { label: "This Week", value: totalAppointments, icon: Users, color: "emerald" },
            { label: "Completed", value: completedAppointments, icon: FileText, color: "indigo" },
            { label: "Urgent", value: urgentAppointments, icon: TrendingUp, color: "rose" },
          ].map((stat, i) => (
            <div key={i} className="group relative z-10">
              <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900/80 dark:to-slate-900/40 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-slate-800/60 shadow-md group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:group-hover:shadow-xl transition-all duration-500"></div>
              <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-5 lg:p-7 flex items-start justify-between">
                <div>
                  <div className={`text-13-medium mb-1.5 transition-colors duration-300 ${
                    stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                    stat.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' :
                    'text-rose-600 dark:text-rose-400'
                  }`}>
                    {stat.label}
                  </div>
                  <div className="text-32-bold lg:text-40-bold tracking-tight text-slate-900 dark:text-white">
                    {stat.value}
                  </div>
                </div>
                
                <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center bg-${stat.color}-50 dark:bg-${stat.color}-500/10 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                  <stat.icon className={`w-6 h-6 lg:w-7 lg:h-7 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 mb-10">
          
          {/* Today's Schedule Container */}
          <div className="xl:col-span-2 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800/60 shadow-lg shadow-slate-200/40 dark:shadow-none"></div>
            
            <div className="relative p-6 lg:p-8">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-20-bold lg:text-24-bold text-slate-900 dark:text-white">
                      Today's Schedule
                    </h2>
                    <p className="text-13-regular text-slate-500 dark:text-slate-400 mt-1">
                      You have {todayAppointments.length} sessions planned for today.
                    </p>
                  </div>
                </div>
                
                <button className="hidden sm:flex items-center gap-2 text-13-medium text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors bg-blue-100/80 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-500/20">
                  <span>View All</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="group relative bg-white dark:bg-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-800 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-3xl p-5 lg:p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden"
                    >
                      {/* Subdued accent line on the left */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 ${
                        appointment.isUrgent ? 'bg-red-500' : 'bg-transparent group-hover:bg-blue-500'
                      }`}></div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pl-2">
                        <div className="flex gap-5">
                          <div className="relative">
                            <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0 text-slate-500 dark:text-slate-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700">
                              <User className="w-7 h-7 lg:w-8 lg:h-8" />
                            </div>
                            {appointment.isUrgent && (
                              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full animate-bounce"></div>
                            )}
                          </div>

                          <div className="flex flex-col justify-center">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h3 className="text-16-bold xl:text-18-bold text-slate-900 dark:text-white">
                                {appointment.patientName}
                              </h3>
                              {getStatusBadge(appointment.status, appointment.isUrgent)}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-13-regular lg:text-14-medium text-slate-500 dark:text-slate-400">
                              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/50 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
                                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                                <span className="text-slate-800 dark:text-slate-300 font-medium">{appointment.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 opacity-70 text-slate-600 dark:text-slate-400" />
                                <span className="text-slate-700 dark:text-slate-300">{appointment.type}</span>
                              </div>
                              <div className="hidden sm:flex items-center gap-2">
                                <User className="w-4 h-4 opacity-70 text-slate-600 dark:text-slate-400" />
                                <span className="text-slate-700 dark:text-slate-300">{appointment.patientAge} yrs</span>
                              </div>
                            </div>
                            
                            <div className="mt-3 text-13-regular lg:text-14-regular flex items-start gap-2 max-w-lg">
                              <Activity className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
                              <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                {appointment.reason}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-16 md:ml-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800 pt-4 md:pt-0">
                          {appointment.status === "scheduled" && (
                            <button className="relative overflow-hidden group/btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 text-white px-6 py-3 rounded-xl text-14-medium transition-all active:scale-95 shadow-md shadow-blue-600/20 dark:shadow-blue-900/40">
                              <span className="relative z-10 flex items-center gap-2">
                                Start Consult
                                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                              </span>
                              <div className="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                            </button>
                          )}
                          {appointment.status === "in-progress" && (
                            <button className="relative overflow-hidden group/btn bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 dark:from-emerald-400 dark:to-teal-400 text-white px-6 py-3 rounded-xl text-14-medium transition-all active:scale-95 shadow-md shadow-emerald-500/20 dark:shadow-emerald-900/40">
                              <span className="relative z-10 flex items-center gap-2">
                                Continue
                                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                              </span>
                              <div className="absolute inset-0 bg-white/20 dark:bg-black/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                            </button>
                          )}
                          <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition-all shadow-sm">
                            <Phone className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 relative overflow-hidden shadow-sm">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
                    <div className="w-20 h-20 bg-blue-100/50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-5 backdrop-blur-sm border border-blue-200 dark:border-blue-500/20 shadow-inner">
                      <Calendar className="w-10 h-10 text-blue-600 dark:text-blue-400 drop-shadow-sm" />
                    </div>
                    <h3 className="text-18-bold lg:text-20-bold text-slate-900 dark:text-white mb-2">
                      Your schedule is clear
                    </h3>
                    <p className="text-14-regular lg:text-15-regular text-slate-600 dark:text-slate-400 max-w-sm">
                      No appointments remaining for today. Enjoy your time or catch up on other tasks.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side Panel: Actions & Summary */}
          <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 delay-400 relative z-10">
            
            {/* Action Menu */}
            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none rounded-[2rem] p-6 position-relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none"></div>
              
              <div className="flex items-center gap-4 mb-6 relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 flex items-center justify-center to-fuchsia-600 rounded-2xl shadow-lg shadow-purple-500/30">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-18-bold text-slate-900 dark:text-white">
                  Quick Actions
                </h3>
              </div>
              
              <div className="space-y-3 relative">
                {[
                  { icon: Pill, label: "Write Prescription", color: "emerald", border: "border-emerald-200 dark:border-emerald-500/30", gradient: "from-emerald-50 to-teal-50 dark:from-emerald-500/[0.05] dark:to-teal-500/[0.05]", hover: "group-hover:text-emerald-600 dark:group-hover:text-emerald-500" },
                  { icon: TestTube, label: "Order Lab Test", color: "blue", border: "border-blue-200 dark:border-blue-500/30", gradient: "from-blue-50 to-indigo-50 dark:from-blue-500/[0.05] dark:to-indigo-500/[0.05]", hover: "group-hover:text-blue-600 dark:group-hover:text-blue-500" },
                  { icon: Bed, label: "Hospital Admit", color: "rose", border: "border-rose-200 dark:border-rose-500/30", gradient: "from-rose-50 to-orange-50 dark:from-rose-500/[0.05] dark:to-orange-500/[0.05]", hover: "group-hover:text-rose-600 dark:group-hover:text-rose-500" },
                ].map((action, i) => (
                  <button key={i} className="w-full relative group overflow-hidden rounded-2xl p-[1px] shadow-sm hover:shadow-md transition-shadow">
                    <span className="absolute inset-0 bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <div className={`relative flex items-center justify-between bg-white dark:bg-[#0a0f1c] px-5 py-4 rounded-2xl transition-colors duration-300 bg-gradient-to-r border border-slate-200 dark:border-slate-800 ${action.gradient}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-white shadow-sm dark:bg-slate-800 border ${action.border} flex items-center justify-center transition-colors duration-300`}>
                          <action.icon className={`w-4 h-4 text-slate-700 dark:text-slate-400 ${action.hover} transition-colors duration-300`} />
                        </div>
                        <span className="text-15-bold text-slate-800 dark:text-slate-200">{action.label}</span>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-slate-400 dark:text-slate-600 ${action.hover} transition-all duration-300 group-hover:translate-x-1`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Summary Mini-Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-slate-800 dark:to-slate-900 rounded-[2rem] p-1 shadow-xl lg:shadow-2xl shadow-blue-500/20 dark:shadow-none overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute -inset-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              
              <div className="bg-blue-600/90 dark:bg-[#0a0f1c] backdrop-blur-md rounded-[1.8rem] p-6 lg:p-7 relative h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/20 dark:bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30 dark:border-white/10 shadow-sm">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-18-bold text-white tracking-wide">
                    Patient Metrics
                  </h3>
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-14-medium text-blue-100 dark:text-slate-400">Total Assigned</span>
                    <span className="text-16-bold text-white">247</span>
                  </div>
                  <div className="h-px bg-blue-400/30 dark:bg-white/10 w-full"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-14-medium text-blue-100 dark:text-slate-400">New This Month</span>
                    <span className="text-16-bold text-emerald-300 dark:text-emerald-400">+12</span>
                  </div>
                  <div className="h-px bg-blue-400/30 dark:bg-white/10 w-full"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-14-medium text-blue-100 dark:text-slate-400">Pending Reviews</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-300 dark:bg-amber-400 animate-pulse"></div>
                      <span className="text-16-bold text-amber-300 dark:text-amber-400">8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Area */}
        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 mb-10">
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800/60 shadow-lg shadow-slate-200/40 dark:shadow-none"></div>
          
          <div className="relative p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-20-bold lg:text-24-bold text-slate-900 dark:text-white">
                  Weekly Planner
                </h2>
              </div>
              
              <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl backdrop-blur-md border border-slate-200/80 dark:border-slate-700/50 shadow-sm">
                <button
                  onClick={() => handleWeekChange("prev")}
                  className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:shadow-sm transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-32 lg:w-40 text-center">
                  <span className="text-14-bold text-slate-800 dark:text-slate-200">
                    {currentWeek === 0
                      ? "Current Week"
                      : currentWeek > 0
                        ? `+${currentWeek} Week${currentWeek > 1 ? "s" : ""}`
                        : `${currentWeek} Week${Math.abs(currentWeek) > 1 ? "s" : ""}`}
                  </span>
                </div>
                <button
                  onClick={() => handleWeekChange("next")}
                  className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:shadow-sm transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 lg:gap-5">
              {weekSchedule.map((day, dayIndex) => {
                const isToday = currentWeek === 0 && new Date().getDay() === (dayIndex + 1) % 7 && dayIndex < 6; // Rough check for demo aesthetics
                const hasAppointments = day.appointments.length > 0;
                
                return (
                  <div
                    key={dayIndex}
                    className={`relative rounded-3xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${
                      isToday ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 scale-[1.02]" : ""
                    }`}
                  >
                    <div className={`absolute inset-0 transition-opacity duration-300 ${
                      hasAppointments 
                        ? "bg-slate-50 dark:bg-slate-800/60 backdrop-blur-md" 
                        : "bg-slate-50/50 dark:bg-slate-800/20 backdrop-blur-sm"
                    }`}></div>
                    
                    <div className={`absolute inset-0 border rounded-3xl transition-colors duration-300 ${
                       hasAppointments ? "border-slate-200 dark:border-slate-700/80" : "border-slate-200/60 dark:border-slate-700/30"
                    }`}></div>
                    
                    <div className="relative p-4 lg:p-5 h-full flex flex-col">
                      <div className="text-center mb-5 pb-4 border-b border-slate-200 dark:border-slate-700/50 relative">
                        {isToday && <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>}
                        <h3 className={`text-16-bold mb-1 ${isToday ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white"}`}>
                          {day.dayName}
                        </h3>
                        <p className="text-12-medium text-slate-500 dark:text-slate-400">
                          {day.date}
                        </p>
                      </div>

                      <div className="space-y-3 flex-1">
                        {hasAppointments ? (
                          day.appointments.slice(0,4).map((appointment, index) => {
                            let cardTheme = appointment.isUrgent 
                              ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-900 dark:text-red-100 shadow-[0_2px_10px_rgba(239,68,68,0.05)]" 
                              : "bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)]";

                            return (
                              <div
                                key={index}
                                className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer hover:border-blue-300 dark:hover:border-slate-400 hover:scale-[1.02] ${cardTheme}`}
                              >
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="text-12-bold tracking-tight opacity-80">
                                    {appointment.time}
                                  </span>
                                  {appointment.isUrgent && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                                </div>
                                <div className="text-13-bold truncate mb-0.5">
                                  {appointment.patientName}
                                </div>
                                <div className="text-11-medium opacity-60 truncate">
                                  {appointment.type}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="h-full min-h-[120px] flex flex-col items-center justify-center text-center opacity-40">
                            <Calendar className="w-8 h-8 text-slate-500 dark:text-slate-500 mb-2" />
                            <div className="w-4 h-0.5 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                          </div>
                        )}
                        {day.appointments.length > 4 && (
                          <div className="text-11-bold text-center text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                            +{day.appointments.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Stats / Recent Activity */}
        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-700">
           <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800/60 shadow-lg shadow-slate-200/40 dark:shadow-none"></div>
           
           <div className="relative p-6 lg:p-8">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
                 <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
               </div>
               <h2 className="text-18-bold lg:text-20-bold text-slate-900 dark:text-white">
                 Activity Overview
               </h2>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-8">
               {[
                 { label: "Prescriptions", value: "12", sub: "Written today", icon: Pill, color: "blue" },
                 { label: "Lab Orders", value: "8", sub: "Dispatched", icon: TestTube, color: "emerald" },
                 { label: "Admissions", value: "3", sub: "Processed", icon: Bed, color: "rose" }
               ].map((act, i) => (
                 <div key={i} className={`flex flex-col p-6 bg-white dark:bg-slate-800/30 rounded-3xl border border-slate-200 dark:border-slate-700/50 hover:border-${act.color}-300 dark:hover:border-${act.color}-500/50 hover:shadow-lg transition-all shadow-sm`}>
                   <div className="flex items-center gap-3 mb-4">
                     <div className={`w-10 h-10 rounded-xl bg-${act.color}-100 dark:bg-${act.color}-500/20 border border-${act.color}-200 dark:border-${act.color}-500/30 flex items-center justify-center shadow-sm`}>
                       <act.icon className={`w-5 h-5 text-${act.color}-600 dark:text-${act.color}-400`} />
                     </div>
                     <span className="text-15-bold text-slate-800 dark:text-slate-200">{act.label}</span>
                   </div>
                   <div className="flex items-end gap-3 mt-auto pt-2">
                     <span className="text-36-bold text-slate-900 dark:text-white leading-none tracking-tight">{act.value}</span>
                     <span className={`text-14-medium text-${act.color}-600 dark:text-${act.color}-400 pb-1 font-medium`}>{act.sub}</span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;
