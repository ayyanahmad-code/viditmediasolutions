const StatsSection = () => {
return (
<section className="py-16 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white shadow-md rounded-lg p-10">
            <h2 className="text-gray-900 font-semibold mb-2 text-2xl ">TRAFFIC</h2>
            <hr/>
            <p className="text-2xl font-bold text-gray-500">97%</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-10">
            <h3 className="text-gray-900 font-semibold mb-2 text-2xl">LEADS</h3>
            <hr/>
            <p className="text-2xl font-bold text-gray-500">1500+</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-10">
            <h3 className="text-gray-900 font-semibold mb-2 text-2xl">CLIENTS</h3>
            <hr/>
            <p className="text-2xl font-bold text-gray-500">200+</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-10">
            <h3 className="text-gray-900 font-semibold mb-2 text-2xl">VISITS</h3>
            <hr/>
            <p className="text-2xl font-bold text-gray-500">2390+</p>
          </div>
        </div>
      </section>
      );
};
export default StatsSection;