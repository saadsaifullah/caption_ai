import { Link } from 'react-router-dom';

const Header = () => (
  <header className="container mx-auto px-6 py-6">
    <nav className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Texotica Caption AI</h1>
      <ul className="hidden md:flex items-center space-x-8 text-gray-300">
  <li><Link to="/" className="hover:text-white">Home</Link></li>
        <li><a href="CaptionTool" className="hover:text-white transition-colors">App</a></li>
        <li><a href="subscribe" className="hover:text-white transition-colors">Subscribe</a></li>
  <li><Link to="/how-it-works" className="text-white font-semibold">How To Use</Link></li>
      </ul>
    </nav>
  </header>
);
export default Header;
