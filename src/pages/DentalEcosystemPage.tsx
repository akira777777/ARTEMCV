import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Activity, Clock, Users } from 'lucide-react';

const DentalEcosystemPage = () => {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Generate time slots for demonstration
  useEffect(() => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00`, `${hour}:30`);
    }
    setTimeSlots(slots);
  }, []);

  const services = [
    { name: "General Checkup", duration: "30 min", price: "$80" },
    { name: "Teeth Whitening", duration: "60 min", price: "$300" },
    { name: "Root Canal", duration: "90 min", price: "$800" },
    { name: "Cosmetic Bonding", duration: "45 min", price: "$400" },
  ];

  const metrics = [
    { value: "40%", label: "Increase in online bookings", icon: Calendar },
    { value: "2.3x", label: "Faster scheduling", icon: Clock },
    { value: "95%", label: "Patient satisfaction", icon: Users },
    { value: "12", label: "Clinics served", icon: Activity },
  ];

  const handleBookAppointment = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 to-red-900/20" />
        
        <div className="text-center z-10 max-w-4xl mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
              Dental Clinic Ecosystem
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8"
          >
            AI-powered appointment orchestration and diagnostic visualization platform 
            with real-time data sync using WebSockets for live clinic availability.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center space-x-4"
          >
            <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity">
              Schedule Demo
            </button>
            <button className="px-6 py-3 border border-border rounded-lg font-semibold text-foreground hover:bg-muted transition-colors">
              View Analytics
            </button>
          </motion.div>
        </div>
      </div>

      {/* Metrics Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <metric.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
                  {metric.value}
                </div>
                <div className="text-sm text-muted-foreground mt-2">{metric.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Booking Interface */}
          <div className="bg-card p-8 rounded-xl border border-border mb-16">
            <h2 className="text-2xl font-bold mb-6">Book Your Appointment</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Select Date</h3>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 bg-background border border-border rounded-lg mb-6"
                />
                
                <h3 className="font-semibold mb-4">Services</h3>
                <div className="space-y-3">
                  {services.map((service, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border border-border rounded-lg">
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">{service.duration}</div>
                      </div>
                      <div className="font-semibold">{service.price}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Available Time Slots</h3>
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {timeSlots.map((slot, index) => (
                    <button
                      key={index}
                      className="p-2 text-sm border border-border rounded-lg hover:bg-primary/10 hover:border-primary transition-colors"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleBookAppointment}
                  disabled={isBooking || !selectedDate}
                  className="w-full mt-6 p-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isBooking ? 'Processing...' : 'Confirm Appointment'}
                </button>
                
                {bookingSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-center text-green-500"
                  >
                    Appointment confirmed! Check your email for details.
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Technical Features */}
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Real-time Technology</h2>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">WebSocket Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Live clinic availability updates with instant synchronization across all platforms.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">AI-Powered Scheduling</h3>
                  <p className="text-sm text-muted-foreground">
                    Intelligent algorithm optimizes appointment slots based on dentist availability and patient needs.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Diagnostic Visualization</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced imaging system with 3D visualization tools for treatment planning.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Business Impact</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Booking Conversion</h3>
                    <p className="text-sm text-muted-foreground">
                      40% increase in online booking conversions through streamlined interface
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Operational Efficiency</h3>
                    <p className="text-sm text-muted-foreground">
                      Reduced administrative overhead by 60% with automated scheduling
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Patient Satisfaction</h3>
                    <p className="text-sm text-muted-foreground">
                      95% patient satisfaction rating due to improved appointment experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DentalEcosystemPage;