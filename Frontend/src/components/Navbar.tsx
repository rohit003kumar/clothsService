



// import React, { useState, useEffect } from 'react';
// // import InstallPWAButton from './InstallPWAButton';
// import InstallPWAButton from './InstallPWAButton';
// import { Link } from 'react-router-dom';
// import {
//   Search,
//   WashingMachine,
//   ShoppingCart,
//   User,
//   UserPlus,
//   Menu,
//   X,
//   MapPin,
// } from 'lucide-react';

// interface NavbarProps {
//   searchQuery: string;
//   onSearchChange: (query: string) => void;
//   cartItemCount?: number;
//   onCartClick?: () => void;
//   onContactClick?: () => void;
//   onAboutClick?: () => void;
//   onOrdersClick?: () => void;
//   onHomeClick?: () => void;
//   onSignInClick?: () => void;
//   onSignUpClick?: () => void;
//   onProfileClick?: () => void;
// }

// export default function Navbar({
//   searchQuery,
//   onSearchChange,
//   cartItemCount,
//   onCartClick,
// }: NavbarProps) {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, []);

//   return (
//     <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center space-x-3">
//             <WashingMachine className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
//             <h1 className="text-lg md:text-xl font-bold text-gray-900">FoldMate</h1>
//           </div>

//           {/* Desktop Search */}
//           <div className="hidden md:flex flex-1 max-w-md ml-8">
//             <div className="relative w-full">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search by product or washerman name..."
//                 value={searchQuery}
//                 onChange={(e) => onSearchChange(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//               />
//             </div>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-4">
//             <Link to="/" className="text-slate-700 hover:text-blue-600">Home</Link>
//             <Link to="/about" className="text-slate-700 hover:text-blue-600">About</Link>
//             <Link to="/contact" className="text-slate-700 hover:text-blue-600">Contact</Link>
//             <Link to="/orders" className="text-slate-700 hover:text-blue-600">Order</Link>
//             {/* <Link to="/NearbyWashermenMap" className="flex items-center text-slate-700 hover:text-blue-600">
//               <MapPin className="w-4 h-4 mr-1" />
//               Map
//             </Link> */}

//             {!isLoggedIn && (
//               <>
//                 <Link to="/signin" className="flex items-center text-slate-700 hover:text-blue-600">
//                   <User className="w-4 h-4 mr-1" />
//                   Sign In
//                 </Link>
//                 <Link to="/signup" className="flex items-center text-slate-700 hover:text-blue-600">
//                   <UserPlus className="w-4 h-4 mr-1" />
//                   Sign Up
//                 </Link>
//               </>
//             )}

//             {isLoggedIn && (
//               <Link to="/customerdashboard" className="text-slate-700 hover:text-blue-600">
//                 Dashboard
//               </Link>
//             )}

//             {/* Cart */}
//             <button onClick={onCartClick} className="relative p-2 text-gray-700 hover:text-blue-600">
//               <ShoppingCart className="w-5 h-5" />
//               {cartItemCount && cartItemCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//                   {cartItemCount}
//                 </span>
//               )}
//             </button>
         
//           </div>

//           {/* Mobile menu toggle */}
//           <button
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             className="md:hidden text-gray-800"
//             aria-label="Toggle menu"
//           >
//             {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>

//         {/* Mobile Search */}
//         <div className="md:hidden mt-2 mb-3">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => onSearchChange(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//             />
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden bg-white p-4 shadow-lg rounded-md">
//             <ul className="space-y-4">
//               <li><Link to="/" className="block text-slate-700 hover:text-blue-600">Home</Link></li>
//               <li><Link to="/about" className="block text-slate-700 hover:text-blue-600">About</Link></li>
//               <li><Link to="/contact" className="block text-slate-700 hover:text-blue-600">Contact</Link></li>
//               <li><Link to="/orders" className="block text-slate-700 hover:text-blue-600">Order</Link></li>
//               <li><Link to="/NearbyWashermenMap" className="flex items-center text-slate-700 hover:text-blue-600">
//                 <MapPin className="w-4 h-4 mr-1" />
//                 Map
//               </Link></li>
            

