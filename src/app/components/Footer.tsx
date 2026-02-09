import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-blue-500" />
              <span className="text-xl text-white">EstateHub</span>
            </div>
            <p className="text-sm mb-4">
              Your trusted partner in finding the perfect property. We connect buyers, sellers, and renters with their dream homes and investments.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Properties</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Agents</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-white mb-4">Property Types</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Houses for Sale</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Apartments for Rent</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Commercial Buildings</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Land & Plots</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Investment Properties</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>123 Real Estate Ave, Suite 100<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>info@estatehub.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; 2026 EstateHub. All rights reserved. | <a href="#" className="hover:text-blue-500">Privacy Policy</a> | <a href="#" className="hover:text-blue-500">Terms of Service</a></p>
        </div>
      </div>
    </footer>
  );
}
