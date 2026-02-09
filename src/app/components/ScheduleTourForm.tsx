import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface ScheduleTourFormProps {
  propertyId: string;
  propertyTitle: string;
  onClose?: () => void;
}

export function ScheduleTourForm({ propertyId, propertyTitle, onClose }: ScheduleTourFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock form submission
    console.log('Tour scheduled:', { ...formData, propertyId, propertyTitle });
    
    toast.success('Tour scheduled successfully! We\'ll send you a confirmation email.');
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
    });

    if (onClose) {
      onClose();
    }
  };

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

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Schedule Tour
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
