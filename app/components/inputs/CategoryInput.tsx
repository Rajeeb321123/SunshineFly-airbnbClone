'use client';

// for input category
// eg: used in Rent Modal.tsx

import { IconType } from "react-icons";

interface CategoryInputProps {
    icon: IconType;
    label: string;
    selected?: boolean;
    onClick: (value:string) => void;
}

const CategoryInput: React.FC<CategoryInputProps> = ({
    icon:Icon,
    label,
    selected,
    onClick,
}) => {
  return (
    <div>
        <div
            // setting the coming cate from rentModal.tsx with label
            onClick={() => onClick(label)}
            className={`
            rounded-xl
            border-2
            p-4
            flex
            flex-col
            gap-3
            hover:border-black
            transition
            cursor-pointer
            ${selected ? 'border-black' : 'border-neutral-200' }
            `}
        >
            <Icon size={30} />
            <div className="font font-semibold ">
                {label}
            </div>
        </div>
    </div>
  )
}

export default CategoryInput