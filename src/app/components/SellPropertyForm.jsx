import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { Upload , X} from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import userPool from '../../Services/Cognito/Userpool';
import { v4 } from 'uuid'
import { addProperties, generateUploadUrl } from '../../Services/api/apicalls';
export function SellPropertyForm() {

 
  
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    price: '',
    streetAddress: '',
    city:'',
    state:'',
    country:'',
    zipcode:'',
    area: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    forSale: 'sale',
    amenities: [],
    yearBuilt: '',
    acceptTerms:''
  });

    const [images, setImages] = useState([]);

  const availableAmenities = [
    'Swimming Pool',
    'Gym',
    'Park',
    'Garage',
    'Garden',
    'Modern Kitchen',
    'Security System',
    'Elevator',
    'Parking',
    'Fireplace',
    'Balcony',
    'Rooftop Access'
  ];

    const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };


  const [user,setUser]=useState("")

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // 1. Check Limits
    if (files.length + images.length > 10) {
      // toast.error('Maximum 10 images allowed');
      return;
    }

    // 2. Process Files
    const newImages = files.map(file => {
      // Basic Validation
      if (file.size > 10 * 1024 * 1024) return null; // 10MB limit
      if (!file.type.startsWith('image/')) return null;

      return {
        id: Date.now() + Math.random(),
        url: URL.createObjectURL(file), 
        file: file,                    
        name: file.name
      };
    }).filter(Boolean);

    // 3. Update State
    setImages(prev => [...prev, ...newImages]);

    // 4. Reset input
    e.target.value = '';
  };

  const removeImage = (idToRemove) => {
    setImages(prev => {
      // 1. Find the image to revoke its URL (free up memory)
      const imageToRemove = prev.find(img => img.id === idToRemove);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      
      // 2. Return the new list without that image
      return prev.filter(img => img.id !== idToRemove);
    });
  };





