const Logo = () => {
  return (
    <div className="w-32 h-40 relative">
      <div className="absolute inset-0 bg-hyria-secondary clip-shield"> {/* Cambiato da bg-orange-500 a bg-hyria-secondary */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-4xl font-bold">HB</div> {/* Cambiato da text-black a text-white */}
        </div>
      </div>
    </div>
  );
};

export default Logo;