//               {!isLoggedIn && (
//                 <>
//                   <li><Link to="/signin" className="block text-slate-700 hover:text-blue-600">Sign In</Link></li>
//                   <li><Link to="/signup" className="block text-slate-700 hover:text-blue-600">Sign Up</Link></li>
//                 </>
//               )}

//               {isLoggedIn && (
//                 <li><Link to="/customerdashboard" className="block text-slate-700 hover:text-blue-600">Dashboard</Link></li>
//               )}

//               <li>
//                 <button
//                   onClick={onCartClick}
//                   className="relative flex items-center text-slate-700 hover:text-blue-600"
//                 >
//                   <ShoppingCart className="w-5 h-5 mr-1" />
//                   Cart
//                   {cartItemCount && cartItemCount > 0 && (
//                     <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//                       {cartItemCount}
//                     </span>
//                   )}
//                 </button>
//               </li>
             
//             </ul>
//             <InstallPWAButton />
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }






// import React, { useState, useEffect } from 'react';
// import InstallPWAButton from './InstallPWAButton';
// import { Link } from 'react-router-dom';
// import {
//   Search,
//   WashingMachine,
//   ShoppingCart,
//   User,
//   UserPlus,
//   Menu,
//   X,
//   MapPin,
// } from 'lucide-react';

// interface NavbarProps {
//   searchQuery: string;
//   onSearchChange: (query: string) => void;
//   cartItemCount?: number;
//   onCartClick?: () => void;
// }

// export default function Navbar({
//   searchQuery,
//   onSearchChange,
//   cartItemCount,
//   onCartClick,
// }: NavbarProps) {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, []);

//   return (
//     <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center space-x-3">
//             <WashingMachine className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
//             <h1 className="text-lg md:text-xl font-bold text-gray-900">FoldMate</h1>
//           </div>

//           {/* Desktop Search */}
//           <div className="hidden md:flex flex-1 max-w-md ml-8">
//             <div className="relative w-full">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search by product or washerman name..."
//                 value={searchQuery}
//                 onChange={(e) => onSearchChange(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//               />
//             </div>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-4">
//             <Link to="/" className="text-slate-700 hover:text-blue-600">Home</Link>
//             <Link to="/about" className="text-slate-700 hover:text-blue-600">About</Link>
//             <Link to="/contact" className="text-slate-700 hover:text-blue-600">Contact</Link>
//             <Link to="/orders" className="text-slate-700 hover:text-blue-600">Order</Link>

//             {!isLoggedIn ? (
//               <>
//                 <Link to="/signin" className="flex items-center text-slate-700 hover:text-blue-600">
//                   <User className="w-4 h-4 mr-1" />
//                   Sign In
//                 </Link>
//                 <Link to="/signup" className="flex items-center text-slate-700 hover:text-blue-600">
//                   <UserPlus className="w-4 h-4 mr-1" />
//                   Sign Up
//                 </Link>
//               </>
//             ) : (
//               <Link to="/customerdashboard" className="text-slate-700 hover:text-blue-600">
//                 Dashboard
//               </Link>
//             )}

//             {/* Cart */}
//             <button onClick={onCartClick} className="relative p-2 text-gray-700 hover:text-blue-600">
//               <ShoppingCart className="w-5 h-5" />
//               {cartItemCount && cartItemCount > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//                   {cartItemCount}
//                 </span>
//               )}
//             </button>

//             {/* Desktop Install Button */}
//             <InstallPWAButton />
//           </div>

//           {/* Mobile menu toggle */}
//           <button
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             className="md:hidden text-gray-800"
//             aria-label="Toggle menu"
//           >
//             {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>

//         {/* Mobile Search */}
//         <div className="md:hidden mt-2 mb-3">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
// {/*             <input
//               type="text"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => onSearchChange(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//             /> */}<input
//   type="text"
//   value={searchQuery}
//   onChange={(e) => onSearchChange(e.target.value)}
//   placeholder="Search services or washerman..."
//   className="border rounded px-3 py-2 w-full"
// />

