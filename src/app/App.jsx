import { useState,useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PropertyList } from './components/PropertyList';
import { PropertyDetail } from './components/PropertyDetail';
import { PropertyCard } from './components/PropertyCard';
import { AuthDialog } from './components/AuthDialog';
import { SellPropertyForm } from './components/SellPropertyForm';
import { Footer } from './components/Footer';
//import { properties } from './data/properties';
import { Toaster } from './components/ui/sonner';
import { fetchProp } from '../Services/api/apicalls';

function App() {
  console.log("APP RENDERED")
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [properties,setProperties]=useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user,setUser]=useState(null)
  const handleSearch = (searchTerm, propertyType) => {
    let filtered = properties;

    // Filter by property type
    if (propertyType !== 'all') {
      filtered = filtered.filter(p => p.type === propertyType);
    }

    // Filter by search term (location or title)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(term) ||
          p.location.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
      );
    }

    setSearchResults(filtered);
    setCurrentPage('buy');
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setCurrentPage('detail');
    console.log("zoom")
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    
    // Set appropriate property filters based on navigation
    if (page === 'buy') {
      setSearchResults(properties.filter(p => p.forSale));
    } else if (page === 'rent') {
      setSearchResults(properties.filter(p => !p.forSale));
    } else if (page === 'home') {
      setSearchResults(properties);
    }
  };
  useEffect(() => {

  const fetchProperties = async () => {

    try {

      const response = await fetchProp();

      console.log("RAW API:", response);

      // Axios
      const lambdaPayload = response.data;

      // If native fetch use:
      // const lambdaPayload = await response.json();

      console.log("LAMBDA PAYLOAD:", lambdaPayload);

      const parsed = JSON.parse(lambdaPayload.body);

      console.log("FINAL DATA:", parsed);

      setProperties(parsed);        // ✅ array
      setSearchResults(parsed);     // ✅ array

    } catch (err) {
      console.error(err);
    }

  };

  fetchProperties();

}, []);


  console.log(properties)

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onSearch={handleSearch} />
            <div className="container mx-auto px-4 py-12">
              <h2 className="text-3xl mb-2">Featured Properties</h2>
              <p className="text-gray-600 mb-8">Handpicked properties just for you</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(properties) &&
                  properties
                   
                    .slice(0, 6)
                    .map(property => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onClick={() => handlePropertyClick(property)}
                      />
                ))}

              </div>
            </div>
          </>
        );

      case 'buy':
        return (
          <PropertyList
            properties={searchResults}
            onPropertyClick={handlePropertyClick}
            title="Properties for Sale"
          />
        );

      case 'rent':
        return (
          <PropertyList
            properties={searchResults}
            onPropertyClick={handlePropertyClick}
            title="Properties for Rent"
          />
        );

      case 'sell':
        return <SellPropertyForm />;

      case 'detail':
        return selectedProperty ? (
          <PropertyDetail
            property={selectedProperty}
            onBack={() => setCurrentPage('buy')}
          />
        ) : null;

      default:
        return null;
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        user={user}
        onAuthClick={() => setAuthDialogOpen(true)}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        
      />
      
      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer />

      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} setUser={setUser} />
      
      <Toaster />
    </div>
  );
}

export default App;
