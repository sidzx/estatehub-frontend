import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function ScheduleMeetingForm({ propertyId, propertyTitle, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    type:''
  });

  const [bookingType,setBookingType]=useState()

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mock form submission
    console.log('Meeting  scheduled:', { ...formData, propertyId, propertyTitle });
    
    toast.success('Meeting scheduled successfully! We\'ll send you a confirmation email.');
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      type:''
    });

    if (onClose) {
      onClose();
    }
  };

  const [phoneNumber, setPhoneNumber] = useState("");
    const [meetingLink, setMeetingLink] = useState("");
    const [siteAddress, setSiteAddress] = useState("");


  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="tour-name">Full Name</Label>
        <Input
          id="tour-name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="John Doe"
        />
      </div>
      
      <div>
        <Label htmlFor="tour-email">Email</Label>
        <Input
          id="tour-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="john@example.com"
        />
      </div>
      
      <div>
        <Label htmlFor="tour-phone">Phone Number</Label>
        <Input
          id="tour-phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          placeholder="+1 (555) 000-0000"
        />
      </div>
      
      <div>
        <Label htmlFor="tour-date">Preferred Date</Label>
        <Input
          id="tour-date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          min={today}
        />
      </div>
      
      <div>
        <Label htmlFor="tour-time">Preferred Time</Label>
        <Input
          id="tour-time"
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
        />
      </div>
       <div className="w-full md:w-48 ">
                <Select value={bookingType} onValueChange={setBookingType}>
                  <SelectTrigger className="h-12 bg-white text-black border-gray-300">
                    <SelectValue placeholder="Meeting Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="site visit">Site Visit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

        {/* Conditional Fields */}

            {bookingType === "call" && (
            <div className="mt-4">
                <Label>Phone Number</Label>
                <br />
                <Label className='text-red-500'>+91 29879222</Label>
                {/* <Input
                type="tel"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                /> */}
            </div>
            )}

            {bookingType === "meeting" && (
            <div className="mt-4">
                <Label>Meeting Link</Label>
                <br />
                <Label className='text-red-500'>Meeting link</Label>
                {/* <Input
                type="url"
                placeholder="Paste meeting link (Zoom / Google Meet)"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                /> */}
            </div>
            )}

            {bookingType === "site visit" && (
            <div className="mt-4">
                <Label>Site Address / Notes</Label>
                {/* <Input
                type="text"
                placeholder="Enter property location or notes"
                value={siteAddress}
                onChange={(e) => setSiteAddress(e.target.value)}
                /> */}
                <br />
                <Label className='text-red-500'>Address</Label>
            </div>
            )}


      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Schedule Meeting
        </Button>
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
