import Image from "next/image";
import logo from "@/assets/ChemicallyLogo.webp";

const Header = () => {
    return ( 
        <div className="
            text-center pt-[1.2rem] text-black text-[25px] font-light
        ">
            
            <span>Chemical.ly</span>
            <div className="relative w-[250px] h-[100px] mx-auto mt-[3rem]">
                <Image
                src={logo}
                alt="Chemical.ly Logo"
                fill
                className="object-contain"
                />
            </div>
            <span className="block mt-[3rem] text-[32px]">Reduce, Reuse</span>
        </div>
     );
}
 
export default Header;