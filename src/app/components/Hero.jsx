import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';

export function Hero({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('all');

  const handleSearch = () => {
    onSearch(searchTerm, propertyType);
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">
            Find Your Dream Property
          </h1>
          <p className="text-lg md:text-xl mb-10 text-blue-100">
            Discover the perfect home, land, or investment opportunity from thousands of listings
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by location, property name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-12"
                />
              </div>
              <div className="w-full md:w-48 ">
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-12 bg-green-100 text-green-900 border-green-300">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="house">Houses</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="building">Buildings</SelectItem>
                    <SelectItem value="rental">Rentals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSearch} size="lg" className="h-12 gap-2">
                <Search className="h-5 w-5" />
                Search
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 text-center">
            <div>
              <div className="text-3xl md:text-4xl mb-2">500+</div>
              <div className="text-sm md:text-base text-blue-100">Properties</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl mb-2">1000+</div>
              <div className="text-sm md:text-base text-blue-100">Happy Clients</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl mb-2">50+</div>
              <div className="text-sm md:text-base text-blue-100">Cities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