const handleSubmit = async (e) => {
    e.preventDefault();

    // --- 1. Basic Validation ---
    if (!user) {
        toast.error("Please Login");
        return;
    }
    if (images.length === 0) {
        toast.error("Please upload at least one image");
        return;
    }

    try {
        toast.loading("Starting upload...");

       
        const fileTypes = images.map(img => img.type);

        const payload = {
            fileCount: images.length,
            fileTypes: fileTypes
        };

        
        const initUpload = await generateUploadUrl(payload);
        const { propertyId, urls } = initUpload.data;

        console.log("Got upload slots:", urls);
        
        const uploadPromises = images.map(async (imageObj, index) => {
            const { uploadUrl } = urls[index];

            const response = await fetch(uploadUrl, {
                method: 'PUT',
                body: imageObj.file, // Send raw file
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            });

            if (!response.ok) {
              
                const errorText = await response.text();
                console.error(`Upload failed for image ${index}:`, errorText);
                throw new Error(`S3 Error: ${response.status} ${response.statusText}`);
            }
        });

        // Wait for all uploads to finish
        await Promise.all(uploadPromises);
        console.log("Images uploaded to S3 successfully");


        // --- STEP 3: Save Data to DynamoDB ---
        const s3Keys = urls.map(u => u.key);

        const propertyData = {
            propertyId: propertyId,
            ...formData,
            images: s3Keys,
            userId:user
        };
        console.log("Attempting to save property to DynamoDB...", propertyData);

        try {
            const saveResponse = await addProperties(propertyData);
            console.log("Backend Response received:", saveResponse);

           if (saveResponse && saveResponse.success === true) {
               toast.dismiss();
                toast.success("Property Listed Successfully!");
                
                
                setImages([]);
                setFormData({
                title: '',
                type: '',
                price: '',
                streetAddress: '',
                city:'',
                state:'',
                country:'',
                zipcode:'',
                area: '',
                bedrooms: '',
                bathrooms: '',
                description: '',
                forSale: 'sale',
                amenities: [],
                yearBuilt: '',
            });
            } else {
                console.warn("Save response was not 200:", saveResponse);
                toast.error("Server responded with an error.");
            }
        } catch (saveError) {
            console.error("The save-property call failed specifically:", saveError);
            toast.error("Images uploaded, but database save failed.");
        }
        // Call your backend API
        // const saveResponse = await addProperties(propertyData);

        // // Success Handling
        // if (saveResponse.status === 200 || saveResponse.status === 201) {
        //     toast.dismiss();
        //     toast.success("Property Listed Successfully!");

        //     // Reset Form & Images
        //     setImages([]);
        //     setFormData({
        //         title: '',
        //         type: '',
        //         price: '',
        //         location: '',
        //         area: '',
        //         bedrooms: '',
        //         bathrooms: '',
        //         description: '',
        //         forSale: 'sale',
        //         amenities: [],
        //         yearBuilt: ''
        //     });
        // }

    } catch (error) {
        console.error("Upload Error:", error);
        toast.dismiss();

        if (error.message.includes('S3 Error')) {
            toast.error("Image Upload Failed. Check console for details.");
        } else {
            toast.error("Submission Failed. Please try again.");
        }
    }
};

  useEffect(()=>{
    const user=userPool.getCurrentUser()
    if (!user) return
     user.getSession((err, session) => {
      if (err || !session?.isValid()) return;

      user.getUserAttributes((err, attributes) => {
        if (err) return;

        const data = {};
        attributes.forEach(attr => {
          data[attr.getName()] = attr.getValue();
        });
        
       setUser(data.sub)
       console.log("userdata",data)
      });
    });

   },[])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">List Your Property</CardTitle>
            <p className="text-gray-600">Fill in the details below to list your property</p>
            {!user &&( <p className="text-red-600 test-xs ">Please "Sign In" before filling the form !</p>)}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder=" Modern Family Home"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Property Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="building">Building</SelectItem>
                        <SelectItem value="rental">Rental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="forSale">Listing Type *</Label>
                    <Select
                      value={formData.forSale}
                      onValueChange={(value) => setFormData({ ...formData, forSale: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price">{formData.forSale === 'sale' ? 'Sale Price (₹)' : 'Monthly Rent (₹)'} *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      placeholder=""
                    />
                  </div>

                  <div>
                    <Label htmlFor="streetAddress">streetAddress*</Label>
                    <Input
                      id="streetAddress"
                      value={formData.streetAddress}
                      onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                      required
                      placeholder="Street Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      required
                      placeholder="Country"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipcode ">Zip/Postal Code *</Label>
                    <Input
                      id="zipcode"
                      value={formData.zipcode}
                      onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                      required
                      placeholder="Zipcode"
                    />
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h3 className="text-lg mb-4">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="area">Area (sq ft) *</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      required
                      placeholder=""
                    />
                  </div>

                  <div>
                    <Label htmlFor="yearBuilt">Year Built</Label>
                    <Input
                      id="yearBuilt"
                      type="number"
                      value={formData.yearBuilt}
                      onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                      placeholder=""
                      min="1800"
                      max="2026"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      placeholder=""
                      min="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      placeholder=""
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={5}
                  placeholder="Describe your property..."
                />
              </div>

              {/* Amenities */}
               <div>
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                  {availableAmenities.map(amenity => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <label 
                        htmlFor={`amenity-${amenity}`}
                        className="text-sm cursor-pointer"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <Label>Property Images (Max 10)</Label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="image-upload"
                  className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB (Max 10 images)</p>
                </label>
                
                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {images.map(img => (
                      <div key={img.id} className="relative group">
                        <img
                          src={img.url}
                          alt={img.name}
                          className="h-24 w-full object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                          onClick={() => removeImage(img.id)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
                <div className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg">
                  <Checkbox
                    id="acceptTerms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked })}
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-gray-700 cursor-pointer">
                    I accept the{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full">
                Submit Property Listing
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="mb-2">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Our team will review your listing within 24 hours</li>
              <li>• You'll receive a confirmation email once approved</li>
              <li>• Your property will be visible to thousands of potential buyers</li>
              <li>• You can manage your listing anytime from your dashboard</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
