'use client';

import { useCallback } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";



interface CounterProps {
  title: string;
  subtitle: string;
  value: number;
  onChange: (value: number) => void;
}
const Counter: React.FC<CounterProps> = ({
  title,
  subtitle,
  value,
  onChange
}) => {

  const onAdd = useCallback(() => {
    onChange(value + 1);
  }, [onChange, value]);

  const onReduce = useCallback(() => {
    // making sure we can reduce less than 1 
    if (value === 1) {
      return;
    };

    onChange(value - 1);

  }, [value, onChange])


  return (
    <div
      className="
      flex
      flex-row
      items-center
      justify-between
      "
    >
      <div className="flex flex-col">
        <div className="font-medium">
          {title}
        </div>
        <div className="font-light text-gray-600">
          {subtitle}
        </div>
      </div>

      <div className="flex flex-row items-center gap-4">

        {/* Reduce or minus button */}
        <div
          onClick={onReduce}
          className="
              w-10
              h-10
              rounded-full
              border-[1px]
              flex
              border-neutral-400
              items-center
              justify-center
              text-neutral-600
              cursor-pointer
              hover:opacity-80
              transition
            "
        >
          <AiOutlineMinus />
        </div>

        {/* showing current value */}
        <div className="font-light text-xl text-neutral-600">
          {value}
        </div>

        {/* ADD or plus button */}
        <div
          onClick={onAdd}
          className="
              w-10
              h-10
              rounded-full
              border-[1px]
              flex
              border-neutral-400
              items-center
              justify-center
              text-neutral-600
              cursor-pointer
              hover:opacity-80
              transition
            "
        >
          <AiOutlinePlus />
        </div>

      </div>

    </div>
  )
}

export default Counter