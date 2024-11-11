import React, { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface DropdownOption {
    key: string;
    value: string;
    url: string;
}

interface DropdownProps {
    label: string;
    options: DropdownOption[];
}
const CustomDropdown: React.FC<DropdownProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false)
    return (

        <div className="relative inline-block text-left">
            <button
                id="dropdownHoverButton"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                className="text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                type="button"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                {props.label}
                {
                    !isOpen ? <KeyboardArrowDownIcon className='!text-lg' /> : <KeyboardArrowUpIcon className='!text-lg' />
                }
            </button>
            {isOpen && (
                <div
                    id="dropdownHover"
                    className="absolute z-10 bg-white rounded-lg shadow"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                >
                    <ul className="py-2 text-sm" aria-labelledby="dropdownHoverButton">
                        {
                            props.options.map(ele => {
                                return (<li key={ele.key}>
                                    <a href={ele.url} className="block mx-2 py-2 px-2 hover:bg-[#f2f2f2] font-semibold text-[16px] rounded-lg whitespace-nowrap">
                                        {ele.value}
                                    </a>
                                </li>)
                            })
                        }
                    </ul>
                </div>
            )}
        </div>

    )
}

export default CustomDropdown