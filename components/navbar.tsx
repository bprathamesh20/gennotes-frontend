import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white text-gray-900  px-4 py-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">gennotes</div>
        {/* Add other nav items here if needed */}
      </div>
    </nav>
  );
};

export default Navbar;