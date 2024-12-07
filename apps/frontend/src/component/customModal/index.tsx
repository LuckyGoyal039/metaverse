import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { CreateAvatarDataSchema, CreateElementDataSchema, CreateMapDataSchema, CreateSpaceDataSchema, CustomModalProps } from "../../types";
import CustomDropdownWithImage from "../customDropdown/dropdownWithImage";
import Spinner from "../spinner";
import { toast } from "react-toastify";

// interface MapsDataSchema {
//     id: string,
//     name: string,
//     thumbnail: string,
//     width: number,
//     height: number
// }
interface MapsDataSchema {
    id: string,
    name: string,
    thumbnail: string,
}

type formDataSchema = CreateAvatarDataSchema | CreateElementDataSchema | CreateMapDataSchema | CreateSpaceDataSchema

const CustomModal: React.FC<CustomModalProps<CreateElementDataSchema | CreateMapDataSchema | CreateAvatarDataSchema | CreateSpaceDataSchema
>> = ({ modalName, cancel, callback }) => {
    const [createElementForm, setCreateElementForm] = useState<CreateElementDataSchema>({
        imageUrl: "",
        static: false,
        width: 0,
        height: 0,
    });
    const [createAvatarForm, setCreateAvatarForm] = useState<CreateAvatarDataSchema>({
        imageUrl: "",
        name: ""
    });
    const [createSpaceForm, setCreateSpaceForm] = useState<CreateSpaceDataSchema>({
        name: "",
        dimensions: "500x500",
        mapId: "",
    });
    const [createMapForm, setCreateMapForm] = useState<CreateMapDataSchema>({
        thumbnail: "",
        dimensions: "",
        name: "",
        defaultElements: [{ elementId: "", x: 0, y: 0 }]
    });
    const [elementList, setElementList] = useState([])
    const [mapList, setMapList] = useState([])
    const [selectedMap, setSelectedMap] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        let parsedValue: any;
        if (type === "checkbox") {
            parsedValue = e.target.checked; // For checkboxes, use the "checked" property
        } else if (type === "number") {
            parsedValue = Number(value); // Convert numbers to actual numbers
        } else if (e.target.tagName === "SELECT" && (value === "true" || value === "false")) {
            parsedValue = value === "true"; // Handle boolean select inputs
        } else {
            parsedValue = value; // For everything else, use the value directly
        }

        setCreateElementForm((prev) => ({
            ...prev,
            [name]: parsedValue,
        }));
    };


    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCreateAvatarForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSpaceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCreateSpaceForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleMapSelect = (mapId: string) => {
        setSelectedMap(mapId)
        setCreateSpaceForm((prev) => ({
            ...prev,
            mapId,
        }));
    };
    const handleMapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCreateMapForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDefaultElementChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number,
        field: "elementId" | "x" | "y"
    ) => {
        const value = field === "elementId" ? e.target.value : Number(e.target.value);
        setCreateMapForm((prev) => {
            const updatedElements = [...prev.defaultElements];
            updatedElements[index] = { ...updatedElements[index], [field]: value };
            return { ...prev, defaultElements: updatedElements };
        });
    };

    const handleDropdownChange = (id: string, index: number) => {
        setCreateMapForm((prev) => {
            const updatedElements = [...prev.defaultElements];
            updatedElements[index] = { ...updatedElements[index], elementId: id };
            return { ...prev, defaultElements: updatedElements };
        });
    };

    const addDefaultElement = () => {
        setCreateMapForm((prev) => ({
            ...prev,
            defaultElements: [...prev.defaultElements, { elementId: "", x: 0, y: 0 }],
        }));
    };
    const getAllElements = async () => {
        try {
            const HTTP_SERVER_URL = import.meta.env.VITE_HTTP_SERVER_URL
            const url = `${HTTP_SERVER_URL}/elements`;
            const token = localStorage.getItem('token');
            const resp = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const respJson = await resp.json()
            setElementList(respJson)
        } catch (err) {
            console.log("something went wrong. unable to get the elements")
        }
    }
    const getAllMaps = async () => {
        try {
            const HTTP_SERVER_URL = import.meta.env.VITE_HTTP_SERVER_URL
            const url = `${HTTP_SERVER_URL}/user/all-maps`;
            const token = localStorage.getItem('token');
            const resp = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const respJson = await resp.json()
            setMapList(respJson)
            console.log(respJson)
            setCreateSpaceForm((prev) => ({
                ...prev,
                mapId: respJson[0].id,
            }));
        } catch (err) {
            console.log("something went wrong. unable to get the elements")
        }
    }

    const handleSubmit = async (formData: formDataSchema) => {
        try {
            setLoading(true)
            callback(formData)
        } catch (err) {
            console.log("submit form error: ", err)
            toast.error("Cannot submit form", {
                position: "top-center"
            })
        }
    }

    useEffect(() => {
        switch (modalName) {
            case 'create-map': getAllElements()
                break
            case 'create-space': getAllMaps()
        }

    }, [])

    const renderContent = () => {
        switch (modalName) {
            case "create-element": return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative w-full max-w-md p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{modalName}</h3>
                        <button
                            onClick={cancel}
                            className="text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg p-1 focus:outline-none"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image URL</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={createElementForm.imageUrl}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Enter image URL"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Static</label>
                            <select
                                name="static"
                                value={createElementForm.static ? "true" : "false"}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Width</label>
                            <input
                                type="number"
                                name="width"
                                value={createElementForm.width}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="Enter width"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Height</label>
                            <input
                                type="number"
                                name="height"
                                value={createElementForm.height}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                placeholder="Enter height"
                            />
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end space-x-2 p-4 border-t dark:border-gray-700">
                        <button
                            onClick={cancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleSubmit(createElementForm)}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>)

            case "create-avatar":
                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative w-full max-w-md p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">

                            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{modalName}</h3>
                                <button
                                    onClick={cancel}
                                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg p-1 focus:outline-none"
                                >
                                    <CloseIcon />
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image URL</label>
                                    <input
                                        type="text"
                                        name="imageUrl"
                                        value={createAvatarForm.imageUrl}
                                        onChange={handleAvatarChange}
                                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter image URL"
                                    />
                                </div>


                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={createAvatarForm.name}
                                        onChange={handleAvatarChange}
                                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter name"
                                    />
                                </div>
                            </div>


                            <div className="flex justify-end space-x-2 p-4 border-t dark:border-gray-700">
                                <button
                                    onClick={cancel}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleSubmit(createAvatarForm)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    {loading ? <Spinner /> : "Submit"}
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case "create-space":
                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative w-full max-w-md p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">

                            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{modalName}</h3>
                                <button
                                    onClick={cancel}
                                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg p-1 focus:outline-none"
                                >
                                    <CloseIcon />
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Space Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={createSpaceForm.name}
                                        onChange={handleSpaceChange}
                                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter name"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Map</label>
                                    <ul className="flex gap-4 flex-wrap max-h-52 overflow-y-auto px-5">
                                        {
                                            mapList.map((ele: MapsDataSchema) => {
                                                return <div className={`rounded-xl border flex flex-col justify-center text-center text-white 
                                                hover:scale-105 transition-all duration-300 ${selectedMap == ele.id ? "border-blue-500 scale-102" : ""}`}
                                                    key={ele.id}
                                                    onClick={() => handleMapSelect(ele.id)}>
                                                    <div>
                                                        <img src={ele.thumbnail} alt='map-image' className="w-24 h-24 rounded-tl-xl rounded-tr-xl" />
                                                    </div>
                                                    <p>{ele.name}</p>
                                                </div>
                                            })
                                        }
                                    </ul>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 p-4 border-t dark:border-gray-700">
                                <button
                                    onClick={cancel}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleSubmit(createSpaceForm)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    {loading ? <Spinner /> : "Submit"}
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case "create-map":
                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative w-full max-w-lg p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">

                            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{modalName}</h3>
                                <button
                                    onClick={cancel}
                                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg p-1 focus:outline-none"
                                >
                                    <CloseIcon />
                                </button>
                            </div>

                            <div className="p-4 space-y-4">

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Thumbnail URL
                                    </label>
                                    <input
                                        type="text"
                                        name="thumbnail"
                                        value={createMapForm.thumbnail}
                                        onChange={handleMapChange}
                                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter thumbnail URL"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Dimensions
                                    </label>
                                    <input
                                        type="text"
                                        name="dimensions"
                                        value={createMapForm.dimensions}
                                        onChange={handleMapChange}
                                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter dimensions (e.g., '1024x768')"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Map Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={createMapForm.name}
                                        onChange={handleMapChange}
                                        className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        placeholder="Enter map name"
                                    />
                                </div>

                                <div className="max-h-[200px] min-h-[100px] overflow-y-scroll hide-scrollbar">
                                    {createMapForm.defaultElements.map((element, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 mb-4 w-full"
                                        >
                                            <CustomDropdownWithImage
                                                elementList={elementList}
                                                selectedElementId={element.elementId}
                                                onSelect={(id) => handleDropdownChange(id, index)}
                                            />
                                            <input
                                                type="number"
                                                value={element.x}
                                                onChange={(e) => handleDefaultElementChange(e, index, "x")}
                                                placeholder="X Position"
                                                className="w-20 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />

                                            <input
                                                type="number"
                                                value={element.y}
                                                onChange={(e) => handleDefaultElementChange(e, index, "y")}
                                                placeholder="Y Position"
                                                className="w-20 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={addDefaultElement}
                                    className="px-4 py-2 mt-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600"
                                >
                                    Add Element
                                </button>
                            </div>

                            <div className="flex justify-end space-x-2 p-4 border-t dark:border-gray-700">
                                <button
                                    onClick={cancel}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { handleSubmit(createMapForm) }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    {loading ? <Spinner /> : "Submit"}

                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    }
    return renderContent()
};

export default CustomModal;
