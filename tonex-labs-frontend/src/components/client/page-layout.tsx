"use client";
import type { ServiceType } from "~/types/services"
import Sidebar from "./sidebar"
import { useEffect } from "react"
import { useUIStore } from "~/stores/ui-store"
import { AudioLines, FileVolume, GalleryVerticalEnd, Menu, Pen, Speech, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SpeechSidebar } from "./speech-synthesis/right-sidebar";
import type { HistoryItem } from "~/lib/history";
import Playbar from "./playbar";
import { useAudioStore } from "~/stores/audio-store";
import { MobileSettingsButton } from "./speech-synthesis/mobile-settings-button";

interface TabItem {
    name: string,
    path: string,
}

export function PageLayout(
    { title, children, service, showSidebar, tabs, historyItems }: 
    { title: string, children: React.ReactNode, service: ServiceType, showSidebar: boolean, tabs?: TabItem[], historyItems?: HistoryItem[] }) {

        const {isMobileDrawerOpen, isMobileScreen, toggleMobileDrawer, toggleMobileMenu, setMobileScreen} = useUIStore();
        const {currentAudio} = useAudioStore();
        const pathname = usePathname();

        useEffect(() => {
            const checkScreenSize = () => {
                setMobileScreen( window.innerWidth < 1024);
            }
            window.addEventListener("resize", checkScreenSize);

            return () => window.removeEventListener("resize", checkScreenSize);
        }, [setMobileScreen]);

    return (
        <div className="flex h-screen">
            <div className="hidden lg:block">
                <Sidebar />    
            </div>

            {/* Gray overlay */}
            {isMobileScreen && isMobileDrawerOpen && (
                <div className="fixed inset-0 z-40 bg-black opacity-50">

                </div>
            )}

            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileDrawerOpen ? "translate-x-0" : "-translate-x-full" }`}>
                <div className="relative h-full w-64 bg-white shadow-lg">
                    <button onClick={toggleMobileDrawer} className="absolute right-2 top-2 rounded-full p-2 text-gray-500 hover:bg-gray-100">
                        <X  />
                    </button>
                    <Sidebar isMobile={true}/>
                </div>
            </div>    

            <div className="flex flex-1 flex-col overflow-hidden">
                <div className="border-b border-gray-200">
                    <div className="flex h-16 items-center px-4">
                        {isMobileScreen && (
                            <button onClick={toggleMobileDrawer} className="mr-3 rounded-lg hover:bg-gray-100 lg:hidden">
                                <Menu className="h-6 w-6"/>
                            </button>
                        )}
                        <h1 className="text-md font-semibold">
                            {title === "TEXT TO SPEECH" ? 
                            <div className="flex gap-2 items-center">
                                <div className="border border-gray-200 rounded-full"><FileVolume className="h-8 w-8 p-1.5 font-normal"/></div>
                                <span>{title}</span>
                            </div> 
                            : title === "VOICE CHANGER" ? <div className="flex gap-2 items-center">
                                <div className="border border-gray-200 rounded-full"><Speech className="h-8 w-8 p-1.5 font-normal"/></div>
                                    <span>{title}</span>
                                </div> 
                            : 
                            <div className="flex gap-2 items-center">
                                <div className="border border-gray-200 rounded-full"><AudioLines className="h-8 w-8 p-1.5 font-normal"/></div>
                                <span>{title}</span>
                            </div> }
                        </h1>

                        {tabs && tabs.length>0 && (
                            <div className="ml-4 flex items-center">
                                {tabs.map((tab) => (
                                    <Link className={`mr-2 rounded-full px-3 py-1 text-sm transition-colors duration-200 ${ pathname === tab.path ? "bg-black text-white" : "text-gray-500 hover:text-gray-700"}`} key={tab.path} href={tab.path}>
                                        {tab.name === "Generate" ? 
                                        <div className="flex gap-1">
                                            <span>{tab.name}</span>
                                            <Pen className="h-4 w-4"/>
                                        </div> 
                                        : 
                                        <div className="flex gap-1">
                                            <span>{tab.name}</span>
                                            <GalleryVerticalEnd className="h-5 w-4"/>
                                        </div> 
                                        }
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>    
                </div>

                <div className="flex-1 overflow-auto">
                    <div className="flex h-full">
                        <div className="flex-1 px-6 py-5">
                            <div className="flex h-full flex-col">
                                {children}
                            </div>
                        </div>

                        {showSidebar && service && (
                            <SpeechSidebar service={service} historyItems={historyItems}/>
                        )}
                    </div>
                </div> 

                {isMobileScreen && !pathname.includes("/app/sound-effects") && (
                    <MobileSettingsButton toggleMobileMenu={toggleMobileMenu}/>
                )}

                {currentAudio && <Playbar />}
            </div>        
        </div>
    )
}