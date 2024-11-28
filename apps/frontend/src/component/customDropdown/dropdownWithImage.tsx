import React, { useState } from "react";
import { CustomDropdownWithImageProps } from "../../types";


const CustomDropdownWithImage: React.FC<CustomDropdownWithImageProps> = ({
    elementList,
    selectedElementId,
    onSelect,
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);
    const handleOptionSelect = (elementId: string) => {
        onSelect(elementId);
        setDropdownOpen(false);
    };

    return (
        <div className="relative w-[300px]">
            <div
                className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onClick={toggleDropdown}
            >
                {selectedElementId ? (
                    <>
                        <img
                            src={
                                elementList.find((el) => el.id === selectedElementId)?.image || ""
                            }
                            alt="img"
                            className="w-6 h-6 rounded-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const circle = document.createElement("div");
                                circle.style.width = "14px";
                                circle.style.height = "14px";
                                circle.style.borderRadius = "50%";
                                circle.style.backgroundColor = "white";
                                e.currentTarget.parentNode?.insertBefore(circle, e.currentTarget);
                            }}
                        />
                        <span>{selectedElementId}</span>
                    </>
                ) : (
                    "Select Element"
                )}
            </div>
            {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-full bg-white border rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600 z-50">
                    {elementList.map((el) => (
                        <div
                            key={el.id}
                            onClick={() => handleOptionSelect(el.id)}
                            className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
                        >
                            <img
                                src={el.image}
                                alt={el.id}
                                className="w-6 h-6 rounded-sm"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    const circle = document.createElement("div");
                                    circle.style.width = "14px";
                                    circle.style.height = "14px";
                                    circle.style.borderRadius = "50%";
                                    circle.style.backgroundColor = "white";
                                    e.currentTarget.parentNode?.insertBefore(circle, e.currentTarget);
                                }}
                            />
                            <span className="truncate w-full overflow-hidden whitespace-nowrap">{el.id}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdownWithImage;
