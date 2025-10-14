import { RiSettings3Line } from "react-icons/ri";

export function MobileSettingsButton({toggleMobileMenu}:{toggleMobileMenu: () => void}) {
    return (
        <button 
            onClick={toggleMobileMenu } 
            className="fixed bottom-28 right-6 z-40 inline-flex h-10 w-10 items-center justify-center rounded-lg border bg-white p-0 shadow-none transition-colors duration-200 hover:bg-gray-100 active:bg-gray-200 "
        >
            <RiSettings3Line width={5} height={5}/>
        </button>
    )
}