//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden bg-white p-4 shadow-lg rounded-md">
//             <ul className="space-y-4">
//               <li><Link to="/" className="block text-slate-700 hover:text-blue-600">Home</Link></li>
//               <li><Link to="/about" className="block text-slate-700 hover:text-blue-600">About</Link></li>
//               <li><Link to="/contact" className="block text-slate-700 hover:text-blue-600">Contact</Link></li>
//               <li><Link to="/orders" className="block text-slate-700 hover:text-blue-600">Order</Link></li>
//               <li><InstallPWAButton /></li>
           
           
//               {!isLoggedIn ? (
//                 <>
//                   <li><Link to="/signin" className="block text-slate-700 hover:text-blue-600">Sign In</Link></li>
//                   <li><Link to="/signup" className="block text-slate-700 hover:text-blue-600">Sign Up</Link></li>
//                 </>
//               ) : (
//                 <li><Link to="/customerdashboard" className="block text-slate-700 hover:text-blue-600">Dashboard</Link></li>
//               )}

//               <li>
//                 <button
//                   onClick={onCartClick}
//                   className="relative flex items-center text-slate-700 hover:text-blue-600"
//                 >
//                   <ShoppingCart className="w-5 h-5 mr-1" />
//                   Cart
//                   {cartItemCount && cartItemCount > 0 && (
//                     <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
//                       {cartItemCount}
//                     </span>
//                   )}
//                 </button>
//               </li>
//             </ul>

//             {/* Mobile Install Button */}
       
//               <InstallPWAButton />
            
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }









import React, { useState, useEffect } from 'react';
import InstallPWAButton from './InstallPWAButton';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  WashingMachine,
  ShoppingCart,
  User,
  UserPlus,
  Menu,
  X,
} from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartItemCount?: number;
  onCartClick?: () => void;
}

export default function Navbar({
  searchQuery,
  onSearchChange,
  cartItemCount,
  onCartClick,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/orders', label: 'Order' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <WashingMachine className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            <h1 className="text-lg md:text-xl font-bold text-gray-900">FoldMate</h1>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md ml-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by product or washerman name..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-slate-700 hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}

            {!isLoggedIn ? (
              <>
                <Link to="/signin" className="flex items-center text-slate-700 hover:text-blue-600">
                  <User className="w-4 h-4 mr-1" /> Sign In
                </Link>
                <Link to="/signup" className="flex items-center text-slate-700 hover:text-blue-600">
                  <UserPlus className="w-4 h-4 mr-1" /> Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/customerdashboard" className="text-slate-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-slate-700 hover:text-red-600">
                  Logout
                </button>
              </>
            )}

            {/* Cart */}
            <button onClick={onCartClick} className="relative p-2 text-gray-700 hover:text-blue-600">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            <InstallPWAButton />
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-800"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-2 mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search services or washerman..."
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white p-4 shadow-lg rounded-md">
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={handleLinkClick}
                    className="block text-slate-700 hover:text-blue-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              {!isLoggedIn ? (
                <>
                  <li><Link to="/signin" onClick={handleLinkClick} className="block text-slate-700 hover:text-blue-600">Sign In</Link></li>
                  <li><Link to="/signup" onClick={handleLinkClick} className="block text-slate-700 hover:text-blue-600">Sign Up</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/customerdashboard" onClick={handleLinkClick} className="block text-slate-700 hover:text-blue-600">Dashboard</Link></li>
                  <li><button onClick={handleLogout} className="block text-slate-700 hover:text-red-600">Logout</button></li>
                </>
              )}

              <li>
                <button
                  onClick={() => {
                    if (onCartClick) onCartClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="relative flex items-center text-slate-700 hover:text-blue-600"
                >
                  <ShoppingCart className="w-5 h-5 mr-1" /> Cart
                  {cartItemCount && cartItemCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </li>

              <li>
                <InstallPWAButton />
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

