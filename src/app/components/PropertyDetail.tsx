import { ArrowLeft, Bed, Bath, MapPin, Square, Calendar, CheckCircle } from 'lucide-react';
import { Property } from '../data/properties';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ContactForm } from './ContactForm';
import { useState } from 'react';

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
}

export function PropertyDetail({ property, onBack }: PropertyDetailProps) {
  const [showContactForm, setShowContactForm] = useState(false);

  const formatPrice = (price: number, forSale: boolean) => {
    return forSale
      ? `$${price.toLocaleString()}`
      : `$${price.toLocaleString()}/mo`;
  };

  const getPropertyTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Listings
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image */}
          <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-6">
            <ImageWithFallback
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-blue-600 text-white text-base px-3 py-1">
                {getPropertyTypeLabel(property.type)}
              </Badge>
              {property.featured && (
                <Badge className="bg-yellow-500 text-white text-base px-3 py-1">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          {/* Title and Location */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl">{property.title}</h1>
              <Badge className="bg-green-600 text-white text-base px-3 py-1">
                {property.forSale ? 'For Sale' : 'For Rent'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">{property.location}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Square className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-600">Area</div>
                  <div>{property.area.toLocaleString()} sq ft</div>
                </div>
              </CardContent>
            </Card>
            {property.bedrooms && (
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Bed className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                    <div>{property.bedrooms}</div>
                  </div>
                </CardContent>
              </Card>
            )}
            {property.bathrooms && (
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Bath className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                    <div>{property.bathrooms}</div>
                  </div>
                </CardContent>
              </Card>
            )}
            {property.yearBuilt && (
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Year Built</div>
                    <div>{property.yearBuilt}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-2xl mb-4">Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <div className="text-3xl text-blue-600 mb-6">
                {formatPrice(property.price, property.forSale)}
              </div>

              {!showContactForm ? (
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setShowContactForm(true)}
                  >
                    Contact Agent
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    Schedule Tour
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    Save Property
                  </Button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg mb-4">Contact Agent</h3>
                  <ContactForm
                    propertyId={property.id}
                    propertyTitle={property.title}
                    onClose={() => setShowContactForm(false)}
                  />
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <h3 className="mb-3">Property Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property ID:</span>
                    <span>#{property.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span>{getPropertyTypeLabel(property.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="capitalize">{property.status}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
