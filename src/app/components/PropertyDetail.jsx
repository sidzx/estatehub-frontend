import { ArrowLeft, Bed, Bath, MapPin, Square, Calendar, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ContactForm } from './ContactForm';
import { ScheduleTourForm } from './ScheduleTourForm';
import { ScheduleMeetingForm } from './ScheduleMeetingForm';
import { useEffect, useState } from 'react';
import { fetchPropDetails } from '../../Services/api/apicalls';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PropertyDetail({ property, onBack }) {
  const [showContactForm, setShowContactForm] = useState(false);
  const [showScheduleTourForm, setShowScheduleTourForm] = useState(false);
  const [showScheduleMeetingForm,setShowScheduleMeetingForm]=useState(false)
  const [propertyDetails,setPropertyDetails]=useState(null)
  const [loading, setLoading] = useState(true);
  const BUCKET_BASE_URL = "https://real-estate-property-image.s3.ap-south-2.amazonaws.com/";
//   const AMENITY_MAP = {
//   HAS_BALCONY: "Balcony",
//   HAS_FIREPLACE: "Fireplace",
//   HAS_GARAGE: "Garage",
//   HAS_GARDEN: "Garden",
//   HAS_GYM: "Gym",
//   HAS_KIDS_PLAY_AREA: "Kids Play Area",
//   HAS_LIFT: "Lift",
//   HAS_MODERN_KITCHEN: "Modern Kitchen",
//   HAS_PARK: "Park",
//   HAS_PARKING: "Parking",
//   HAS_ROOFTOP_ACCESS: "Rooftop Access",
//   HAS_SECURITY: "Security",
//   HAS_SWIMMING_POOL: "Swimming Pool"
// };
// const activeAmenities = Object.keys(AMENITY_MAP).filter(
//   (key) => propertyDetails[key] === 1 || propertyDetails[key] === "1"
// );
  const [currentIdx, setCurrentIdx] = useState(0);
  let images = [];
try {
    if (typeof property.IMAGES === 'string') {
        images = JSON.parse(property.IMAGES);
    } else {
        images = property.IMAGES || [];
    }
} catch (e) {
    console.error("Error parsing images:", e);
    images = [];
}

console.log(images, "images (parsed)");
  //const images = property.IMAGES; 
  //console.log(images,"images")
  const nextImage = () => setCurrentIdx((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  const currentImageUrl = images.length > 0 
    ? `${BUCKET_BASE_URL}${images[currentIdx]}` 
    : "/placeholder-image.jpg";
  console.log("current image url",currentImageUrl)

  const formatPrice = (price, forSale) => {
    if (!price) return "Price on Request";
    const numericPrice = Number(price).toLocaleString('en-IN');
    return forSale === "SALE"
      ? `₹${numericPrice}`
      : `₹${numericPrice}/mo`;
  };
  
  
  const fetchProperty=async(id)=>{
    setLoading(true);
    try {
      const result = await fetchPropDetails(id);
      console.log("result",result)
      // Ensure we are getting the object from the response
      setPropertyDetails(result.data); 
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    
      fetchProperty(property.PROPERTY_ID);
      console.log("hi")

    
  }, [property]);
  
  const AMENITY_MAP = {
  HAS_BALCONY: "Balcony",
  HAS_FIREPLACE: "Fireplace",
  HAS_GARAGE: "Garage",
  HAS_GARDEN: "Garden",
  HAS_GYM: "Gym",
  HAS_KIDS_PLAY_AREA: "Kids Play Area",
  HAS_LIFT: "Lift",
  HAS_MODERN_KITCHEN: "Modern Kitchen",
  HAS_PARK: "Park",
  HAS_PARKING: "Parking",
  HAS_ROOFTOP_ACCESS: "Rooftop Access",
  HAS_SECURITY: "Security",
  HAS_SWIMMING_POOL: "Swimming Pool"
};
if (!propertyDetails) return <div className="p-20 text-center">Property not found.</div>;
const activeAmenities = Object.keys(AMENITY_MAP).filter(
  (key) => propertyDetails[key] === 1 || propertyDetails[key] === "1"
);
  console.log(propertyDetails,"prperty_id")
  if (loading) return <div className="p-20 text-center">Loading property details...</div>;
  

  // useEffect(()=>{
  //   fetchProperty(property.PROPERTY_ID)
  //   //const result = fetchPropDetails(property.PROPERTY_ID);
  //   console.log("hi")
  // },[property])

  const getPropertyTypeLabel = (type) => {
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
          {/* <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-6">
            <ImageWithFallback
              src={propertyDetails.IMAGES}
              alt={propertyDetails.TITLE}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-blue-600 text-white text-base px-3 py-1">
                {getPropertyTypeLabel(propertyDetails.TYPE)}
              </Badge>
              {property.FEATURED && (
                <Badge className="bg-yellow-500 text-white text-base px-3 py-1">
                  Featured
                </Badge>
              )}
            </div>
          </div> */}
          <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-6 group">
      {/* The Image */}
      <ImageWithFallback
        src={currentImageUrl}
        alt={`${propertyDetails.TITLE} - Image ${currentIdx + 1}`}
        className="w-full h-full object-cover transition-transform duration-500"
      />

      {/* Badges (Top Left) */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <Badge className="bg-blue-600 text-white text-base px-3 py-1">
          {getPropertyTypeLabel(propertyDetails.TYPE)}
        </Badge>
        {propertyDetails.FEATURED && (
          <Badge className="bg-yellow-500 text-white text-base px-3 py-1">
            Featured
          </Badge>
        )}
      </div>

      {/* Navigation Arrows (Visible on Hover) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Image Counter (Bottom Right) */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {currentIdx + 1} / {images.length}
          </div>
        </>
      )}
    </div>

          {/* Title and Location */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl">{propertyDetails.TITLE}</h1>
              <Badge className="bg-green-600 text-white text-base px-3 py-1">
                {propertyDetails.RENT_SALE }
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">{propertyDetails.STREET_ADDRESS},{propertyDetails.CITY},{propertyDetails.STATE},{propertyDetails.COUNTRY},{propertyDetails.PINCODE}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Square className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-600">Area</div>
                  <div>{propertyDetails.AREA.toLocaleString()} sq ft</div>
                </div>
              </CardContent>
            </Card>
            {propertyDetails.BEDROOM > 0 && (
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Bed className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                    <div>{propertyDetails.BEDROOM}</div>
                  </div>
                </CardContent>
              </Card>
            )}
            {propertyDetails.BATHROOM >0 && (
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Bath className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                    <div>{propertyDetails.BATHROOM}</div>
                  </div>
                </CardContent>
              </Card>
            )}
            {propertyDetails.YEAR_BUILT && (
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Year Built</div>
                    <div>{propertyDetails.YEAR_BUILT}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{propertyDetails.DESCRIPTION}</p>
          </div>

          {/* Amenities */}
          {/* <div className="mb-8">
            <h2 className="text-2xl mb-4">Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {property.amenities &&
      property.amenities.map((amenity, index) => (
        <div key={index} className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span>{amenity}</span>
        </div>
      ))
    }
            </div>
          </div> */}
          <div className="mb-8">
    <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
    {activeAmenities.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeAmenities.map((key) => (
          <div key={key} className="flex items-center gap-2 py-1">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span className="text-gray-700">{AMENITY_MAP[key]}</span>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 italic">No specific amenities listed.</p>
    )}
  </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <div className="text-3xl text-blue-600 mb-6">
                {formatPrice(propertyDetails.PRICE, propertyDetails.RENT_SALE)}
              </div>

              {!showContactForm && !showScheduleTourForm && !showScheduleMeetingForm? (
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setShowContactForm(true)}
                  >
                    Contact Agent
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    onClick={() => setShowScheduleTourForm(true)}
                  >
                    Schedule Tour
                  </Button>
                  <Button variant="outline" className="w-full" size="lg" onClick={() => setShowScheduleMeetingForm(true)}>
                    Book Now
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    Save Property
                  </Button>
                </div>
              ) : (
                <div>
                  {showContactForm && (
                    <div>
                      <h3 className="text-lg mb-4">Contact Agent</h3>
                      <ContactForm
                        propertyId={propertyDetails.PROPERTY_ID}
                        propertyTitle={propertyDetails.TITLE}
                        onClose={() => setShowContactForm(false)}
                      />
                    </div>
                  )}
                  {showScheduleTourForm && (
                    <div>
                      <h3 className="text-lg mb-4">Schedule Tour</h3>
                      <ScheduleTourForm
                        propertyId={propertyDetails.PROPERTY_ID}
                        propertyTitle={propertyDetails.TITLE}
                        onClose={() => setShowScheduleTourForm(false)}
                      />
                    </div>
                  )}
                   {showScheduleMeetingForm && (
                    <div>
                      <h3 className="text-lg mb-4">Schedule Meeting</h3>
                      <ScheduleMeetingForm
                        propertyId={propertyDetails.PROPERTY_ID}
                        propertyTitle={propertyDetails.TITLE}
                        onClose={() => setShowScheduleMeetingForm(false)}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <h3 className="mb-3">Property Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property ID:</span>
                    <span>#{propertyDetails.PROPERTY_ID}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span>{getPropertyTypeLabel(propertyDetails.TYPE)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="capitalize">{propertyDetails.STATUS}</span>
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
