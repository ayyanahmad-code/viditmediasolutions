import { motion } from "framer-motion";

// IMPORT IMAGE
import Img1 from "../Images/DesignGallery/Image-1.jpg";

const DesignGallery = () => {
  return (
    <section className="overflow-hidden bg-white">
      <motion.img
        src={Img1}
        alt="Design Gallery"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className=""
      />
    </section>
  );
};

export default DesignGallery;
